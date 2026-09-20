package org.example.interfaces.controller;

import org.example.application.service.UserService;
import org.example.application.usecase.CreateUser;
import org.example.domain.model.UserModel;
import org.example.interfaces.dto.request.CreateUserRequest;
import org.example.interfaces.dto.response.CreateUserResponse;
import org.example.interfaces.mapper.UserDtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final CreateUser createUser;
    private final UserDtoMapper userDtoMapper;

    @Autowired
    public UserController(
            UserService userService,
            CreateUser createUser,
            UserDtoMapper userDtoMapper
    ) {
        this.userService = userService;
        this.createUser = createUser;
        this.userDtoMapper = userDtoMapper;
    }

    @GetMapping
    public List<CreateUserResponse> getAll() {
        return userService.getAllUsers()
                .stream()
                .map(userDtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CreateUserResponse getById(@PathVariable Long id) {
        UserModel user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userDtoMapper.toResponse(user);
    }

    @PostMapping
    public CreateUserResponse create(@RequestBody CreateUserRequest request) {
        UserModel userModel = userDtoMapper.toDomain(request);
        UserModel createdUser = createUser.execute(userModel);

        return userDtoMapper.toResponse(createdUser);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/by-username/{username}")
    public CreateUserResponse getByUsername(@PathVariable String username) {
        UserModel user = userService.getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found by username"));

        return userDtoMapper.toResponse(user);
    }

    @GetMapping("/by-email/{email}")
    public CreateUserResponse getByEmail(@PathVariable String email) {
        UserModel user = userService.getByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found by email"));

        return userDtoMapper.toResponse(user);
    }
}

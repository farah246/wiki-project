package org.example.interfaces.controller;

import org.example.application.service.CurrentUserService;
import org.example.domain.model.UserModel;
import org.example.interfaces.dto.response.CreateUserResponse;
import org.example.interfaces.mapper.UserDtoMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDtoMapper userDtoMapper;
    private final CurrentUserService currentUserService;

    public UserController(
            UserDtoMapper userDtoMapper,
            CurrentUserService currentUserService
    ) {
        this.userDtoMapper = userDtoMapper;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public CreateUserResponse getCurrentUser(Authentication authentication) {
        UserModel user = currentUserService.getCurrentUser(authentication);

        return userDtoMapper.toResponse(user);
    }
}
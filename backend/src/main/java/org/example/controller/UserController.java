package org.example.controller;

import org.example.infrastructure.persistence.entity.User;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/by-username/{username}")
    public User getByUsername(@PathVariable String username) {
        return userService.getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found by username"));
    }

    @GetMapping("/by-email/{email}")
    public User getByEmail(@PathVariable String email) {
        return userService.getByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found by email"));
    }
}

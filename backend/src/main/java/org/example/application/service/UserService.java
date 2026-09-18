package org.example.application.service;

import org.example.application.gateway.UserGateway;
import org.example.domain.model.UserModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserGateway userGateway;

    public UserService(UserGateway userGateway) {
        this.userGateway = userGateway;
    }

    public List<UserModel> getAllUsers() {
        return userGateway.findAll();
    }

    public Optional<UserModel> getUserById(Long id) {
        return userGateway.findById(id);
    }

    public UserModel saveUser(UserModel user) {
        return userGateway.create(user);
    }

    public void deleteUser(Long id) {
        userGateway.deleteById(id);
    }

    public Optional<UserModel> getByUsername(String username) {
        return userGateway.findByUsername(username);
    }

    public Optional<UserModel> getByEmail(String email) {
        return userGateway.findByEmail(email);
    }
}

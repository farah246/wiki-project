package org.example.application.service;

import org.example.domain.model.UserModel;
import org.example.interfaces.dto.request.CreateUserRequest;
import org.springframework.stereotype.Service;

@Service
public class UserObjectValidation {

    public String validateUserModel(UserModel userModel) {
        if (userModel.username() == null || userModel.username().isEmpty()) {
            return "Username is required";
        } else if (userModel.passwordHash() == null || userModel.passwordHash().isEmpty()) {
            return "Password hash is required";
        } else if (userModel.email() == null || userModel.email().isEmpty()) {
            return "Email is required";
        }

        return null;
    }

    public String validateCreateUserRequest(CreateUserRequest createUserRequest) {
        if (createUserRequest.getUsername() == null || createUserRequest.getUsername().isEmpty()) {
            return "Username is required";
        } else if (createUserRequest.getPassword() == null || createUserRequest.getPassword().isEmpty()) {
            return "Password is required";
        } else if (createUserRequest.getEmail() == null || createUserRequest.getEmail().isEmpty()) {
            return "Email is required";
        }

        return null;
    }
}

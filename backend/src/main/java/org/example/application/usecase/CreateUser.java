package org.example.application.usecase;

import org.example.application.gateway.UserGateway;
import org.example.domain.model.UserModel;
import org.springframework.stereotype.Service;

@Service
public class CreateUser {

    private final UserGateway userGateway;

    public CreateUser(UserGateway userGateway) {
        this.userGateway = userGateway;
    }

    public UserModel execute(UserModel user) {
        return userGateway.create(user);
    }

}
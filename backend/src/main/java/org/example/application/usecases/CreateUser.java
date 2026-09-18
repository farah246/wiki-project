package org.example.application.usecases;

import org.example.application.gateways.UserGateway;
import org.example.domain.model.UserModel;

public class CreateUser {

    private final UserGateway userGateway;

    public CreateUser(UserGateway userGateway) {
        this.userGateway = userGateway;
    }

    public UserModel execute(UserModel user) {
        return userGateway.create(user);
    }

}
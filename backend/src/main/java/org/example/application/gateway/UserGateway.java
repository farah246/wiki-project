package org.example.application.gateway;

import org.example.domain.model.UserModel;

import java.util.List;
import java.util.Optional;

public interface UserGateway {

    UserModel create(UserModel user);

    List<UserModel> findAll();

    Optional<UserModel> findById(Long id);

    void deleteById(Long id);

    Optional<UserModel> findByUsername(String username);

    Optional<UserModel> findByEmail(String email);
}

package org.example.infrastructure.gateways;

import org.example.application.gateways.UserGateway;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.User;
import org.example.infrastructure.persistence.repository.UserRepository;
import org.example.interfaces.mappers.UserEntityMapper;

public class UserRepositoryGateway implements UserGateway {

    private final UserRepository userRepository;
    private final UserEntityMapper userMapper;

    public UserRepositoryGateway(UserRepository userRepository, UserEntityMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserModel create(UserModel user) {
        User userEntity = userMapper.toEntity(user);
        User saved = userRepository.save(userEntity);

        return userMapper.toDomain(saved);
    }

}
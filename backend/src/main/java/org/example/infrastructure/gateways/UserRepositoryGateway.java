package org.example.infrastructure.gateways;

import org.example.application.gateway.UserGateway;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.User;
import org.example.infrastructure.persistence.mapper.UserEntityMapper;
import org.example.infrastructure.persistence.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserRepositoryGateway implements UserGateway {

    private final UserRepository userRepository;
    private final UserEntityMapper userMapper;

    public UserRepositoryGateway(
            UserRepository userRepository,
            UserEntityMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserModel create(UserModel user) {
        User userEntity = userMapper.toEntity(user);
        User saved = userRepository.save(userEntity);

        return userMapper.toDomain(saved);
    }

    @Override
    public List<UserModel> findAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<UserModel> findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserModel> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toDomain);
    }

    @Override
    public Optional<UserModel> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDomain);
    }
}

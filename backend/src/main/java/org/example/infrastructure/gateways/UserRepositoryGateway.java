package org.example.infrastructure.gateways;

import org.example.application.gateway.UserGateway;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.Role;
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

    // Updates only the role of an existing row. userMapper.toEntity() does not
    // carry the id, so create() cannot be used to update a user.
    @Override
    public UserModel updateRole(Long id, String role) {
        User userEntity = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found: " + id));

        userEntity.setRole(Role.valueOf(role.toUpperCase()));

        return userMapper.toDomain(userRepository.save(userEntity));
    }

    // Same as updateRole: only the username of an existing row changes
    @Override
    public UserModel updateUsername(Long id, String username) {
        User userEntity = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found: " + id));

        userEntity.setUsername(username);

        return userMapper.toDomain(userRepository.save(userEntity));
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

    @Override
    public Optional<UserModel> findByClerkUserId(String clerkUserId) {
        return userRepository.findByClerkUserId(clerkUserId)
                .map(userMapper::toDomain);
    }
}
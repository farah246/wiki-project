package org.example.interfaces.mapper;

import org.example.domain.model.UserModel;
import org.example.interfaces.dto.request.CreateUserRequest;
import org.example.interfaces.dto.response.CreateUserResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserDtoMapper {

    private final BCryptPasswordEncoder passwordEncoder;

    public UserDtoMapper() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public CreateUserResponse toResponse(UserModel domainObject) {
        return new CreateUserResponse(
                domainObject.id(),
                domainObject.username(),
                domainObject.email(),
                domainObject.role(),
                domainObject.createdAt(),
                domainObject.updatedAt()
        );
    }

    public UserModel toDomain(CreateUserRequest request) {
        return new UserModel(
                null,
                request.getUsername(),
                request.getEmail(),
                request.getRole() != null ? request.getRole().name() : null,
                passwordEncoder.encode(request.getPassword()),
                null,
                null
        );
    }
}

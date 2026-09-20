package org.example.interfaces.mapper;

import org.example.interfaces.dto.request.CreateUserRequest;
import org.example.interfaces.dto.response.CreateUserResponse;
import org.example.domain.model.UserModel;
import org.springframework.stereotype.Component;
@Component
public class UserDtoMapper {

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
                request.getRole() != null ? request.getRole() : "USER",
                request.getPassword(),
                null,
                null
        );
    }}
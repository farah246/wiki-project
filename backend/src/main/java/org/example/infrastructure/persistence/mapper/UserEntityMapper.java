package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.Role;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserEntityMapper {

    public User toEntity(UserModel domainObject) {
        User userEntity = new User();

        userEntity.setClerkUserId(domainObject.clerkUserId());
        userEntity.setUsername(domainObject.username());
        userEntity.setEmail(domainObject.email());

        if (domainObject.role() != null) {
            userEntity.setRole(Role.valueOf(domainObject.role().toUpperCase()));
        }

        return userEntity;
    }

    public UserModel toDomain(User entityObject) {
        return new UserModel(
                entityObject.getId(),
                entityObject.getClerkUserId(),
                entityObject.getUsername(),
                entityObject.getEmail(),
                entityObject.getRole() != null
                        ? entityObject.getRole().name()
                        : null,
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt()
        );
    }
}
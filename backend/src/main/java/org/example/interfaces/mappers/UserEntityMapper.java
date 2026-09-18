package org.example.interfaces.mappers;

import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.User;

public class UserEntityMapper {

    public User toEntity(UserModel domainObject) {
        User userEntity = new User();

        userEntity.setUsername(domainObject.username());
        //userEntity.setPassword(domainObject.password());
        userEntity.setEmail(domainObject.email());

        return userEntity;
    }

    public UserModel toDomain(User entityObject) {
        return new UserModel(
                entityObject.getId(),
                entityObject.getUsername(),
                entityObject.getEmail(),
                entityObject.getRole(),
                entityObject.getPasswordHash(),
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt()
        );
    }

}

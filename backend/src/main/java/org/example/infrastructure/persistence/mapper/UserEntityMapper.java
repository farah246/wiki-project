package org.example.infrastructure.persistence.mapper;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;
@Component
public class UserEntityMapper {

    public User toEntity(UserModel domainObject) {
        User userEntity = new User();

        userEntity.setUsername(domainObject.username());
        userEntity.setEmail(domainObject.email());
        userEntity.setRole(domainObject.role());
        userEntity.setPasswordHash(domainObject.passwordHash());

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

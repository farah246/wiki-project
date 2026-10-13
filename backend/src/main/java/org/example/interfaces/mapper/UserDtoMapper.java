package org.example.interfaces.mapper;

import org.example.domain.model.UserModel;
import org.example.interfaces.dto.response.CreateUserResponse;
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


}
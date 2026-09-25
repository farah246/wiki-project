package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.ProcedureModel;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.Procedure;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProcedureEntityMapper {

    public Procedure toEntity(ProcedureModel domainObject) {
        Procedure entity = new Procedure();
        entity.setId(domainObject.id());

        entity.setTitle(domainObject.title());
        entity.setDescription(domainObject.description());
        entity.setVisualModel(domainObject.visualModel());

        if (domainObject.user() != null) {
            User user = new User();
            user.setId(domainObject.user().id());
            entity.setUser(user);
        }

        return entity;
    }

    public ProcedureModel toDomain(Procedure entityObject) {
        UserModel userModel = null;

        if (entityObject.getUser() != null) {
            User user = entityObject.getUser();

            userModel = new UserModel(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getPasswordHash(),
                    user.getCreatedAt(),
                    user.getUpdatedAt()
            );
        }

        return new ProcedureModel(
                entityObject.getId(),
                entityObject.getTitle(),
                entityObject.getDescription(),
                entityObject.getVisualModel(),
                userModel,
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt()
        );
    }
}
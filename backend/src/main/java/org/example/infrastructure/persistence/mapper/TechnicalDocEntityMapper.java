package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.TechnicalDocModel;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;

@Component
public class TechnicalDocEntityMapper {

    public TechnicalDoc toEntity(TechnicalDocModel domainObject) {
        TechnicalDoc entity = new TechnicalDoc();

        entity.setTitle(domainObject.title());
        entity.setContent(domainObject.content());
        entity.setCodeSnippet(domainObject.codeSnippet());
        entity.setGitRef(domainObject.gitRef());

        if (domainObject.user() != null) {
            User user = new User();
            user.setId(domainObject.user().id());
            entity.setUser(user);
        }

        return entity;
    }

    public TechnicalDocModel toDomain(TechnicalDoc entityObject) {
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

        return new TechnicalDocModel(
                entityObject.getId(),
                entityObject.getTitle(),
                entityObject.getContent(),
                entityObject.getCodeSnippet(),
                entityObject.getGitRef(),
                userModel,
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt()
        );
    }
}
package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.CommercialDocModel;
import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CommercialDocEntityMapper {

    public CommercialDoc toEntity(CommercialDocModel domainObject) {
        CommercialDoc entity = new CommercialDoc();

        entity.setTitle(domainObject.title());
        entity.setProposalText(domainObject.proposalText());
        entity.setClientName(domainObject.clientName());

        if (domainObject.user() != null) {
            User user = new User();
            user.setId(domainObject.user().id());
            entity.setUser(user);
        }

        return entity;
    }

    public CommercialDocModel toDomain(CommercialDoc entityObject) {
        return new CommercialDocModel(
                entityObject.getId(),
                entityObject.getTitle(),
                entityObject.getProposalText(),
                entityObject.getUser() != null
                        ? new org.example.domain.model.UserModel(
                        entityObject.getUser().getId(),
                        entityObject.getUser().getUsername(),
                        entityObject.getUser().getEmail(),
                        entityObject.getUser().getRole(),
                        entityObject.getUser().getPasswordHash(),
                        entityObject.getUser().getCreatedAt(),
                        entityObject.getUser().getUpdatedAt()
                )
                        : null,
                entityObject.getClientName(),
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt()
        );
    }
}
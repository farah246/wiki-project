package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.DocHistoryModel;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.infrastructure.persistence.entity.Procedure;
import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;

@Component
public class DocHistoryEntityMapper {

    public DocHistory toEntity(DocHistoryModel domainObject) {
        DocHistory entity = new DocHistory();

        entity.setAction(domainObject.action());
        entity.setChange(domainObject.change());
        entity.setDocVersion(domainObject.docVersion());

        if (domainObject.user() != null) {
            User user = new User();
            user.setId(domainObject.user().id());
            entity.setUser(user);
        }

        if (domainObject.technicalDocId() != null) {
            TechnicalDoc technicalDoc = new TechnicalDoc();
            technicalDoc.setId(domainObject.technicalDocId());
            entity.setTechnicalDoc(technicalDoc);
        }

        if (domainObject.commercialDocId() != null) {
            CommercialDoc commercialDoc = new CommercialDoc();
            commercialDoc.setId(domainObject.commercialDocId());
            entity.setCommercialDoc(commercialDoc);
        }

        if (domainObject.procedureId() != null) {
            Procedure procedure = new Procedure();
            procedure.setId(domainObject.procedureId());
            entity.setProcedure(procedure);
        }

        return entity;
    }

    public DocHistoryModel toDomain(DocHistory entityObject) {
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

        return new DocHistoryModel(
                entityObject.getId(),
                entityObject.getTechnicalDoc() != null
                        ? entityObject.getTechnicalDoc().getId()
                        : null,
                entityObject.getCommercialDoc() != null
                        ? entityObject.getCommercialDoc().getId()
                        : null,
                entityObject.getProcedure() != null
                        ? entityObject.getProcedure().getId()
                        : null,
                userModel,
                entityObject.getAction(),
                entityObject.getChange(),
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt(),
                entityObject.getDocVersion()
        );
    }
}
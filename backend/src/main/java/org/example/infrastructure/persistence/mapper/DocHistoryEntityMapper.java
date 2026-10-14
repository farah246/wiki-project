package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.DocHistoryModel;
import org.example.domain.model.UserModel;
import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.infrastructure.persistence.entity.Procedure;
import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.example.infrastructure.persistence.entity.User;
import org.springframework.stereotype.Component;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.ActivityEntryModel;
@Component
public class DocHistoryEntityMapper {

    public DocHistory toEntity(DocHistoryModel domainObject) {
        DocHistory entity = new DocHistory();

        entity.setAction(domainObject.action());
        entity.setChange(domainObject.change());
        entity.setDocVersion(domainObject.docVersion());
        entity.setSnapshot(domainObject.snapshot());

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
                    user.getClerkUserId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().name() : null,
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
                entityObject.getDocVersion(),
                entityObject.getSnapshot()
        );
    }
    public ActivityEntryModel toActivity(DocHistory h) {
        DocumentType type = null;
        Long docId = null;
        String title = null;

        if (h.getTechnicalDoc() != null) {
            type = DocumentType.TECHNICAL_DOC;
            docId = h.getTechnicalDoc().getId();
            title = h.getTechnicalDoc().getTitle();
        } else if (h.getCommercialDoc() != null) {
            type = DocumentType.COMMERCIAL_DOC;
            docId = h.getCommercialDoc().getId();
            title = h.getCommercialDoc().getTitle();
        } else if (h.getProcedure() != null) {
            type = DocumentType.PROCEDURE;
            docId = h.getProcedure().getId();
            title = h.getProcedure().getTitle();
        }

        User u = h.getUser();

        return new ActivityEntryModel(
                h.getId(), h.getAction(), h.getChange(), h.getDocVersion(),
                h.getCreatedAt(),
                u != null ? u.getUsername() : null,
                u != null ? u.getEmail() : null,
                type, docId, title);
    }
}
package org.example.infrastructure.persistence.mapper;

import org.example.domain.model.EmbeddingModel;
import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.entity.Embedding;
import org.example.infrastructure.persistence.entity.Procedure;
import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.springframework.stereotype.Component;

@Component
public class EmbeddingEntityMapper {

    public Embedding toEntity(EmbeddingModel domainObject) {
        Embedding entity = new Embedding();

        entity.setChunkIndex(domainObject.chunkIndex());
        entity.setChunkContent(domainObject.chunkContent());
        entity.setEmbeddings(domainObject.embeddings());
        entity.setModelUsed(domainObject.modelUsed());

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

    public EmbeddingModel toDomain(Embedding entityObject) {
        return new EmbeddingModel(
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
                entityObject.getChunkIndex(),
                entityObject.getChunkContent(),
                entityObject.getEmbeddings(),
                entityObject.getModelUsed(),
                entityObject.getCreatedAt(),
                entityObject.getUpdatedAt()
        );
    }
}
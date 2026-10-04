package org.example.infrastructure.persistence.repository;

public interface SimilarEmbeddingProjection {

    Long getId();

    Long getTechnicalDocId();

    Long getCommercialDocId();

    Long getProcedureId();

    Integer getChunkIndex();

    String getChunkContent();

    String getModelUsed();

    Double getSimilarity();
}
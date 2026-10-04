package org.example.domain.model;

public record SimilarEmbeddingModel(
        Long id,
        Long technicalDocId,
        Long commercialDocId,
        Long procedureId,
        Integer chunkIndex,
        String chunkContent,
        String modelUsed,
        double similarity
) {
}
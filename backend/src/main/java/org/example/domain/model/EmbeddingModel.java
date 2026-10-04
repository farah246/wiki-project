package org.example.domain.model;

import java.time.LocalDateTime;

public record EmbeddingModel(
        Long id,
        Long technicalDocId,
        Long commercialDocId,
        Long procedureId,
        Integer chunkIndex,
        String chunkContent,
        float[] embeddings,
        String modelUsed,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
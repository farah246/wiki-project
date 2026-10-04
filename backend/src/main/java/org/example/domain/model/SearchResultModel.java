package org.example.domain.model;

public record SearchResultModel(
        Long documentId,
        String title,
        String chunkContent,
        double similarity
) {
}
package org.example.domain.model;

public record SearchResultModel(
        Long documentId,
        String documentType,
        String title,
        String chunkContent,
        double similarity
) {
}
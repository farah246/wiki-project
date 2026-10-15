package org.example.domain.model;

// One cited excerpt. "number" is the [n] the answer uses in its citations.
public record AskSourceModel(
        int number,
        Long documentId,
        String documentType,   // TECHNICAL | COMMERCIAL | PROCEDURE (same values as /api/search)
        String title,
        String excerpt,
        double similarity
) {
}
package org.example.domain.model;

import java.time.LocalDateTime;

public record CommercialDocModel(
        Long id,
        String title,
        String proposalText,
        UserModel user,
        String clientName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) implements EmbeddableDocument {

    @Override
    public String textForEmbedding() {
        return proposalText;
    }
}
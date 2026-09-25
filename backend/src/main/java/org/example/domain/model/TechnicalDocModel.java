package org.example.domain.model;

import java.time.LocalDateTime;

public record TechnicalDocModel(
        Long id,
        String title,
        String content,
        String codeSnippet,
        String gitRef,
        UserModel user,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) implements EmbeddableDocument {

    @Override
    public String textForEmbedding() {
        return content + "\n\n" + codeSnippet;
    }
}
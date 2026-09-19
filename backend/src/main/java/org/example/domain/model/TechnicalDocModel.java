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
) {
}
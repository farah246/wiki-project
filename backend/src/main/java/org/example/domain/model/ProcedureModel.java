package org.example.domain.model;

import java.time.LocalDateTime;

public record ProcedureModel(
        Long id,
        String title,
        String description,
        String visualModel,
        UserModel user,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) implements EmbeddableDocument {

    @Override
    public String textForEmbedding() {
        if (visualModel == null || visualModel.isBlank()) {
            return description;
        }
        return description + "\n\n```\n" + visualModel + "\n```";
    }}
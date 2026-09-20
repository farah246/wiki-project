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
) {
}
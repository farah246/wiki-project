package org.example.domain.model;

import java.time.LocalDateTime;

public record UserModel(
        Long id,
        String username,
        String email,
        String role,
        String passwordHash,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
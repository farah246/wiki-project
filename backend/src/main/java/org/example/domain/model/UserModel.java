package org.example.domain.model;

import java.time.LocalDateTime;

public record UserModel(
        Long id,
        String clerkUserId,
        String username,
        String email,
        String role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
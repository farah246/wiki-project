package org.example.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

public record UserModel(
        Long id,
        String username,
        String email,
        String role,
        @JsonIgnore String passwordHash,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

package org.example.domain.model;

import org.example.domain.enums.DocumentType;

import java.time.LocalDateTime;

// One favorite of the current user. The user is implied (it is always the
// caller), so it is not part of the model sent to the client.
public record FavoriteModel(
        DocumentType docType,
        Long docId,
        LocalDateTime createdAt
) {
}
package org.example.domain.model;

import java.time.LocalDateTime;

public record DocHistoryModel(
        Long id,
        Long technicalDocId,
        Long commercialDocId,
        Long procedureId,
        UserModel user,
        String action,
        String change,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer docVersion
) {
}
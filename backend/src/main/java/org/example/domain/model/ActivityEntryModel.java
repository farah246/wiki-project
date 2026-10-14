package org.example.domain.model;

import org.example.domain.enums.DocumentType;

import java.time.LocalDateTime;

public record ActivityEntryModel(
        Long id,
        String action,
        String change,
        Integer docVersion,
        LocalDateTime createdAt,
        String username,
        String email,
        DocumentType docType,   // null if the document no longer exists
        Long docId,
        String docTitle
) {}
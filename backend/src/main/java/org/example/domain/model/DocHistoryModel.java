package org.example.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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
        Integer docVersion,
        // The document as it was after this change, as JSON. Never sent in the
        // history list (it can be large): it has its own endpoint.
        @JsonIgnore String snapshot
) {

    // What the history list sends instead: whether a saved version exists
    @JsonProperty("hasSnapshot")
    public boolean hasSnapshot() {
        return snapshot != null;
    }
}
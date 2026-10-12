package org.example.interfaces.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommercialDocRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be at most 255 characters")
        String title,

        @NotBlank(message = "Proposal text is required")
        String proposalText,

        @NotBlank(message = "Client name is required")
        @Size(max = 255, message = "Client name must be at most 255 characters")
        String clientName
) {
}
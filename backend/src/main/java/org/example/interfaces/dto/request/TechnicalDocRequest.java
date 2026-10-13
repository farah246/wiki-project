package org.example.interfaces.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TechnicalDocRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be at most 255 characters")
        String title,

        @NotBlank(message = "Content is required")
        @Size(max = 50000, message = "Content must be at most 50,000 characters")
        String content,

        @Size(max = 50000, message = "Code snippet must be at most 50,000 characters")
        String codeSnippet,

        @Size(max = 255, message = "Git reference must be at most 255 characters")
        String gitRef
) {
}
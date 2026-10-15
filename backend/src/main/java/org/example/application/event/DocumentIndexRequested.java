package org.example.application.event;

import org.example.domain.enums.DocumentType;

public record DocumentIndexRequested(DocumentType type, Long id) {}
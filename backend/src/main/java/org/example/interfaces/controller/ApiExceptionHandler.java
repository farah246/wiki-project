package org.example.interfaces.controller;

import org.example.application.exception.EmbeddingUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(EmbeddingUnavailableException.class)
    public ResponseEntity<Map<String, String>> handleEmbeddingUnavailable(
            EmbeddingUnavailableException ex) {
        log.error("Embedding service unavailable", ex);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "search_unavailable",
                        "message", "Search is temporarily unavailable. Please try again later."));
    }
}
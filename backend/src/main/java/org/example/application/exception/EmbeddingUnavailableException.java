package org.example.application.exception;

public class EmbeddingUnavailableException extends RuntimeException {
    public EmbeddingUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
package org.example.interfaces.controller;

import jakarta.validation.Valid;
import org.example.application.exception.EmbeddingUnavailableException;
import org.example.application.exception.LlmUnavailableException;
import org.example.application.service.AskService;
import org.example.domain.model.AskAnswerModel;
import org.example.interfaces.dto.request.AskRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.function.Consumer;

@RestController
@RequestMapping("/api/ask")
public class AskController {

    private static final Logger log = LoggerFactory.getLogger(AskController.class);

    private final AskService askService;
    private final Executor askExecutor;

    public AskController(AskService askService, @Qualifier("askExecutor") Executor askExecutor) {
        this.askService = askService;
        this.askExecutor = askExecutor;
    }
    // Same roles as /api/search: every role can read every document, so the
    // retrieved chunks never expose anything the user could not already open.
    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public AskAnswerModel ask(@Valid @RequestBody AskRequest request) {
        return askService.ask(request.question());
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public SseEmitter askStream(@Valid @RequestBody AskRequest request) {
        SseEmitter emitter = new SseEmitter(120_000L);

        askExecutor.execute(() -> {
            try {
                AskAnswerModel result = askService.askStreaming(request.question(),
                        token -> send(emitter, "token", Map.of("text", token)));
                send(emitter, "sources", result.sources());
                send(emitter, "done", Map.of());
                emitter.complete();
            } catch (LlmUnavailableException | EmbeddingUnavailableException e) {
                log.error("Ask stream failed", e);
                try {
                    send(emitter, "error", Map.of("error", "ask_unavailable",
                            "message", "The assistant is temporarily unavailable. Please try again later."));
                } catch (RuntimeException ignored) { /* client already gone */ }
                emitter.complete();
            } catch (Exception e) {
                // includes a client that closed the page in the middle of the answer
                log.warn("Ask stream stopped: {}", e.toString());
                emitter.completeWithError(e);
            }
        });
        return emitter;
    }

    private static void send(SseEmitter emitter, String event, Object data) {
        try {
            emitter.send(SseEmitter.event().name(event).data(data, MediaType.APPLICATION_JSON));
        } catch (IOException e) {
            throw new UncheckedIOException(e);   // stops the LLM read too
        }
    }


}
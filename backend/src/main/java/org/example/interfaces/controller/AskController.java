package org.example.interfaces.controller;

import jakarta.validation.Valid;
import org.example.application.service.AskService;
import org.example.domain.model.AskAnswerModel;
import org.example.interfaces.dto.request.AskRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ask")
public class AskController {

    private final AskService askService;

    public AskController(AskService askService) {
        this.askService = askService;
    }

    // Same roles as /api/search: every role can read every document, so the
    // retrieved chunks never expose anything the user could not already open.
    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public AskAnswerModel ask(@Valid @RequestBody AskRequest request) {
        return askService.ask(request.question());
    }
}
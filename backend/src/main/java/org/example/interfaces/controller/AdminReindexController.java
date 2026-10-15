package org.example.interfaces.controller;

import org.example.application.service.ReindexService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminReindexController {

    private final ReindexService reindexService;

    public AdminReindexController(ReindexService reindexService) {
        this.reindexService = reindexService;
    }

    @PostMapping("/reindex")
    @PreAuthorize("hasRole('ADMIN')")
    public ReindexService.ReindexResult reindex() {
        return reindexService.reindexAll();
    }
}
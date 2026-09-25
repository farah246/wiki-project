package org.example.interfaces.controller;

import org.example.application.service.EmbeddingClientService;
import org.example.domain.model.EmbeddingModel;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/embedding-test")
public class EmbeddingTestController {

    private final EmbeddingClientService embeddingClientService;

    public EmbeddingTestController(EmbeddingClientService embeddingClientService) {
        this.embeddingClientService = embeddingClientService;
    }

    @PostMapping
    public EmbeddingModel generateEmbedding(@RequestBody EmbeddingTestRequest request) {

        return embeddingClientService.generateAndSaveEmbedding(
                request.technicalDocId(),
                request.commercialDocId(),
                request.procedureId(),
                request.chunkIndex(),
                request.chunkContent()
        );
    }

    public record EmbeddingTestRequest(
            Long technicalDocId,
            Long commercialDocId,
            Long procedureId,
            Integer chunkIndex,
            String chunkContent
    ) {}
}
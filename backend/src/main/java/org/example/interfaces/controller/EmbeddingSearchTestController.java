package org.example.interfaces.controller;

import org.example.application.service.EmbeddingService;
import org.example.domain.model.EmbeddingModel;
import org.example.domain.model.SimilarEmbeddingModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/embedding-search-test")
public class EmbeddingSearchTestController {

    private final EmbeddingService embeddingService;

    public EmbeddingSearchTestController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    @GetMapping("/{embeddingId}")
    public List<SimilarEmbeddingModel> testSimilarity(
            @PathVariable Long embeddingId
    ) {
        EmbeddingModel embedding = embeddingService
                .getEmbeddingById(embeddingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Embedding not found: " + embeddingId
                        )
                );

        return embeddingService.findSimilar(
                embedding.embeddings(),
                5
        );
    }
}
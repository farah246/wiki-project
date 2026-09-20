package org.example.interfaces.controller;

import org.example.application.service.EmbeddingService;
import org.example.domain.model.EmbeddingModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/embeddings")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    public EmbeddingController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    @GetMapping
    public List<EmbeddingModel> getAllEmbeddings() {
        return embeddingService.getAllEmbeddings();
    }

    @GetMapping("/{id}")
    public EmbeddingModel getEmbeddingById(@PathVariable Long id) {
        return embeddingService.getEmbeddingById(id)
                .orElseThrow(() -> new RuntimeException("Embedding not found"));
    }

    @PostMapping
    public EmbeddingModel createEmbedding(@RequestBody EmbeddingModel embedding) {
        return embeddingService.saveEmbedding(embedding);
    }

    @DeleteMapping("/{id}")
    public void deleteEmbedding(@PathVariable Long id) {
        embeddingService.deleteEmbedding(id);
    }
}
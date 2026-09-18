package org.example.controller;

import org.example.infrastructure.persistence.entity.Embedding;
import org.example.service.EmbeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/embeddings")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    @Autowired
    public EmbeddingController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    @GetMapping
    public List<Embedding> getAllEmbeddings() {
        return embeddingService.getAllEmbeddings();
    }

    @GetMapping("/{id}")
    public Embedding getEmbeddingById(@PathVariable Long id) {
        return embeddingService.getEmbeddingById(id)
                .orElseThrow(() -> new RuntimeException("Embedding not found"));
    }

    @PostMapping
    public Embedding createEmbedding(@RequestBody Embedding embedding) {
        return embeddingService.saveEmbedding(embedding);
    }

    @DeleteMapping("/{id}")
    public void deleteEmbedding(@PathVariable Long id) {
        embeddingService.deleteEmbedding(id);
    }
}

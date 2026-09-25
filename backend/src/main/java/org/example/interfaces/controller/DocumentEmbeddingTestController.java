package org.example.interfaces.controller;

import org.example.application.service.DocumentEmbeddingService;
import org.example.domain.model.EmbeddingModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/document-embedding-test")
public class DocumentEmbeddingTestController {

    private final DocumentEmbeddingService documentEmbeddingService;

    public DocumentEmbeddingTestController(DocumentEmbeddingService documentEmbeddingService) {
        this.documentEmbeddingService = documentEmbeddingService;
    }

    @PostMapping("/technical/{id}")
    public List<EmbeddingModel> generateEmbeddings(
            @PathVariable Long id,
            @RequestBody String text
    ) {
        return documentEmbeddingService.generateEmbeddingsForTechnicalDoc(id, text);
    }
}
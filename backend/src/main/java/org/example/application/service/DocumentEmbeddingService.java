package org.example.application.service;

import org.example.domain.model.EmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentEmbeddingService {

    private final DocumentChunkingService chunkingService;
    private final EmbeddingClientService embeddingClientService;

    public DocumentEmbeddingService(
            DocumentChunkingService chunkingService,
            EmbeddingClientService embeddingClientService
    ) {
        this.chunkingService = chunkingService;
        this.embeddingClientService = embeddingClientService;
    }

    public List<EmbeddingModel> generateEmbeddingsForTechnicalDoc(
            Long technicalDocId,
            String text
    ) {
        List<String> chunks = chunkingService.chunkText(text);
        List<EmbeddingModel> embeddings = new ArrayList<>();

        for (int i = 0; i < chunks.size(); i++) {
            EmbeddingModel embedding = embeddingClientService.generateAndSaveEmbedding(
                    technicalDocId,
                    null,
                    null,
                    i,
                    chunks.get(i)
            );

            embeddings.add(embedding);
        }

        return embeddings;
    }
}
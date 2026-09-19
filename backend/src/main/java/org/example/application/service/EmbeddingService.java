package org.example.application.service;

import org.example.application.gateway.EmbeddingGateway;
import org.example.domain.model.EmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmbeddingService {

    private final EmbeddingGateway embeddingGateway;

    public EmbeddingService(EmbeddingGateway embeddingGateway) {
        this.embeddingGateway = embeddingGateway;
    }

    public List<EmbeddingModel> getAllEmbeddings() {
        return embeddingGateway.findAll();
    }

    public Optional<EmbeddingModel> getEmbeddingById(Long id) {
        return embeddingGateway.findById(id);
    }

    public EmbeddingModel saveEmbedding(EmbeddingModel embedding) {
        return embeddingGateway.save(embedding);
    }

    public void deleteEmbedding(Long id) {
        embeddingGateway.deleteById(id);
    }
}
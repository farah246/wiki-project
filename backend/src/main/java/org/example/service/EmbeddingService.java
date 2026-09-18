package org.example.service;

import org.example.infrastructure.persistence.entity.Embedding;
import org.example.infrastructure.persistence.repository.EmbeddingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmbeddingService {

    private final EmbeddingRepository embeddingRepository;

    @Autowired
    public EmbeddingService(EmbeddingRepository embeddingRepository) {
        this.embeddingRepository = embeddingRepository;
    }

    public List<Embedding> getAllEmbeddings() {
        return embeddingRepository.findAll();
    }

    public Optional<Embedding> getEmbeddingById(Long id) {
        return embeddingRepository.findById(id);
    }

    public Embedding saveEmbedding(Embedding embedding) {
        return embeddingRepository.save(embedding);
    }

    public void deleteEmbedding(Long id) {
        embeddingRepository.deleteById(id);
    }
}

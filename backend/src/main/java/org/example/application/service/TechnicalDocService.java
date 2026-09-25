package org.example.application.service;

import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.TechnicalDocModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicalDocService {

    private final TechnicalDocGateway technicalDocGateway;

    private final EmbeddingService embeddingService;
    private final DocumentEmbeddingService documentEmbeddingService;

    public TechnicalDocService(
            TechnicalDocGateway technicalDocGateway,
            DocumentEmbeddingService documentEmbeddingService,
            EmbeddingService embeddingService
    ) {
        this.technicalDocGateway = technicalDocGateway;
        this.documentEmbeddingService = documentEmbeddingService;
        this.embeddingService = embeddingService;
    }

    public List<TechnicalDocModel> getAllTechnicalDocs() {
        return technicalDocGateway.findAll();
    }

    public Optional<TechnicalDocModel> getTechnicalDocById(Long id) {
        return technicalDocGateway.findById(id);
    }

    public TechnicalDocModel saveTechnicalDoc(TechnicalDocModel technicalDoc) {
        TechnicalDocModel savedTechnicalDoc = technicalDocGateway.save(technicalDoc);

        documentEmbeddingService.generateEmbeddingsForTechnicalDoc(
                savedTechnicalDoc.id(),
                savedTechnicalDoc.textForEmbedding()
        );

        return savedTechnicalDoc;
    }

    public void deleteTechnicalDoc(Long id) {
        technicalDocGateway.deleteById(id);
        embeddingService.deleteEmbeddingsForTechnicalDoc(id);

    }
}
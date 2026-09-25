package org.example.application.service;

import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.TechnicalDocModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional
    public TechnicalDocModel updateTechnicalDoc(Long id, TechnicalDocModel technicalDoc) {

        TechnicalDocModel existingDoc = technicalDocGateway.findById(id)
                .orElseThrow(() -> new RuntimeException("TechnicalDoc not found"));

        TechnicalDocModel updatedDoc = new TechnicalDocModel(
                id,
                technicalDoc.title(),
                technicalDoc.content(),
                technicalDoc.codeSnippet(),
                technicalDoc.gitRef(),
                technicalDoc.user(),
                existingDoc.createdAt(),
                existingDoc.updatedAt()
        );

        TechnicalDocModel savedDoc = technicalDocGateway.save(updatedDoc);

        embeddingService.deleteEmbeddingsForTechnicalDoc(id);

        documentEmbeddingService.generateEmbeddingsForTechnicalDoc(
                savedDoc.id(),
                savedDoc.textForEmbedding()
        );

        return savedDoc;
    }

    public void deleteTechnicalDoc(Long id) {
        technicalDocGateway.deleteById(id);
        embeddingService.deleteEmbeddingsForTechnicalDoc(id);

    }
}
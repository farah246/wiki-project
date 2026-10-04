package org.example.application.service;

import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.EmbeddingModel;
import org.example.domain.model.TechnicalDocModel;
import org.example.domain.model.UserModel;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicalDocService {

    private final TechnicalDocGateway technicalDocGateway;
    private final EmbeddingService embeddingService;
    private final DocumentEmbeddingService documentEmbeddingService;
    private final CurrentUserService currentUserService;

    public TechnicalDocService(
            TechnicalDocGateway technicalDocGateway,
            DocumentEmbeddingService documentEmbeddingService,
            EmbeddingService embeddingService,
            CurrentUserService currentUserService
    ) {
        this.technicalDocGateway = technicalDocGateway;
        this.documentEmbeddingService = documentEmbeddingService;
        this.embeddingService = embeddingService;
        this.currentUserService = currentUserService;
    }

    public List<TechnicalDocModel> getAllTechnicalDocs() {
        return technicalDocGateway.findAll();
    }

    public Optional<TechnicalDocModel> getTechnicalDocById(Long id) {
        return technicalDocGateway.findById(id);
    }

    public TechnicalDocModel saveTechnicalDoc(
            TechnicalDocModel technicalDoc,
            Authentication authentication
    ) {
        UserModel currentUser =
                currentUserService.getCurrentUser(authentication);

        TechnicalDocModel documentWithUser = new TechnicalDocModel(
                technicalDoc.id(),
                technicalDoc.title(),
                technicalDoc.content(),
                technicalDoc.codeSnippet(),
                technicalDoc.gitRef(),
                currentUser,
                technicalDoc.createdAt(),
                technicalDoc.updatedAt()
        );

        TechnicalDocModel savedTechnicalDoc =
                technicalDocGateway.save(documentWithUser);

        documentEmbeddingService.generateEmbeddingsForTechnicalDoc(
                savedTechnicalDoc.id());

        return savedTechnicalDoc;
    }

    @Transactional
    public TechnicalDocModel updateTechnicalDoc(
            Long id,
            TechnicalDocModel technicalDoc
    ) {

        TechnicalDocModel existingDoc = technicalDocGateway.findById(id)
                .orElseThrow(() -> new RuntimeException("TechnicalDoc not found"));

        TechnicalDocModel updatedDoc = new TechnicalDocModel(
                id,
                technicalDoc.title(),
                technicalDoc.content(),
                technicalDoc.codeSnippet(),
                technicalDoc.gitRef(),
                existingDoc.user(),
                existingDoc.createdAt(),
                existingDoc.updatedAt()
        );

        TechnicalDocModel savedDoc = technicalDocGateway.save(updatedDoc);

        embeddingService.deleteEmbeddingsForTechnicalDoc(id);

        documentEmbeddingService.generateEmbeddingsForTechnicalDoc(
                savedDoc.id());

        return savedDoc;
    }


    public void deleteTechnicalDoc(Long id) {
        List<EmbeddingModel> embeddings = embeddingService.getAllEmbeddings();

        embeddings.stream()
                .filter(embedding -> id.equals(embedding.technicalDocId()))
                .forEach(embedding -> embeddingService.deleteEmbedding(embedding.id()));

        technicalDocGateway.deleteById(id);
    }



}
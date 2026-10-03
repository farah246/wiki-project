package org.example.application.service;

import org.example.application.gateway.CommercialDocGateway;
import org.example.domain.model.CommercialDocModel;
import org.example.domain.model.EmbeddingModel;
import org.example.domain.model.UserModel;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommercialDocService {

    private final CommercialDocGateway commercialDocGateway;
    private final EmbeddingService embeddingService;
    private final DocumentEmbeddingService documentEmbeddingService;
    private final CurrentUserService currentUserService;

    public CommercialDocService(
            CommercialDocGateway commercialDocGateway,
            EmbeddingService embeddingService,
            DocumentEmbeddingService documentEmbeddingService,
            CurrentUserService currentUserService
    ) {
        this.commercialDocGateway = commercialDocGateway;
        this.embeddingService = embeddingService;
        this.documentEmbeddingService = documentEmbeddingService;
        this.currentUserService = currentUserService;
    }

    public List<CommercialDocModel> getAllDocs() {
        return commercialDocGateway.findAll();
    }

    public Optional<CommercialDocModel> getDocById(Long id) {
        return commercialDocGateway.findById(id);
    }

    public CommercialDocModel saveDoc(
            CommercialDocModel doc,
            Authentication authentication
    ) {
        UserModel currentUser =
                currentUserService.getCurrentUser(authentication);

        CommercialDocModel documentWithUser = new CommercialDocModel(
                doc.id(),
                doc.title(),
                doc.proposalText(),
                currentUser,
                doc.clientName(),
                doc.createdAt(),
                doc.updatedAt()
        );

        CommercialDocModel savedCommercialDoc =
                commercialDocGateway.save(documentWithUser);

        documentEmbeddingService.generateEmbeddingsForCommercialDoc(
                savedCommercialDoc.id(),
                savedCommercialDoc.textForEmbedding()
        );

        return savedCommercialDoc;
    }

    @Transactional
    public CommercialDocModel updateDoc(
            Long id,
            CommercialDocModel doc
    ) {
        CommercialDocModel existingDoc =
                commercialDocGateway.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Doc not found"));

        CommercialDocModel updatedDoc = new CommercialDocModel(
                id,
                doc.title(),
                doc.proposalText(),
                existingDoc.user(),
                doc.clientName(),
                existingDoc.createdAt(),
                existingDoc.updatedAt()
        );

        CommercialDocModel savedDoc =
                commercialDocGateway.save(updatedDoc);

        List<EmbeddingModel> embeddings =
                embeddingService.getAllEmbeddings();

        embeddings.stream()
                .filter(embedding ->
                        id.equals(embedding.commercialDocId()))
                .forEach(embedding ->
                        embeddingService.deleteEmbedding(
                                embedding.id()));

        documentEmbeddingService.generateEmbeddingsForCommercialDoc(
                savedDoc.id(),
                savedDoc.textForEmbedding()
        );

        return savedDoc;
    }

    public void deleteDoc(Long id) {
        List<EmbeddingModel> embeddings =
                embeddingService.getAllEmbeddings();

        embeddings.stream()
                .filter(embedding ->
                        id.equals(embedding.commercialDocId()))
                .forEach(embedding ->
                        embeddingService.deleteEmbedding(
                                embedding.id()));

        commercialDocGateway.deleteById(id);
    }
}

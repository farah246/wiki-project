package org.example.application.service;

import org.example.application.gateway.CommercialDocGateway;
import org.example.domain.model.CommercialDocModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommercialDocService {

    private final CommercialDocGateway commercialDocGateway;

    private final EmbeddingService embeddingService;

    private final DocumentEmbeddingService documentEmbeddingService;

    public CommercialDocService(
            CommercialDocGateway commercialDocGateway,
            EmbeddingService embeddingService,
            DocumentEmbeddingService documentEmbeddingService
    ) {
        this.commercialDocGateway = commercialDocGateway;
        this.embeddingService = embeddingService;
        this.documentEmbeddingService = documentEmbeddingService;
    }

    public List<CommercialDocModel> getAllDocs() {
        return commercialDocGateway.findAll();
    }

    public Optional<CommercialDocModel> getDocById(Long id) {
        return commercialDocGateway.findById(id);
    }

    public CommercialDocModel saveDoc(CommercialDocModel doc) {

        CommercialDocModel  savedCommercialDoc =  commercialDocGateway.save(doc);
        documentEmbeddingService.generateEmbeddingsForCommercialDoc(
                savedCommercialDoc.id(),
                savedCommercialDoc.textForEmbedding()
        );
        return savedCommercialDoc;
    }

    @Transactional
    public CommercialDocModel updateDoc(Long id, CommercialDocModel doc) {

        CommercialDocModel existingDoc = commercialDocGateway.findById(id)
                .orElseThrow(() -> new RuntimeException("Doc not found"));

        CommercialDocModel updatedDoc = new CommercialDocModel(
                id,
                doc.title(),
                doc.proposalText(),
                doc.user(),
                doc.clientName(),
                existingDoc.createdAt(),
                existingDoc.updatedAt()
        );

        CommercialDocModel savedDoc = commercialDocGateway.save(updatedDoc);

        embeddingService.deleteEmbeddingsForCommercialDoc(id);

        documentEmbeddingService.generateEmbeddingsForCommercialDoc(
                savedDoc.id(),
                savedDoc.textForEmbedding()
        );

        return savedDoc;
    }



    public void deleteDoc(Long id) {

        embeddingService.deleteEmbeddingsForCommercialDoc(id);
        commercialDocGateway.deleteById(id);

    }
}
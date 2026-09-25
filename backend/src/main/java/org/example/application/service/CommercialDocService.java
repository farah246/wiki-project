package org.example.application.service;

import org.example.application.gateway.CommercialDocGateway;
import org.example.domain.model.CommercialDocModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void deleteDoc(Long id) {

        commercialDocGateway.deleteById(id);
        embeddingService.deleteEmbeddingsForCommercialDoc(id);
    }
}
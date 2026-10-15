package org.example.application.service;

import org.example.application.event.DocumentIndexRequested;
import org.example.application.gateway.CommercialDocGateway;
import org.example.application.gateway.ProcedureGateway;
import org.example.application.gateway.TechnicalDocGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class DocumentIndexingListener {

    private static final Logger log = LoggerFactory.getLogger(DocumentIndexingListener.class);

    private final TechnicalDocGateway technicalDocGateway;
    private final CommercialDocGateway commercialDocGateway;
    private final ProcedureGateway procedureGateway;
    private final DocumentEmbeddingService documentEmbeddingService;

    public DocumentIndexingListener(
            TechnicalDocGateway technicalDocGateway,
            CommercialDocGateway commercialDocGateway,
            ProcedureGateway procedureGateway,
            DocumentEmbeddingService documentEmbeddingService
    ) {
        this.technicalDocGateway = technicalDocGateway;
        this.commercialDocGateway = commercialDocGateway;
        this.procedureGateway = procedureGateway;
        this.documentEmbeddingService = documentEmbeddingService;
    }
    @Async("indexingExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onIndexRequested(DocumentIndexRequested event) {
        try {
            switch (event.type()) {
                case TECHNICAL_DOC -> technicalDocGateway.findById(event.id())
                        .ifPresent(documentEmbeddingService::reindexTechnicalDoc);
                case COMMERCIAL_DOC -> commercialDocGateway.findById(event.id())
                        .ifPresent(documentEmbeddingService::reindexCommercialDoc);
                case PROCEDURE -> procedureGateway.findById(event.id())
                        .ifPresent(documentEmbeddingService::reindexProcedure);
                default -> { }
            }
        } catch (Exception e) {
            log.error("Indexing failed for {} #{}. Run POST /api/admin/reindex to recover.",
                    event.type(), event.id(), e);
        }
    }
}
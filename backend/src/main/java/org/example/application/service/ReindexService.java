package org.example.application.service;

import org.example.application.gateway.CommercialDocGateway;
import org.example.application.gateway.ProcedureGateway;
import org.example.application.gateway.TechnicalDocGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReindexService {

    private static final Logger log = LoggerFactory.getLogger(ReindexService.class);

    public record ReindexResult(int total, int indexed, int failed, List<String> failures) {}

    private final TechnicalDocGateway technicalDocGateway;
    private final CommercialDocGateway commercialDocGateway;
    private final ProcedureGateway procedureGateway;
    private final DocumentEmbeddingService documentEmbeddingService;

    public ReindexService(
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

    // Deliberately NOT @Transactional: each document gets its own transaction
    // inside DocumentEmbeddingService, so one failure doesn't roll back the rest.
    public ReindexResult reindexAll() {
        int[] counts = new int[2]; // [0] = indexed, [1] = failed
        List<String> failures = new ArrayList<>();

        technicalDocGateway.findAll().forEach(doc ->
                run("TECHNICAL_DOC", doc.id(), () -> documentEmbeddingService.reindexTechnicalDoc(doc), counts, failures));
        commercialDocGateway.findAll().forEach(doc ->
                run("COMMERCIAL_DOC", doc.id(), () -> documentEmbeddingService.reindexCommercialDoc(doc), counts, failures));
        procedureGateway.findAll().forEach(proc ->
                run("PROCEDURE", proc.id(), () -> documentEmbeddingService.reindexProcedure(proc), counts, failures));

        return new ReindexResult(counts[0] + counts[1], counts[0], counts[1], failures);
    }

    private void run(String type, Long id, Runnable task, int[] counts, List<String> failures) {
        try {
            task.run();
            counts[0]++;
        } catch (Exception e) {
            counts[1]++;
            failures.add(type + " #" + id + ": " + e.getMessage());
            log.warn("Reindex failed for {} #{}", type, id, e);
        }
    }
}
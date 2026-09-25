package org.example.application.service;

import org.example.application.gateway.ProcedureGateway;
import org.example.domain.model.EmbeddingModel;
import org.example.domain.model.ProcedureModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcedureService {

    private final ProcedureGateway procedureGateway;
    private final EmbeddingService embeddingService;
    private final DocumentEmbeddingService documentEmbeddingService;

    public ProcedureService(
            ProcedureGateway procedureGateway,
            EmbeddingService embeddingService,
            DocumentEmbeddingService documentEmbeddingService
    ) {
        this.procedureGateway = procedureGateway;
        this.embeddingService = embeddingService;
        this.documentEmbeddingService = documentEmbeddingService;
    }

    public List<ProcedureModel> getAllProcedures() {
        return procedureGateway.findAll();
    }

    public Optional<ProcedureModel> getProcedureById(Long id) {
        return procedureGateway.findById(id);
    }

    public ProcedureModel saveProcedure(ProcedureModel procedure) {
        ProcedureModel savedProcedure = procedureGateway.save(procedure);

        documentEmbeddingService.generateEmbeddingsForProcedure(
                savedProcedure.id(),
                savedProcedure.title() + "\n\n" + savedProcedure.description()
        );

        return savedProcedure;
    }

    public void deleteProcedure(Long id) {

        List<EmbeddingModel> embeddings = embeddingService.getAllEmbeddings();

        embeddings.stream()
                .filter(embedding -> id.equals(embedding.procedureId()))
                .forEach(embedding -> embeddingService.deleteEmbedding(embedding.id()));

        procedureGateway.deleteById(id);
    }
}

package org.example.application.service;

import org.example.application.gateway.ProcedureGateway;
import org.example.domain.model.EmbeddingModel;
import org.example.domain.model.ProcedureModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

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
                savedProcedure.textForEmbedding()
        );

        return savedProcedure;
    }
    @Transactional
    public ProcedureModel updateProcedure(Long id, ProcedureModel procedure) {

        ProcedureModel existingProcedure = procedureGateway.findById(id)
                .orElseThrow(() -> new RuntimeException("Procedure not found"));

        ProcedureModel updatedProcedure = new ProcedureModel(
                id,
                procedure.title(),
                procedure.description(),
                procedure.visualModel(),
                procedure.user(),
                existingProcedure.createdAt(),
                existingProcedure.updatedAt()
        );

        ProcedureModel savedProcedure = procedureGateway.save(updatedProcedure);

        embeddingService.deleteEmbeddingsForProcedure(id);

        documentEmbeddingService.generateEmbeddingsForProcedure(
                savedProcedure.id(),
                savedProcedure.textForEmbedding()
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

package org.example.application.service;

import org.example.domain.model.CommercialDocModel;
import org.example.domain.model.ProcedureModel;
import org.example.domain.model.TechnicalDocModel;
import org.example.domain.model.EmbeddingModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentEmbeddingService {

    private final DocumentChunkingService chunkingService;
    private final EmbeddingClientService embeddingClientService;
    private final EmbeddingService embeddingService;

    public DocumentEmbeddingService(
            DocumentChunkingService chunkingService,
            EmbeddingClientService embeddingClientService,
            EmbeddingService embeddingService
    ) {
        this.chunkingService = chunkingService;
        this.embeddingClientService = embeddingClientService;
        this.embeddingService = embeddingService;
    }

    public void reindexTechnicalDoc(TechnicalDocModel doc) {
        List<String> chunks = chunkingService.chunkMarkdown(doc.title(), doc.textForEmbedding());
        embeddingService.replaceForTechnicalDoc(doc.id(),
                embeddingClientService.buildEmbeddings(doc.id(), null, null, chunks));
    }

    public void reindexCommercialDoc(CommercialDocModel doc) {
        List<String> chunks = chunkingService.chunkMarkdown(doc.title(), doc.textForEmbedding());
        embeddingService.replaceForCommercialDoc(doc.id(),
                embeddingClientService.buildEmbeddings(null, doc.id(), null, chunks));
    }

    public void reindexProcedure(ProcedureModel procedure) {
        List<String> chunks = chunkingService.chunkMarkdown(procedure.title(), procedure.textForEmbedding());
        embeddingService.replaceForProcedure(procedure.id(),
                embeddingClientService.buildEmbeddings(null, null, procedure.id(), chunks));
    }
}
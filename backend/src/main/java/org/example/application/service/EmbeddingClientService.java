package org.example.application.service;

import org.example.domain.model.EmbeddingModel;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingClientService {

    private static final String MODEL_NAME = "BAAI/bge-small-en-v1.5";

    private final HuggingFaceService huggingFaceService;
    private final EmbeddingService embeddingService;

    public EmbeddingClientService(
            HuggingFaceService huggingFaceService,
            EmbeddingService embeddingService
    ) {
        this.huggingFaceService = huggingFaceService;
        this.embeddingService = embeddingService;
    }

    public EmbeddingModel generateAndSaveEmbedding(
            Long technicalDocId,
            Long commercialDocId,
            Long procedureId,
            Integer chunkIndex,
            String chunkContent
    ) {
        double[] embedding = huggingFaceService.getEmbedding(chunkContent);

        float[] embeddingVector = new float[embedding.length];

        for (int i = 0; i < embedding.length; i++) {
            embeddingVector[i] = (float) embedding[i];
        }

        EmbeddingModel embeddingModel = new EmbeddingModel(
                null,
                technicalDocId,
                commercialDocId,
                procedureId,
                chunkIndex,
                chunkContent,
                embeddingVector,
                MODEL_NAME,
                null,
                null
        );

        return embeddingService.saveEmbedding(embeddingModel);
    }

    public float[] generateQueryEmbedding(String query) {
        double[] embedding = huggingFaceService.getEmbedding(query);

        float[] embeddingVector = new float[embedding.length];

        for (int i = 0; i < embedding.length; i++) {
            embeddingVector[i] = (float) embedding[i];
        }

        return embeddingVector;
    }
}
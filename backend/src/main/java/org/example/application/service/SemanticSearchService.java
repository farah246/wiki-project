package org.example.application.service;

import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.SearchResultModel;
import org.example.domain.model.SimilarEmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SemanticSearchService {

    private final EmbeddingClientService embeddingClientService;
    private final EmbeddingService embeddingService;
    private final TechnicalDocGateway technicalDocGateway;

    public SemanticSearchService(
            EmbeddingClientService embeddingClientService,
            EmbeddingService embeddingService,
            TechnicalDocGateway technicalDocGateway
    ) {
        this.embeddingClientService = embeddingClientService;
        this.embeddingService = embeddingService;
        this.technicalDocGateway = technicalDocGateway;
    }

    public List<SearchResultModel> search(String query, int limit) {

        float[] queryEmbedding =
                embeddingClientService.generateQueryEmbedding(query);

        List<SimilarEmbeddingModel> similarEmbeddings =
                embeddingService.findSimilar(queryEmbedding, limit);

        return similarEmbeddings.stream()
                .map(embedding -> {
                    if (embedding.technicalDocId() == null) {
                        return null;
                    }

                    return technicalDocGateway
                            .findById(embedding.technicalDocId())
                            .map(document -> new SearchResultModel(
                                    document.id(),
                                    document.title(),
                                    embedding.chunkContent(),
                                    embedding.similarity()
                            ))
                            .orElse(null);
                })
                .filter(result -> result != null)
                .toList();
    }
}
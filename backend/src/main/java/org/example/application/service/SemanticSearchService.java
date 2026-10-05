package org.example.application.service;

import org.example.application.gateway.CommercialDocGateway;
import org.example.application.gateway.ProcedureGateway;
import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.SearchResultModel;
import org.example.domain.model.SimilarEmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SemanticSearchService {

    private final EmbeddingClientService embeddingClientService;
    private final EmbeddingService embeddingService;
    private final TechnicalDocGateway technicalDocGateway;
    private final CommercialDocGateway commercialDocGateway;
    private final ProcedureGateway procedureGateway;

    public SemanticSearchService(
            EmbeddingClientService embeddingClientService,
            EmbeddingService embeddingService,
            TechnicalDocGateway technicalDocGateway,
            CommercialDocGateway commercialDocGateway,
            ProcedureGateway procedureGateway
    ) {
        this.embeddingClientService = embeddingClientService;
        this.embeddingService = embeddingService;
        this.technicalDocGateway = technicalDocGateway;
        this.commercialDocGateway = commercialDocGateway;
        this.procedureGateway = procedureGateway;
    }

    public List<SearchResultModel> search(String query, int limit) {

        float[] queryEmbedding =
                embeddingClientService.generateQueryEmbedding(query);

        int candidateLimit = limit * 4;

        List<SimilarEmbeddingModel> similarEmbeddings =
                embeddingService.findSimilar(queryEmbedding, candidateLimit);

        return similarEmbeddings.stream()
                .map(this::mapToSearchResult)
                .filter(result -> result != null)
                .collect(Collectors.toMap(
                        result -> result.documentType() + ":" + result.documentId(),
                        result -> result,
                        (existing, replacement) ->
                                existing.similarity() >= replacement.similarity()
                                        ? existing
                                        : replacement
                ))
                .values()
                .stream()
                .sorted(
                        Comparator.comparingDouble(
                                SearchResultModel::similarity
                        ).reversed()
                )
                .limit(limit)
                .toList();
    }

    private SearchResultModel mapToSearchResult(
            SimilarEmbeddingModel embedding
    ) {

        if (embedding.technicalDocId() != null) {

            return technicalDocGateway
                    .findById(embedding.technicalDocId())
                    .map(document -> new SearchResultModel(
                            document.id(),
                            "TECHNICAL",
                            document.title(),
                            embedding.chunkContent(),
                            embedding.similarity()
                    ))
                    .orElse(null);
        }

        if (embedding.commercialDocId() != null) {

            return commercialDocGateway
                    .findById(embedding.commercialDocId())
                    .map(document -> new SearchResultModel(
                            document.id(),
                            "COMMERCIAL",
                            document.title(),
                            embedding.chunkContent(),
                            embedding.similarity()
                    ))
                    .orElse(null);
        }

        if (embedding.procedureId() != null) {

            return procedureGateway
                    .findById(embedding.procedureId())
                    .map(document -> new SearchResultModel(
                            document.id(),
                            "PROCEDURE",
                            document.title(),
                            embedding.chunkContent(),
                            embedding.similarity()
                    ))
                    .orElse(null);
        }

        return null;
    }
}
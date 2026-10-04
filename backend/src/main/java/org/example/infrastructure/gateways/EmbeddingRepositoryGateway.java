package org.example.infrastructure.gateways;

import org.example.application.gateway.EmbeddingGateway;
import org.example.domain.model.EmbeddingModel;
import org.example.infrastructure.persistence.entity.Embedding;
import org.example.infrastructure.persistence.mapper.EmbeddingEntityMapper;
import org.example.infrastructure.persistence.repository.EmbeddingRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import org.example.domain.model.SimilarEmbeddingModel;
import org.example.infrastructure.persistence.repository.SimilarEmbeddingProjection;
@Component
public class EmbeddingRepositoryGateway implements EmbeddingGateway {

    private final EmbeddingRepository embeddingRepository;
    private final EmbeddingEntityMapper embeddingMapper;

    public EmbeddingRepositoryGateway(
            EmbeddingRepository embeddingRepository,
            EmbeddingEntityMapper embeddingMapper
    ) {
        this.embeddingRepository = embeddingRepository;
        this.embeddingMapper = embeddingMapper;
    }

    @Override
    public List<EmbeddingModel> findAll() {
        return embeddingRepository.findAll()
                .stream()
                .map(embeddingMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<EmbeddingModel> findById(Long id) {
        return embeddingRepository.findById(id)
                .map(embeddingMapper::toDomain);
    }

    @Override
    public EmbeddingModel save(EmbeddingModel embedding) {
        Embedding entity = embeddingMapper.toEntity(embedding);
        Embedding saved = embeddingRepository.save(entity);

        return embeddingMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        embeddingRepository.deleteById(id);
    }

    @Override
    public void deleteByTechnicalDocId(Long technicalDocId) {
        embeddingRepository.deleteByTechnicalDoc_Id(technicalDocId);
    }

    @Override
    public void deleteByCommercialDocId(Long commercialDocId) {
        embeddingRepository.deleteByCommercialDoc_Id(commercialDocId);
    }

    @Override
    public void deleteByProcedureId(Long procedureId) {
        embeddingRepository.deleteByProcedure_Id(procedureId);
    }
    @Override
    public List<SimilarEmbeddingModel> findSimilar(
            float[] queryEmbedding,
            int limit
    ) {
        String vector = java.util.Arrays.toString(queryEmbedding);

        return embeddingRepository.findSimilar(vector, limit)
                .stream()
                .map(this::toSimilarEmbeddingModel)
                .toList();
    }

    private SimilarEmbeddingModel toSimilarEmbeddingModel(
            SimilarEmbeddingProjection projection
    ) {
        return new SimilarEmbeddingModel(
                projection.getId(),
                projection.getTechnicalDocId(),
                projection.getCommercialDocId(),
                projection.getProcedureId(),
                projection.getChunkIndex(),
                projection.getChunkContent(),
                projection.getModelUsed(),
                projection.getSimilarity()
        );
    }
}
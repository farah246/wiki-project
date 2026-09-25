package org.example.application.gateway;

import org.example.domain.model.EmbeddingModel;

import java.util.List;
import java.util.Optional;

public interface EmbeddingGateway {

    List<EmbeddingModel> findAll();

    Optional<EmbeddingModel> findById(Long id);

    EmbeddingModel save(EmbeddingModel embedding);

    void deleteById(Long id);

    void deleteByTechnicalDocId(Long technicalDocId);

    void deleteByCommercialDocId(Long commercialDocId);

    void deleteByProcedureId(Long productDocId);
}
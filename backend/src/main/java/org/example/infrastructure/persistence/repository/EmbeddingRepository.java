package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.Embedding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmbeddingRepository extends JpaRepository<Embedding, Long> {

    void deleteByTechnicalDoc_Id(Long technicalDocId);

    void deleteByCommercialDoc_Id(Long commercialDocId);

    void deleteByProcedure_Id(Long procedureId);
}
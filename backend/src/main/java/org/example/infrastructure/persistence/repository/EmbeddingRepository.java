package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.Embedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmbeddingRepository extends JpaRepository<Embedding, Long> {

    void deleteByTechnicalDoc_Id(Long technicalDocId);

    void deleteByCommercialDoc_Id(Long commercialDocId);

    void deleteByProcedure_Id(Long procedureId);

    @Query(value = """
            SELECT
                id,
                technical_doc_id AS technicalDocId,
                commercial_doc_id AS commercialDocId,
                procedure_id AS procedureId,
                chunk_index AS chunkIndex,
                chunk_content AS chunkContent,
                model_used AS modelUsed,
                1 - (embedding <=> CAST(:queryEmbedding AS vector)) AS similarity
            FROM doc_embeddings
            ORDER BY embedding <=> CAST(:queryEmbedding AS vector)
            LIMIT :limit
            """, nativeQuery = true)
    List<SimilarEmbeddingProjection> findSimilar(
            @Param("queryEmbedding") String queryEmbedding,
            @Param("limit") int limit
    );
}
package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.DocHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocHistoryRepository extends JpaRepository<DocHistory, Long> {

    List<DocHistory> findByTechnicalDocIdOrderByCreatedAtDescIdDesc(Long id);

    List<DocHistory> findByCommercialDocIdOrderByCreatedAtDescIdDesc(Long id);

    List<DocHistory> findByProcedureIdOrderByCreatedAtDescIdDesc(Long id);

    @Query("select coalesce(max(h.docVersion), 0) from DocHistory h where h.technicalDoc.id = :id")
    int findLatestVersionByTechnicalDocId(@Param("id") Long id);

    @Query("select coalesce(max(h.docVersion), 0) from DocHistory h where h.commercialDoc.id = :id")
    int findLatestVersionByCommercialDocId(@Param("id") Long id);

    @Query("select coalesce(max(h.docVersion), 0) from DocHistory h where h.procedure.id = :id")
    int findLatestVersionByProcedureId(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("update DocHistory h set h.technicalDoc = null where h.technicalDoc.id = :id")
    void detachTechnicalDoc(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("update DocHistory h set h.commercialDoc = null where h.commercialDoc.id = :id")
    void detachCommercialDoc(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("update DocHistory h set h.procedure = null where h.procedure.id = :id")
    void detachProcedure(@Param("id") Long id);
}
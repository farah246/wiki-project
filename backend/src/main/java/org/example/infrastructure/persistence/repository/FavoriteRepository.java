package org.example.infrastructure.persistence.repository;

import org.example.domain.enums.DocumentType;
import org.example.infrastructure.persistence.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndDocTypeAndDocId(
            Long userId, DocumentType docType, Long docId);

    void deleteByUserIdAndDocTypeAndDocId(
            Long userId, DocumentType docType, Long docId);

    // when a document is deleted, for every user
    void deleteByDocTypeAndDocId(DocumentType docType, Long docId);
}
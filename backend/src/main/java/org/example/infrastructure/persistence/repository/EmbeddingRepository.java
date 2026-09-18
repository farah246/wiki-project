package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.Embedding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmbeddingRepository extends JpaRepository<Embedding, Long> {
}


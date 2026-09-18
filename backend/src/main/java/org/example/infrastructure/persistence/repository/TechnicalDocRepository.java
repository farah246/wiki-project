package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicalDocRepository extends JpaRepository<TechnicalDoc, Long> {
}

// Repeat for DocHistory, Embedding, etc.
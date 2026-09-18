package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureRepository extends JpaRepository<Procedure, Long> {
}

// Repeat for DocHistory, Embedding, etc.
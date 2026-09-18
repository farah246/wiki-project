package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.DocHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocHistoryRepository extends JpaRepository<DocHistory, Long> {
}


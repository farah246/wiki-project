package org.example.infrastructure.persistence.repository;

import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommercialDocRepository extends JpaRepository<CommercialDoc, Long> {
}


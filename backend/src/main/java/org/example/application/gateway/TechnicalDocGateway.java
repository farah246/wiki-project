package org.example.application.gateway;

import org.example.domain.model.TechnicalDocModel;

import java.util.List;
import java.util.Optional;

public interface TechnicalDocGateway {

    List<TechnicalDocModel> findAll();

    Optional<TechnicalDocModel> findById(Long id);

    TechnicalDocModel save(TechnicalDocModel technicalDoc);

    void deleteById(Long id);
}
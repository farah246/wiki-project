package org.example.application.gateway;

import org.example.domain.model.CommercialDocModel;

import java.util.List;
import java.util.Optional;

public interface CommercialDocGateway {

    List<CommercialDocModel> findAll();

    Optional<CommercialDocModel> findById(Long id);

    CommercialDocModel save(CommercialDocModel doc);

    void deleteById(Long id);
}
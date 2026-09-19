package org.example.application.gateway;

import org.example.domain.model.ProcedureModel;

import java.util.List;
import java.util.Optional;

public interface ProcedureGateway {

    List<ProcedureModel> findAll();

    Optional<ProcedureModel> findById(Long id);

    ProcedureModel save(ProcedureModel procedure);

    void deleteById(Long id);
}
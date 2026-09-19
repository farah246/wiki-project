package org.example.application.service;

import org.example.application.gateway.ProcedureGateway;
import org.example.domain.model.ProcedureModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcedureService {

    private final ProcedureGateway procedureGateway;

    public ProcedureService(ProcedureGateway procedureGateway) {
        this.procedureGateway = procedureGateway;
    }

    public List<ProcedureModel> getAllProcedures() {
        return procedureGateway.findAll();
    }

    public Optional<ProcedureModel> getProcedureById(Long id) {
        return procedureGateway.findById(id);
    }

    public ProcedureModel saveProcedure(ProcedureModel procedure) {
        return procedureGateway.save(procedure);
    }

    public void deleteProcedure(Long id) {
        procedureGateway.deleteById(id);
    }
}
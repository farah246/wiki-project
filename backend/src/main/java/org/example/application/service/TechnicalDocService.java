package org.example.application.service;

import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.TechnicalDocModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicalDocService {

    private final TechnicalDocGateway technicalDocGateway;

    public TechnicalDocService(TechnicalDocGateway technicalDocGateway) {
        this.technicalDocGateway = technicalDocGateway;
    }

    public List<TechnicalDocModel> getAllTechnicalDocs() {
        return technicalDocGateway.findAll();
    }

    public Optional<TechnicalDocModel> getTechnicalDocById(Long id) {
        return technicalDocGateway.findById(id);
    }

    public TechnicalDocModel saveTechnicalDoc(TechnicalDocModel technicalDoc) {
        return technicalDocGateway.save(technicalDoc);
    }

    public void deleteTechnicalDoc(Long id) {
        technicalDocGateway.deleteById(id);
    }
}
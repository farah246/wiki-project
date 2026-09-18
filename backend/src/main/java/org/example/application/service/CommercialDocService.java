package org.example.application.service;

import org.example.application.gateway.CommercialDocGateway;
import org.example.domain.model.CommercialDocModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommercialDocService {

    private final CommercialDocGateway commercialDocGateway;

    public CommercialDocService(CommercialDocGateway commercialDocGateway) {
        this.commercialDocGateway = commercialDocGateway;
    }

    public List<CommercialDocModel> getAllDocs() {
        return commercialDocGateway.findAll();
    }

    public Optional<CommercialDocModel> getDocById(Long id) {
        return commercialDocGateway.findById(id);
    }

    public CommercialDocModel saveDoc(CommercialDocModel doc) {
        return commercialDocGateway.save(doc);
    }

    public void deleteDoc(Long id) {
        commercialDocGateway.deleteById(id);
    }
}
package org.example.service;

import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.repository.CommercialDocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommercialDocService {

    private final CommercialDocRepository commercialDocRepository;

    @Autowired
    public CommercialDocService(CommercialDocRepository commercialDocRepository) {
        this.commercialDocRepository = commercialDocRepository;
    }

    public List<CommercialDoc> getAllDocs() {
        return commercialDocRepository.findAll();
    }

    public Optional<CommercialDoc> getDocById(Long id) {
        return commercialDocRepository.findById(id);
    }

    public CommercialDoc saveDoc(CommercialDoc doc) {
        return commercialDocRepository.save(doc);
    }

    public void deleteDoc(Long id) {
        commercialDocRepository.deleteById(id);
    }
}

package org.example.service;

import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.example.infrastructure.persistence.repository.TechnicalDocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicalDocService {

    private final TechnicalDocRepository technicalDocRepository;

    @Autowired
    public TechnicalDocService(TechnicalDocRepository technicalDocRepository) {
        this.technicalDocRepository = technicalDocRepository;
    }

    public List<TechnicalDoc> getAllTechnicalDocs() {
        return technicalDocRepository.findAll();
    }

    public Optional<TechnicalDoc> getTechnicalDocById(Long id) {
        return technicalDocRepository.findById(id);
    }

    public TechnicalDoc saveTechnicalDoc(TechnicalDoc technicalDoc) {
        return technicalDocRepository.save(technicalDoc);
    }

    public void deleteTechnicalDoc(Long id) {
        technicalDocRepository.deleteById(id);
    }
}

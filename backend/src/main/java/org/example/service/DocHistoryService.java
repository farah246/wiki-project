package org.example.service;

import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.infrastructure.persistence.repository.DocHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocHistoryService {

    private final DocHistoryRepository docHistoryRepository;

    @Autowired
    public DocHistoryService(DocHistoryRepository docHistoryRepository) {
        this.docHistoryRepository = docHistoryRepository;
    }

    public List<DocHistory> getAllHistories() {
        return docHistoryRepository.findAll();
    }

    public Optional<DocHistory> getHistoryById(Long id) {
        return docHistoryRepository.findById(id);
    }

    public DocHistory saveHistory(DocHistory history) {
        return docHistoryRepository.save(history);
    }

    public void deleteHistory(Long id) {
        docHistoryRepository.deleteById(id);
    }
}

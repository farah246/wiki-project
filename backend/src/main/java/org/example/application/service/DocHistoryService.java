package org.example.application.service;

import org.example.application.gateway.DocHistoryGateway;
import org.example.domain.model.DocHistoryModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocHistoryService {

    private final DocHistoryGateway docHistoryGateway;

    public DocHistoryService(DocHistoryGateway docHistoryGateway) {
        this.docHistoryGateway = docHistoryGateway;
    }

    public List<DocHistoryModel> getAllHistories() {
        return docHistoryGateway.findAll();
    }

    public Optional<DocHistoryModel> getHistoryById(Long id) {
        return docHistoryGateway.findById(id);
    }

    public DocHistoryModel saveHistory(DocHistoryModel history) {
        return docHistoryGateway.save(history);
    }

    public void deleteHistory(Long id) {
        docHistoryGateway.deleteById(id);
    }
}
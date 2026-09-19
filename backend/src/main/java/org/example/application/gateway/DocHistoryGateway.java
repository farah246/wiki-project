package org.example.application.gateway;

import org.example.domain.model.DocHistoryModel;

import java.util.List;
import java.util.Optional;

public interface DocHistoryGateway {

    List<DocHistoryModel> findAll();

    Optional<DocHistoryModel> findById(Long id);

    DocHistoryModel save(DocHistoryModel history);

    void deleteById(Long id);
}
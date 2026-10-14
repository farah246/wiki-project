package org.example.application.gateway;

import org.example.domain.enums.DocumentType;
import org.example.domain.model.DocHistoryModel;

import java.util.List;
import java.util.Optional;
import org.example.domain.model.ActivityPage;
public interface DocHistoryGateway {

    List<DocHistoryModel> findAll();

    Optional<DocHistoryModel> findById(Long id);

    DocHistoryModel save(DocHistoryModel history);

    void deleteById(Long id);

    // History of one document, newest first
    List<DocHistoryModel> findByDocument(DocumentType type, Long docId);

    // Highest version number recorded for the document, 0 if there is none
    int latestVersionByDocument(DocumentType type, Long docId);

    // Unlinks the history rows from a document that is about to be deleted,
    // so the audit rows survive the deletion
    void detachDocument(DocumentType type, Long docId);
    // userId null = everyone's activity; action null = all actions
    ActivityPage findActivity(Long userId, String action, int page, int size);

}
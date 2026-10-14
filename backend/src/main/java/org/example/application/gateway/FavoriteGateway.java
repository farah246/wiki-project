package org.example.application.gateway;

import org.example.domain.enums.DocumentType;
import org.example.domain.model.FavoriteModel;

import java.util.List;

public interface FavoriteGateway {

    // newest first
    List<FavoriteModel> findByUserId(Long userId);

    boolean exists(Long userId, DocumentType docType, Long docId);

    void save(Long userId, DocumentType docType, Long docId);

    void delete(Long userId, DocumentType docType, Long docId);

    void deleteAllForDocument(DocumentType docType, Long docId);
}
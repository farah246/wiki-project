package org.example.application.service;

import org.example.application.exception.NotFoundException;
import org.example.application.gateway.CommercialDocGateway;
import org.example.application.gateway.FavoriteGateway;
import org.example.application.gateway.ProcedureGateway;
import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.FavoriteModel;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

// Favorites are personal: every method works on the current user only.
// They are not document edits, so nothing here touches the document history.
@Service
public class FavoriteService {

    private final FavoriteGateway favoriteGateway;
    private final CurrentUserService currentUserService;
    private final TechnicalDocGateway technicalDocGateway;
    private final CommercialDocGateway commercialDocGateway;
    private final ProcedureGateway procedureGateway;

    public FavoriteService(
            FavoriteGateway favoriteGateway,
            CurrentUserService currentUserService,
            TechnicalDocGateway technicalDocGateway,
            CommercialDocGateway commercialDocGateway,
            ProcedureGateway procedureGateway
    ) {
        this.favoriteGateway = favoriteGateway;
        this.currentUserService = currentUserService;
        this.technicalDocGateway = technicalDocGateway;
        this.commercialDocGateway = commercialDocGateway;
        this.procedureGateway = procedureGateway;
    }

    public List<FavoriteModel> getFavorites(Authentication authentication) {
        Long userId = currentUserService.getCurrentUser(authentication).id();

        return favoriteGateway.findByUserId(userId);
    }

    // Not @Transactional on purpose: if two clicks race and the unique
    // constraint rejects the second insert, the exception is caught below.
    // Inside a surrounding transaction it would mark that transaction as
    // rollback-only instead.
    public void addFavorite(
            Authentication authentication,
            DocumentType docType,
            Long docId
    ) {
        if (!documentExists(docType, docId)) {
            throw new NotFoundException("Document not found");
        }

        Long userId = currentUserService.getCurrentUser(authentication).id();

        if (favoriteGateway.exists(userId, docType, docId)) {
            return;
        }

        try {
            favoriteGateway.save(userId, docType, docId);
        } catch (DataIntegrityViolationException e) {
            // already a favorite (double click): adding twice is not an error
        }
    }

    // Removing something that is not a favorite is fine too
    public void removeFavorite(
            Authentication authentication,
            DocumentType docType,
            Long docId
    ) {
        Long userId = currentUserService.getCurrentUser(authentication).id();

        favoriteGateway.delete(userId, docType, docId);
    }

    // Called by the document services when a document is deleted
    public void removeAllForDocument(DocumentType docType, Long docId) {
        favoriteGateway.deleteAllForDocument(docType, docId);
    }

    private boolean documentExists(DocumentType docType, Long docId) {
        return switch (docType) {
            case TECHNICAL_DOC -> technicalDocGateway.findById(docId).isPresent();
            case COMMERCIAL_DOC -> commercialDocGateway.findById(docId).isPresent();
            case PROCEDURE -> procedureGateway.findById(docId).isPresent();
        };
    }
}
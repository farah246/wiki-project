package org.example.interfaces.controller;

import org.example.application.service.CurrentUserService;
import org.example.application.service.DocHistoryService;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.ActivityPage;
import org.example.domain.model.DocHistoryModel;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Read-only. History rows are written by the document services only,
// so there is no public POST/DELETE (it would let anyone forge the audit trail).
@RestController
@RequestMapping("/api/doc-history")
public class DocHistoryController {

    private final DocHistoryService docHistoryService;
    private final CurrentUserService currentUserService;

    public DocHistoryController(
            DocHistoryService docHistoryService,
            CurrentUserService currentUserService
    ) {
        this.docHistoryService = docHistoryService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<DocHistoryModel> getAll() {
        return docHistoryService.getAllHistories();
    }

    // Everyone's activity: admins only. userId is optional (null = all users)
    @GetMapping("/activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ActivityPage getActivity(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return docHistoryService.getActivity(userId, action, page, size);
    }

    // The caller's own activity: the user comes from the token, never from the URL
    @GetMapping("/activity/me")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public ActivityPage getMyActivity(
            Authentication authentication,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = currentUserService.getCurrentUser(authentication).id();

        return docHistoryService.getActivity(userId, action, page, size);
    }

    @GetMapping("/technical-docs/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<DocHistoryModel> getTechnicalDocHistory(@PathVariable Long id) {
        return docHistoryService.getHistoryForDocument(
                DocumentType.TECHNICAL_DOC, id);
    }

    @GetMapping("/commercial-docs/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<DocHistoryModel> getCommercialDocHistory(@PathVariable Long id) {
        return docHistoryService.getHistoryForDocument(
                DocumentType.COMMERCIAL_DOC, id);
    }

    @GetMapping("/procedures/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<DocHistoryModel> getProcedureHistory(@PathVariable Long id) {
        return docHistoryService.getHistoryForDocument(
                DocumentType.PROCEDURE, id);
    }

    // The document as it was after one history entry (JSON). Same roles as
    // reading the history: they can already read every document.
    @GetMapping(value = "/snapshots/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public String getSnapshot(@PathVariable Long id) {
        return docHistoryService.getSnapshot(id);
    }
}
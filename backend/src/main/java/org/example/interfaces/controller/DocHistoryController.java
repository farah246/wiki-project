package org.example.interfaces.controller;

import org.example.application.service.DocHistoryService;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.DocHistoryModel;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Read-only. History rows are written by the document services only,
// so there is no public POST/DELETE (it would let anyone forge the audit trail).
@RestController
@RequestMapping("/api/doc-history")
public class DocHistoryController {

    private final DocHistoryService docHistoryService;

    public DocHistoryController(DocHistoryService docHistoryService) {
        this.docHistoryService = docHistoryService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<DocHistoryModel> getAll() {
        return docHistoryService.getAllHistories();
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
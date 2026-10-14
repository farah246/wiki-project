package org.example.interfaces.controller;

import jakarta.validation.Valid;
import org.example.application.exception.NotFoundException;
import org.example.application.service.TechnicalDocService;
import org.example.domain.model.TechnicalDocModel;
import org.example.interfaces.dto.request.TechnicalDocRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technical-docs")
public class TechnicalDocController {

    private final TechnicalDocService technicalDocService;

    public TechnicalDocController(TechnicalDocService technicalDocService) {
        this.technicalDocService = technicalDocService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<TechnicalDocModel> getAll() {
        return technicalDocService.getAllTechnicalDocs();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public TechnicalDocModel getById(@PathVariable Long id) {
        return technicalDocService.getTechnicalDocById(id)
                .orElseThrow(() -> new NotFoundException("Technical document not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public TechnicalDocModel create(
            @Valid @RequestBody TechnicalDocRequest request,
            Authentication authentication
    ) {
        return technicalDocService.saveTechnicalDoc(
                toModel(request),
                authentication
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public TechnicalDocModel update(
            @PathVariable Long id,
            @Valid @RequestBody TechnicalDocRequest request,
            // set by "restore this version": only changes the history label
            @RequestParam(required = false) Integer restoredFrom,
            Authentication authentication
    ) {
        return technicalDocService.updateTechnicalDoc(
                id,
                toModel(request),
                authentication,
                restoredFrom
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        technicalDocService.deleteTechnicalDoc(id, authentication);
    }

    // Only the editable fields come from the client. id, author and
    // timestamps are always decided by the server.
    private TechnicalDocModel toModel(TechnicalDocRequest request) {
        return new TechnicalDocModel(
                null,
                request.title().trim(),
                request.content().trim(),
                blankToNull(request.codeSnippet()),
                blankToNull(request.gitRef()),
                null,
                null,
                null
        );
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
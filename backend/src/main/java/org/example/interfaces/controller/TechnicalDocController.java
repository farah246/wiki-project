package org.example.interfaces.controller;

import org.example.application.service.TechnicalDocService;
import org.example.domain.model.TechnicalDocModel;
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
                .orElseThrow(() -> new RuntimeException("TechnicalDoc not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public TechnicalDocModel create(
            @RequestBody TechnicalDocModel technicalDoc,
            Authentication authentication
    ) {
        return technicalDocService.saveTechnicalDoc(
                technicalDoc,
                authentication
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public TechnicalDocModel update(
            @PathVariable Long id,
            @RequestBody TechnicalDocModel technicalDoc
    ) {
        return technicalDocService.updateTechnicalDoc(id, technicalDoc);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        technicalDocService.deleteTechnicalDoc(id);
    }
}
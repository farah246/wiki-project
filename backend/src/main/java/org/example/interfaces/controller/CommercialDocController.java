package org.example.interfaces.controller;

import org.example.application.service.CommercialDocService;
import org.example.domain.model.CommercialDocModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commercial-docs")
public class CommercialDocController {

    private final CommercialDocService commercialDocService;

    public CommercialDocController(CommercialDocService commercialDocService) {
        this.commercialDocService = commercialDocService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<CommercialDocModel> getAllDocs() {
        return commercialDocService.getAllDocs();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public CommercialDocModel getDocById(@PathVariable Long id) {
        return commercialDocService.getDocById(id)
                .orElseThrow(() -> new RuntimeException("Doc not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SALES', 'MANAGER', 'ADMIN')")
    public CommercialDocModel create(
            @RequestBody CommercialDocModel doc,
            Authentication authentication
    ) {
        return commercialDocService.saveDoc(doc, authentication);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SALES', 'MANAGER', 'ADMIN')")
    public CommercialDocModel updateDoc(
            @PathVariable Long id,
            @RequestBody CommercialDocModel doc
    ) {
        return commercialDocService.updateDoc(id, doc);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDoc(@PathVariable Long id) {
        commercialDocService.deleteDoc(id);
    }
}
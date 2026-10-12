package org.example.interfaces.controller;

import jakarta.validation.Valid;
import org.example.application.exception.NotFoundException;
import org.example.application.service.CommercialDocService;
import org.example.domain.model.CommercialDocModel;
import org.example.interfaces.dto.request.CommercialDocRequest;
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
                .orElseThrow(() -> new NotFoundException("Commercial document not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SALES', 'MANAGER', 'ADMIN')")
    public CommercialDocModel create(
            @Valid @RequestBody CommercialDocRequest request,
            Authentication authentication
    ) {
        return commercialDocService.saveDoc(toModel(request), authentication);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SALES', 'MANAGER', 'ADMIN')")
    public CommercialDocModel updateDoc(
            @PathVariable Long id,
            @Valid @RequestBody CommercialDocRequest request,
            Authentication authentication
    ) {
        return commercialDocService.updateDoc(id, toModel(request), authentication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDoc(
            @PathVariable Long id,
            Authentication authentication
    ) {
        commercialDocService.deleteDoc(id, authentication);
    }

    // Only the editable fields come from the client. id, author and
    // timestamps are always decided by the server.
    private CommercialDocModel toModel(CommercialDocRequest request) {
        return new CommercialDocModel(
                null,
                request.title().trim(),
                request.proposalText().trim(),
                null,
                request.clientName().trim(),
                null,
                null
        );
    }
}
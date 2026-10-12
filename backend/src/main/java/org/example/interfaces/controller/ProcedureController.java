package org.example.interfaces.controller;

import jakarta.validation.Valid;
import org.example.application.exception.NotFoundException;
import org.example.application.service.ProcedureService;
import org.example.domain.model.ProcedureModel;
import org.example.interfaces.dto.request.ProcedureRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedures")
public class ProcedureController {

    private final ProcedureService procedureService;

    public ProcedureController(ProcedureService procedureService) {
        this.procedureService = procedureService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<ProcedureModel> getAll() {
        return procedureService.getAllProcedures();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public ProcedureModel getById(@PathVariable Long id) {
        return procedureService.getProcedureById(id)
                .orElseThrow(() ->
                        new NotFoundException("Procedure not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public ProcedureModel create(
            @Valid @RequestBody ProcedureRequest request,
            Authentication authentication
    ) {
        return procedureService.saveProcedure(
                toModel(request),
                authentication
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public ProcedureModel update(
            @PathVariable Long id,
            @Valid @RequestBody ProcedureRequest request,
            Authentication authentication
    ) {
        return procedureService.updateProcedure(
                id,
                toModel(request),
                authentication
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        procedureService.deleteProcedure(id, authentication);
    }

    // Only the editable fields come from the client. id, author and
    // timestamps are always decided by the server.
    private ProcedureModel toModel(ProcedureRequest request) {
        return new ProcedureModel(
                null,
                request.title().trim(),
                request.description().trim(),
                request.visualModel() == null || request.visualModel().isBlank()
                        ? null
                        : request.visualModel().trim(),
                null,
                null,
                null
        );
    }
}
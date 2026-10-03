package org.example.interfaces.controller;

import org.example.application.service.ProcedureService;
import org.example.domain.model.ProcedureModel;
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
    public List<ProcedureModel> getAll() {
        return procedureService.getAllProcedures();
    }

    @GetMapping("/{id}")
    public ProcedureModel getById(@PathVariable Long id) {
        return procedureService.getProcedureById(id)
                .orElseThrow(() ->
                        new RuntimeException("Procedure not found"));
    }

    @PostMapping
    public ProcedureModel create(
            @RequestBody ProcedureModel procedure,
            Authentication authentication
    ) {
        return procedureService.saveProcedure(
                procedure,
                authentication
        );
    }

    @PutMapping("/{id}")
    public ProcedureModel update(
            @PathVariable Long id,
            @RequestBody ProcedureModel procedure
    ) {
        return procedureService.updateProcedure(id, procedure);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        procedureService.deleteProcedure(id);
    }
}
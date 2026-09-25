package org.example.interfaces.controller;

import org.example.application.service.ProcedureService;
import org.example.domain.model.ProcedureModel;
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
    public List<ProcedureModel> getAllProcedures() {
        return procedureService.getAllProcedures();
    }

    @GetMapping("/{id}")
    public ProcedureModel getProcedureById(@PathVariable Long id) {
        return procedureService.getProcedureById(id)
                .orElseThrow(() -> new RuntimeException("Procedure not found"));
    }

    @PostMapping
    public ProcedureModel createProcedure(@RequestBody ProcedureModel procedure) {
        return procedureService.saveProcedure(procedure);
    }

    @PutMapping("/{id}")
    public ProcedureModel updateProcedure(
            @PathVariable Long id,
            @RequestBody ProcedureModel procedure
    ) {
        return procedureService.updateProcedure(id, procedure);
    }

    @DeleteMapping("/{id}")
    public void deleteProcedure(@PathVariable Long id) {
        procedureService.deleteProcedure(id);
    }
}
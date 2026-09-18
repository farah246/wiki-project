package org.example.interfaces.controller;

import org.example.infrastructure.persistence.entity.Procedure;
import org.example.application.service.ProcedureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedures")
public class ProcedureController {

    private final ProcedureService procedureService;

    @Autowired
    public ProcedureController(ProcedureService procedureService) {
        this.procedureService = procedureService;
    }

    @GetMapping
    public List<Procedure> getAllProcedures() {
        return procedureService.getAllProcedures();
    }

    @GetMapping("/{id}")
    public Procedure getProcedureById(@PathVariable Long id) {
        return procedureService.getProcedureById(id)
                .orElseThrow(() -> new RuntimeException("Procedure not found"));
    }

    @PostMapping
    public Procedure createProcedure(@RequestBody Procedure procedure) {
        return procedureService.saveProcedure(procedure);
    }

    @DeleteMapping("/{id}")
    public void deleteProcedure(@PathVariable Long id) {
        procedureService.deleteProcedure(id);
    }
}

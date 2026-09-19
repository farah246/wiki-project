package org.example.interfaces.controller;

import org.example.application.service.TechnicalDocService;
import org.example.domain.model.TechnicalDocModel;
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
    public List<TechnicalDocModel> getAll() {
        return technicalDocService.getAllTechnicalDocs();
    }

    @GetMapping("/{id}")
    public TechnicalDocModel getById(@PathVariable Long id) {
        return technicalDocService.getTechnicalDocById(id)
                .orElseThrow(() -> new RuntimeException("TechnicalDoc not found"));
    }

    @PostMapping
    public TechnicalDocModel create(@RequestBody TechnicalDocModel technicalDoc) {
        return technicalDocService.saveTechnicalDoc(technicalDoc);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        technicalDocService.deleteTechnicalDoc(id);
    }
}
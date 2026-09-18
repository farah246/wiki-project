package org.example.interfaces.controller;

import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.example.application.service.TechnicalDocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technical-docs")
public class TechnicalDocController {

    private final TechnicalDocService technicalDocService;

    @Autowired
    public TechnicalDocController(TechnicalDocService technicalDocService) {
        this.technicalDocService = technicalDocService;
    }

    @GetMapping
    public List<TechnicalDoc> getAll() {
        return technicalDocService.getAllTechnicalDocs();
    }

    @GetMapping("/{id}")
    public TechnicalDoc getById(@PathVariable Long id) {
        return technicalDocService.getTechnicalDocById(id)
                .orElseThrow(() -> new RuntimeException("TechnicalDoc not found"));
    }

    @PostMapping
    public TechnicalDoc create(@RequestBody TechnicalDoc technicalDoc) {
        return technicalDocService.saveTechnicalDoc(technicalDoc);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        technicalDocService.deleteTechnicalDoc(id);
    }
}

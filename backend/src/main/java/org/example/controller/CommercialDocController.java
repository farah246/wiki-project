package org.example.controller;

import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.service.CommercialDocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docs")
public class CommercialDocController {

    private final CommercialDocService commercialDocService;

    @Autowired
    public CommercialDocController(CommercialDocService commercialDocService) {
        this.commercialDocService = commercialDocService;
    }

    @GetMapping
    public List<CommercialDoc> getAllDocs() {
        return commercialDocService.getAllDocs();
    }

    @PostMapping
    public CommercialDoc createDoc(@RequestBody CommercialDoc doc) {
        return commercialDocService.saveDoc(doc);
    }

    @GetMapping("/{id}")
    public CommercialDoc getDocById(@PathVariable Long id) {
        return commercialDocService.getDocById(id)
                .orElseThrow(() -> new RuntimeException("Doc not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        commercialDocService.deleteDoc(id);
    }
}

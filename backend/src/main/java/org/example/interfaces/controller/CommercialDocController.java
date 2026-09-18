package org.example.interfaces.controller;

import org.example.application.service.CommercialDocService;
import org.example.domain.model.CommercialDocModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docs")
public class CommercialDocController {

    private final CommercialDocService commercialDocService;

    public CommercialDocController(CommercialDocService commercialDocService) {
        this.commercialDocService = commercialDocService;
    }

    @GetMapping
    public List<CommercialDocModel> getAllDocs() {
        return commercialDocService.getAllDocs();
    }

    @PostMapping
    public CommercialDocModel createDoc(@RequestBody CommercialDocModel doc) {
        return commercialDocService.saveDoc(doc);
    }

    @GetMapping("/{id}")
    public CommercialDocModel getDocById(@PathVariable Long id) {
        return commercialDocService.getDocById(id)
                .orElseThrow(() -> new RuntimeException("Doc not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        commercialDocService.deleteDoc(id);
    }
}
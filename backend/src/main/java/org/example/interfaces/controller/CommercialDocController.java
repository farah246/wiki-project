package org.example.interfaces.controller;

import org.example.application.service.CommercialDocService;
import org.example.domain.model.CommercialDocModel;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/commercial-docs")
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
    public CommercialDocModel create(
            @RequestBody CommercialDocModel doc,
            Authentication authentication
    ) {
        return commercialDocService.saveDoc(doc, authentication);
    }   

    @GetMapping("/{id}")
    public CommercialDocModel getDocById(@PathVariable Long id) {
        return commercialDocService.getDocById(id)
                .orElseThrow(() -> new RuntimeException("Doc not found"));
    }

    @PutMapping("/{id}")
    public CommercialDocModel updateDoc(
            @PathVariable Long id,
            @RequestBody CommercialDocModel doc
    ) {
        return commercialDocService.updateDoc(id, doc);
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        commercialDocService.deleteDoc(id);
    }
}

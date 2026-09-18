package org.example.controller;

import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.service.DocHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doc-history")
public class DocHistoryController {

    private final DocHistoryService docHistoryService;

    @Autowired
    public DocHistoryController(DocHistoryService docHistoryService) {
        this.docHistoryService = docHistoryService;
    }

    @GetMapping
    public List<DocHistory> getAll() {
        return docHistoryService.getAllHistories();
    }

    @GetMapping("/{id}")
    public DocHistory getById(@PathVariable Long id) {
        return docHistoryService.getHistoryById(id)
                .orElseThrow(() -> new RuntimeException("DocHistory not found"));
    }

    @PostMapping
    public DocHistory create(@RequestBody DocHistory docHistory) {
        return docHistoryService.saveHistory(docHistory);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        docHistoryService.deleteHistory(id);
    }
}

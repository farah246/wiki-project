package org.example.interfaces.controller;

import org.example.application.service.DocHistoryService;
import org.example.domain.model.DocHistoryModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doc-history")
public class DocHistoryController {

    private final DocHistoryService docHistoryService;

    public DocHistoryController(DocHistoryService docHistoryService) {
        this.docHistoryService = docHistoryService;
    }

    @GetMapping
    public List<DocHistoryModel> getAll() {
        return docHistoryService.getAllHistories();
    }

    @GetMapping("/{id}")
    public DocHistoryModel getById(@PathVariable Long id) {
        return docHistoryService.getHistoryById(id)
                .orElseThrow(() -> new RuntimeException("DocHistory not found"));
    }

    @PostMapping
    public DocHistoryModel create(@RequestBody DocHistoryModel docHistory) {
        return docHistoryService.saveHistory(docHistory);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        docHistoryService.deleteHistory(id);
    }
}
package org.example.interfaces.controller;

import org.example.application.service.SemanticSearchService;
import org.example.domain.model.SearchResultModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SemanticSearchService semanticSearchService;

    public SearchController(SemanticSearchService semanticSearchService) {
        this.semanticSearchService = semanticSearchService;
    }

    @GetMapping
    public List<SearchResultModel> search(
            @RequestParam String query
    ) {
        return semanticSearchService.search(query, 5);
    }
}
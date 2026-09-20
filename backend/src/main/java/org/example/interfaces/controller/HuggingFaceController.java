package org.example.interfaces.controller;

import org.example.application.service.HuggingFaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/embed")
public class HuggingFaceController {

    @Autowired
    private HuggingFaceService embeddingService;

    @GetMapping("/test")
    public String testEmbedding() {
        double[] vector = embeddingService.getEmbedding("This is a test sentence.");
        return "Vector length: " + vector.length;
    }
}

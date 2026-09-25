package org.example.interfaces.controller;

import org.example.application.service.DocumentChunkingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chunking-test")
public class ChunkingTestController {

    private final DocumentChunkingService chunkingService;

    public ChunkingTestController(DocumentChunkingService chunkingService) {
        this.chunkingService = chunkingService;
    }

    @PostMapping
    public List<String> chunkDocument(@RequestBody ChunkingRequest request) {
        return chunkingService.chunkText(request.text());
    }

    public record ChunkingRequest(String text) {}
}
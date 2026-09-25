package org.example.application.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DocumentChunkingService {

    private static final int CHUNK_SIZE = 500;
    private static final int OVERLAP = 50;
    private static final Pattern WORD_PATTERN = Pattern.compile("\\S+");

    public List<String> chunkText(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        List<int[]> tokenPositions = new ArrayList<>();
        Matcher matcher = WORD_PATTERN.matcher(text);

        while (matcher.find()) {
            tokenPositions.add(new int[]{matcher.start(), matcher.end()});
        }

        List<String> chunks = new ArrayList<>();
        int startToken = 0;

        while (startToken < tokenPositions.size()) {
            int endToken = Math.min(startToken + CHUNK_SIZE, tokenPositions.size());

            int startChar = tokenPositions.get(startToken)[0];
            int endChar = tokenPositions.get(endToken - 1)[1];

            chunks.add(text.substring(startChar, endChar));

            if (endToken == tokenPositions.size()) {
                break;
            }

            startToken = endToken - OVERLAP;
        }

        return chunks;
    }
}
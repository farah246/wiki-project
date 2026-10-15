package org.example.application.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DocumentChunkingService {

    private static final int MAX_CHARS = 1800;      // ≈ 450 tokens, sous la limite de 512
    private static final int OVERLAP_CHARS = 200;
    private static final Pattern HEADING = Pattern.compile("^(#{1,4})\\s+(.+?)\\s*$");

    public List<String> chunkText(String text) {
        return chunkMarkdown(null, text);
    }

    public List<String> chunkMarkdown(String title, String markdown) {
        if (markdown == null || markdown.isBlank()) {
            return List.of();
        }

        List<String> chunks = new ArrayList<>();
        String[] byLevel = new String[5];
        StringBuilder section = new StringBuilder();
        boolean inFence = false;

        for (String line : markdown.split("\\R", -1)) {
            if (line.stripLeading().startsWith("```")) {
                inFence = !inFence;
            }
            Matcher heading = inFence ? null : HEADING.matcher(line);

            if (heading != null && heading.matches()) {
                flush(chunks, title, byLevel, section);
                int level = heading.group(1).length();
                byLevel[level] = heading.group(2);
                for (int i = level + 1; i < byLevel.length; i++) {
                    byLevel[i] = null;
                }
            } else {
                section.append(line).append('\n');
            }
        }
        flush(chunks, title, byLevel, section);

        return chunks;
    }

    private void flush(List<String> chunks, String title, String[] byLevel, StringBuilder section) {
        String body = section.toString().strip();
        section.setLength(0);
        if (body.isEmpty()) {
            return;
        }

        List<String> trail = new ArrayList<>();
        if (title != null && !title.isBlank()) {
            trail.add(title);
        }
        for (String heading : byLevel) {
            if (heading != null) {
                trail.add(heading);
            }
        }
        String prefix = String.join(" › ", trail);

        for (String piece : split(body)) {
            chunks.add(prefix.isEmpty() ? piece : prefix + "\n\n" + piece);
        }
    }

    // paragraphes regroupés jusqu'à MAX_CHARS ; un paragraphe trop long est coupé
    private List<String> split(String body) {
        List<String> pieces = new ArrayList<>();
        StringBuilder current = new StringBuilder();

        for (String paragraph : body.split("\\n\\s*\\n")) {
            for (String part : hardSplit(paragraph)) {
                if (current.length() > 0 && current.length() + part.length() + 2 > MAX_CHARS) {
                    pieces.add(current.toString());
                    current.setLength(0);
                }
                if (current.length() > 0) {
                    current.append("\n\n");
                }
                current.append(part);
            }
        }
        if (current.length() > 0) {
            pieces.add(current.toString());
        }
        return pieces;
    }

    private List<String> hardSplit(String text) {
        if (text.length() <= MAX_CHARS) {
            return text.isBlank() ? List.of() : List.of(text);
        }
        List<String> parts = new ArrayList<>();
        int start = 0;
        while (start < text.length()) {
            int end = Math.min(start + MAX_CHARS, text.length());
            if (end < text.length()) {
                int newline = text.lastIndexOf('\n', end);
                if (newline > start + MAX_CHARS / 2) {
                    end = newline;
                }
            }
            String part = text.substring(start, end).strip();
            if (!part.isEmpty()) {
                parts.add(part);
            }
            if (end >= text.length()) {
                break;
            }
            start = end - OVERLAP_CHARS;
        }
        return parts;
    }
}
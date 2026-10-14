package org.example.domain.model;

import java.util.List;

public record ActivityPage(
        List<ActivityEntryModel> items,
        int page,
        int totalPages,
        long total
) {}
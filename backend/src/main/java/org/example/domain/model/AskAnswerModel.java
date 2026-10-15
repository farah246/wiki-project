package org.example.domain.model;

import java.util.List;

public record AskAnswerModel(
        String answer,
        List<AskSourceModel> sources
) {
}
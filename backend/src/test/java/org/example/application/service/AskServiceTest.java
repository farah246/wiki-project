package org.example.application.service;

import org.example.application.gateway.LlmGateway;
import org.example.domain.model.AskAnswerModel;
import org.example.domain.model.AskSourceModel;
import org.example.domain.model.SearchResultModel;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class AskServiceTest {

    private final SemanticSearchService search = mock(SemanticSearchService.class);
    private final LlmGateway llm = mock(LlmGateway.class);
    private final AskService service = new AskService(search, llm, 3, 0.5);

    private static SearchResultModel hit(long id, String title, double similarity) {
        return new SearchResultModel(id, "TECHNICAL", title, title + " › chunk text", similarity);
    }

    @Test
    void doesNotCallTheLlmWhenNothingIsRelevant() {
        when(search.retrieveChunks(anyString(), anyInt()))
                .thenReturn(List.of(hit(1, "Deploy", 0.2)));

        AskAnswerModel answer = service.ask("how do I deploy?");

        assertThat(answer.answer()).isEqualTo(AskService.NO_ANSWER);
        assertThat(answer.sources()).isEmpty();
        verifyNoInteractions(llm);
    }

    @Test
    void keepsOnlyTheSourcesTheAnswerCites() {
        when(search.retrieveChunks(anyString(), anyInt())).thenReturn(List.of(
                hit(1, "A", 0.9), hit(2, "B", 0.8), hit(3, "C", 0.7)));
        when(llm.complete(anyString(), anyString())).thenReturn("Use B [2].");

        AskAnswerModel answer = service.ask("what should I use?");

        assertThat(answer.sources()).extracting(AskSourceModel::number).containsExactly(2);
        assertThat(answer.sources().get(0).documentId()).isEqualTo(2L);
    }

    @Test
    void showsAllSourcesWhenTheModelCitesNothing() {
        when(search.retrieveChunks(anyString(), anyInt())).thenReturn(List.of(
                hit(1, "A", 0.9), hit(2, "B", 0.8)));
        when(llm.complete(anyString(), anyString())).thenReturn("Some answer without citations.");

        AskAnswerModel answer = service.ask("question");

        assertThat(answer.sources()).hasSize(2);
    }

    @Test
    void ignoresCitationsThatDoNotExist() {
        when(search.retrieveChunks(anyString(), anyInt())).thenReturn(List.of(hit(1, "A", 0.9)));
        when(llm.complete(anyString(), anyString())).thenReturn("Made up [7].");

        AskAnswerModel answer = service.ask("question");

        assertThat(answer.sources()).extracting(AskSourceModel::number).containsExactly(1);
    }
}
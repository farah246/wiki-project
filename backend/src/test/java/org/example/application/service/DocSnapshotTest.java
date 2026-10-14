package org.example.application.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.domain.model.CommercialDocModel;
import org.example.domain.model.ProcedureModel;
import org.example.domain.model.TechnicalDocModel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DocSnapshotTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void technicalDoc_keepsTheEditableFields() throws Exception {
        TechnicalDocModel doc = new TechnicalDocModel(
                1L, "Deploy", "Use docker", "docker compose up", "main",
                null, null, null);

        JsonNode json = mapper.readTree(DocSnapshot.of(doc));

        assertEquals("Deploy", json.get("title").asText());
        assertEquals("Use docker", json.get("content").asText());
        assertEquals("docker compose up", json.get("codeSnippet").asText());
        assertEquals("main", json.get("gitRef").asText());
    }

    @Test
    void technicalDoc_doesNotKeepTheIdOrTheAuthor() throws Exception {
        TechnicalDocModel doc = new TechnicalDocModel(
                1L, "Deploy", "Use docker", null, null, null, null, null);

        JsonNode json = mapper.readTree(DocSnapshot.of(doc));

        // only what an update request accepts, so it can be sent back as is
        assertFalse(json.has("id"));
        assertFalse(json.has("user"));
        assertEquals(4, json.size());
    }

    @Test
    void emptyOptionalFields_areKeptAsNull() throws Exception {
        TechnicalDocModel doc = new TechnicalDocModel(
                1L, "Deploy", "Use docker", null, null, null, null, null);

        JsonNode json = mapper.readTree(DocSnapshot.of(doc));

        assertTrue(json.get("codeSnippet").isNull());
        assertTrue(json.get("gitRef").isNull());
    }

    @Test
    void commercialDoc_keepsTheEditableFields() throws Exception {
        CommercialDocModel doc = new CommercialDocModel(
                2L, "Offer", "Proposal", null, "Acme", null, null);

        JsonNode json = mapper.readTree(DocSnapshot.of(doc));

        assertEquals("Offer", json.get("title").asText());
        assertEquals("Proposal", json.get("proposalText").asText());
        assertEquals("Acme", json.get("clientName").asText());
        assertEquals(3, json.size());
    }

    @Test
    void procedure_keepsTheEditableFields() throws Exception {
        ProcedureModel doc = new ProcedureModel(
                3L, "Release", "Steps", "graph TD", null, null, null);

        JsonNode json = mapper.readTree(DocSnapshot.of(doc));

        assertEquals("Release", json.get("title").asText());
        assertEquals("Steps", json.get("description").asText());
        assertEquals("graph TD", json.get("visualModel").asText());
        assertEquals(3, json.size());
    }

    @Test
    void specialCharacters_surviveTheRoundTrip() throws Exception {
        TechnicalDocModel doc = new TechnicalDocModel(
                1L, "Quotes \"here\"", "line 1\nline 2", "a\\b", null,
                null, null, null);

        JsonNode json = mapper.readTree(DocSnapshot.of(doc));

        assertEquals("Quotes \"here\"", json.get("title").asText());
        assertEquals("line 1\nline 2", json.get("content").asText());
        assertEquals("a\\b", json.get("codeSnippet").asText());
    }
}
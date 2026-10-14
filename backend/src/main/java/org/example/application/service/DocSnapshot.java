package org.example.application.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.domain.model.CommercialDocModel;
import org.example.domain.model.ProcedureModel;
import org.example.domain.model.TechnicalDocModel;

import java.util.LinkedHashMap;
import java.util.Map;

// Turns a document into the JSON stored with a history entry. Only the fields
// a user can edit are kept, under the same names as the API requests, so a
// saved version can be sent back as an update to restore it.
final class DocSnapshot {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private DocSnapshot() {
    }

    static String of(TechnicalDocModel doc) {
        Map<String, Object> fields = new LinkedHashMap<>();
        fields.put("title", doc.title());
        fields.put("content", doc.content());
        fields.put("codeSnippet", doc.codeSnippet());
        fields.put("gitRef", doc.gitRef());

        return toJson(fields);
    }

    static String of(CommercialDocModel doc) {
        Map<String, Object> fields = new LinkedHashMap<>();
        fields.put("title", doc.title());
        fields.put("proposalText", doc.proposalText());
        fields.put("clientName", doc.clientName());

        return toJson(fields);
    }

    static String of(ProcedureModel doc) {
        Map<String, Object> fields = new LinkedHashMap<>();
        fields.put("title", doc.title());
        fields.put("description", doc.description());
        fields.put("visualModel", doc.visualModel());

        return toJson(fields);
    }

    private static String toJson(Map<String, Object> fields) {
        try {
            return MAPPER.writeValueAsString(fields);
        } catch (JsonProcessingException e) {
            // plain strings: this cannot happen in practice
            throw new IllegalStateException("Could not save the document version", e);
        }
    }
}
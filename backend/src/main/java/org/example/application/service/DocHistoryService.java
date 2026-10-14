package org.example.application.service;

import org.example.application.exception.NotFoundException;
import org.example.application.gateway.DocHistoryGateway;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.DocHistoryModel;
import org.example.domain.model.UserModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import org.example.domain.model.ActivityPage;
import java.util.Set;
@Service
public class DocHistoryService {

    private final DocHistoryGateway docHistoryGateway;

    public DocHistoryService(DocHistoryGateway docHistoryGateway) {
        this.docHistoryGateway = docHistoryGateway;
    }

    public List<DocHistoryModel> getAllHistories() {
        return docHistoryGateway.findAll();
    }

    public Optional<DocHistoryModel> getHistoryById(Long id) {
        return docHistoryGateway.findById(id);
    }

    public DocHistoryModel saveHistory(DocHistoryModel history) {
        return docHistoryGateway.save(history);
    }

    public void deleteHistory(Long id) {
        docHistoryGateway.deleteById(id);
    }

    public List<DocHistoryModel> getHistoryForDocument(
            DocumentType type,
            Long docId
    ) {
        return docHistoryGateway.findByDocument(type, docId);
    }

    // The saved version (JSON) of one history entry
    public String getSnapshot(Long historyId) {
        return docHistoryGateway.findById(historyId)
                .map(DocHistoryModel::snapshot)
                .orElseThrow(() ->
                        new NotFoundException("No saved version for this entry"));
    }
    private static final Set<String> ACTIONS =
            Set.of("CREATED", "UPDATED", "RESTORED", "DELETED");

    // Parameters come from the URL: never trusted as is
    public ActivityPage getActivity(Long userId, String action, int page, int size) {
        String filter = action != null && ACTIONS.contains(action) ? action : null;

        return docHistoryGateway.findActivity(
                userId, filter, Math.max(page, 0), Math.min(Math.max(size, 1), 50));
    }
    // ---- recording (called by the document services only) ----

    public void recordCreated(
            DocumentType type,
            Long docId,
            String title,
            UserModel user
    ) {
        recordCreated(type, docId, title, user, null);
    }

    // snapshot: the document as it is after the creation (JSON), or null
    public void recordCreated(
            DocumentType type,
            Long docId,
            String title,
            UserModel user,
            String snapshot
    ) {
        record(type, docId, user, "CREATED",
                "Created \"" + title + "\"", 1, snapshot);
    }

    public void recordUpdated(
            DocumentType type,
            Long docId,
            UserModel user,
            List<String> changedFields
    ) {
        recordUpdated(type, docId, user, changedFields, null);
    }

    // snapshot: the document as it is after the update (JSON), or null
    public void recordUpdated(
            DocumentType type,
            Long docId,
            UserModel user,
            List<String> changedFields,
            String snapshot
    ) {
        recordUpdated(type, docId, user, changedFields, snapshot, null);
    }

    // restoredFrom: the version the author put back, or null for a normal
    // edit. A restoration is still recorded as a new version (history is
    // never rewritten), but it is labelled "Restored from vN" instead of
    // "Changed: ...".
    public void recordUpdated(
            DocumentType type,
            Long docId,
            UserModel user,
            List<String> changedFields,
            String snapshot,
            Integer restoredFrom
    ) {
        if (changedFields.isEmpty()) {
            return;
        }

        // The next version follows the highest one recorded (the database
        // has a unique index on document + version). Documents that existed
        // before history was added have no rows yet: their earlier state
        // counts as version 1.
        int latest = docHistoryGateway.latestVersionByDocument(type, docId);
        int version = Math.max(latest, 1) + 1;

        if (isRestoration(type, docId, restoredFrom)) {
            record(type, docId, user, "RESTORED",
                    "Restored from v" + restoredFrom, version, snapshot);
            return;
        }

        record(type, docId, user, "UPDATED",
                "Changed: " + String.join(", ", changedFields), version,
                snapshot);
    }

    @Transactional
    public void recordDeleted(
            DocumentType type,
            Long docId,
            String title,
            UserModel user
    ) {
        docHistoryGateway.detachDocument(type, docId);

        // The row is no longer linked to a document (it is being deleted);
        // the description keeps what was deleted.
        record(type, null, user, "DELETED",
                "Deleted " + label(type) + " \"" + title + "\"", null, null);
    }

    // null and blank are treated as the same value
    public static boolean changed(String before, String after) {
        String a = before == null ? "" : before;
        String b = after == null ? "" : after;

        return !a.equals(b);
    }

    private void record(
            DocumentType type,
            Long docId,
            UserModel user,
            String action,
            String change,
            Integer version,
            String snapshot
    ) {
        Long technicalDocId =
                type == DocumentType.TECHNICAL_DOC ? docId : null;
        Long commercialDocId =
                type == DocumentType.COMMERCIAL_DOC ? docId : null;
        Long procedureId =
                type == DocumentType.PROCEDURE ? docId : null;

        docHistoryGateway.save(new DocHistoryModel(
                null,
                technicalDocId,
                commercialDocId,
                procedureId,
                user,
                action,
                change,
                null,
                null,
                version,
                snapshot
        ));
    }

    // The label is only used when the version really belongs to this
    // document: the number comes from the client, so it is never trusted
    // alone. Otherwise the entry is recorded as a normal edit.
    private boolean isRestoration(
            DocumentType type,
            Long docId,
            Integer restoredFrom
    ) {
        if (restoredFrom == null || restoredFrom < 1) {
            return false;
        }

        return docHistoryGateway.findByDocument(type, docId).stream()
                .anyMatch(entry -> restoredFrom.equals(entry.docVersion()));
    }

    private String label(DocumentType type) {
        return switch (type) {
            case TECHNICAL_DOC -> "technical document";
            case COMMERCIAL_DOC -> "commercial document";
            case PROCEDURE -> "procedure";
        };
    }
}
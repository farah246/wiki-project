package org.example.application.service;

import org.example.application.exception.NotFoundException;
import org.example.application.gateway.DocHistoryGateway;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.DocHistoryModel;
import org.example.domain.model.UserModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocHistoryServiceTest {

    @Mock
    private DocHistoryGateway gateway;

    @InjectMocks
    private DocHistoryService service;

    private final UserModel user = new UserModel(
            1L, "user_1", "farah", "farah@example.com",
            "DEVELOPER", null, null);

    private DocHistoryModel savedRow() {
        ArgumentCaptor<DocHistoryModel> captor =
                ArgumentCaptor.forClass(DocHistoryModel.class);
        verify(gateway).save(captor.capture());
        return captor.getValue();
    }

    @Test
    void recordUpdated_withoutChangedFields_savesNothing() {
        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user, List.of());

        verifyNoInteractions(gateway);
    }

    @Test
    void recordUpdated_documentWithoutHistory_startsAtVersionTwo() {
        when(gateway.latestVersionByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(0);

        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of("title", "content"));

        DocHistoryModel row = savedRow();
        assertEquals(2, row.docVersion());
        assertEquals("UPDATED", row.action());
        assertEquals("Changed: title, content", row.change());
        assertEquals(10L, row.technicalDocId());
        assertNull(row.commercialDocId());
        assertNull(row.procedureId());
    }

    @Test
    void recordUpdated_incrementsTheLatestVersion() {
        when(gateway.latestVersionByDocument(DocumentType.PROCEDURE, 5L))
                .thenReturn(3);

        service.recordUpdated(
                DocumentType.PROCEDURE, 5L, user, List.of("description"));

        DocHistoryModel row = savedRow();
        assertEquals(4, row.docVersion());
        assertEquals(5L, row.procedureId());
    }

    @Test
    void recordUpdated_afterAnEditOfAnOlderDocument_doesNotReuseVersionTwo() {
        // an older document has no CREATED row: its only row is the v2 edit
        when(gateway.latestVersionByDocument(DocumentType.COMMERCIAL_DOC, 4L))
                .thenReturn(2);

        service.recordUpdated(
                DocumentType.COMMERCIAL_DOC, 4L, user, List.of("title"));

        assertEquals(3, savedRow().docVersion());
    }

    @Test
    void recordCreated_isVersionOne_andLinkedToTheRightDocumentType() {
        service.recordCreated(
                DocumentType.COMMERCIAL_DOC, 7L, "Offer", user);

        DocHistoryModel row = savedRow();
        assertEquals(1, row.docVersion());
        assertEquals("CREATED", row.action());
        assertEquals("Created \"Offer\"", row.change());
        assertEquals(7L, row.commercialDocId());
        assertNull(row.technicalDocId());
        assertNull(row.procedureId());
        assertEquals(user, row.user());
    }

    @Test
    void recordDeleted_detachesRowsBeforeSavingAnUnlinkedDeletedRow() {
        service.recordDeleted(
                DocumentType.PROCEDURE, 5L, "Deploy", user);

        InOrder order = inOrder(gateway);
        order.verify(gateway).detachDocument(DocumentType.PROCEDURE, 5L);
        order.verify(gateway).save(any(DocHistoryModel.class));

        DocHistoryModel row = savedRow();
        assertEquals("DELETED", row.action());
        assertEquals("Deleted procedure \"Deploy\"", row.change());
        assertNull(row.technicalDocId());
        assertNull(row.commercialDocId());
        assertNull(row.procedureId());
        assertNull(row.docVersion());
    }

    @Test
    void changed_treatsNullAndEmptyAsTheSameValue() {
        assertFalse(DocHistoryService.changed(null, ""));
        assertFalse(DocHistoryService.changed("a", "a"));
        assertTrue(DocHistoryService.changed("a", "b"));
        assertTrue(DocHistoryService.changed(null, "a"));
    }

    // ---- saved versions (snapshots) ----

    private static final String SNAPSHOT =
            "{\"title\":\"Offer\",\"proposalText\":\"Text\",\"clientName\":\"Acme\"}";

    private DocHistoryModel entry(Long id, String snapshot) {
        return new DocHistoryModel(
                id, 10L, null, null, user,
                "UPDATED", "Changed: title", null, null, 2, snapshot);
    }

    @Test
    void recordCreated_withSnapshot_savesIt() {
        service.recordCreated(
                DocumentType.COMMERCIAL_DOC, 7L, "Offer", user, SNAPSHOT);

        DocHistoryModel row = savedRow();
        assertEquals(SNAPSHOT, row.snapshot());
        assertTrue(row.hasSnapshot());
        assertEquals(1, row.docVersion());
    }

    @Test
    void recordCreated_withoutSnapshot_savesNone() {
        service.recordCreated(
                DocumentType.COMMERCIAL_DOC, 7L, "Offer", user);

        DocHistoryModel row = savedRow();
        assertNull(row.snapshot());
        assertFalse(row.hasSnapshot());
    }

    @Test
    void recordUpdated_withSnapshot_savesIt() {
        when(gateway.latestVersionByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(1);

        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of("title"), SNAPSHOT);

        DocHistoryModel row = savedRow();
        assertEquals(SNAPSHOT, row.snapshot());
        assertEquals(2, row.docVersion());
    }

    @Test
    void recordUpdated_withoutChangedFields_savesNothing_evenWithASnapshot() {
        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of(), SNAPSHOT);

        verifyNoInteractions(gateway);
    }

    @Test
    void recordDeleted_savesNoSnapshot() {
        service.recordDeleted(
                DocumentType.PROCEDURE, 5L, "Deploy", user);

        assertNull(savedRow().snapshot());
    }

    @Test
    void getSnapshot_returnsTheSavedVersion() {
        when(gateway.findById(9L)).thenReturn(Optional.of(entry(9L, SNAPSHOT)));

        assertEquals(SNAPSHOT, service.getSnapshot(9L));
    }

    @Test
    void getSnapshot_entryWithoutSnapshot_isNotFound() {
        // rows recorded before versions were saved
        when(gateway.findById(9L)).thenReturn(Optional.of(entry(9L, null)));

        assertThrows(NotFoundException.class, () -> service.getSnapshot(9L));
    }

    @Test
    void getSnapshot_unknownEntry_isNotFound() {
        when(gateway.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.getSnapshot(99L));
    }

    // ---- restoring a version ----

    private DocHistoryModel versionRow(int version) {
        return new DocHistoryModel(
                version * 10L, 10L, null, null, user,
                "UPDATED", "Changed: title", null, null, version, SNAPSHOT);
    }

    @Test
    void recordUpdated_restoredFromAnExistingVersion_isLabelledAsARestoration() {
        when(gateway.latestVersionByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(3);
        when(gateway.findByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(List.of(versionRow(3), versionRow(2), versionRow(1)));

        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of("title", "content"), SNAPSHOT, 1);

        DocHistoryModel row = savedRow();
        assertEquals("RESTORED", row.action());
        assertEquals("Restored from v1", row.change());
        // still a new version: history is never rewritten
        assertEquals(4, row.docVersion());
        assertEquals(SNAPSHOT, row.snapshot());
        assertEquals(10L, row.technicalDocId());
    }

    @Test
    void recordUpdated_restoredFromAVersionOfAnotherDocument_isRecordedAsANormalEdit() {
        when(gateway.latestVersionByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(2);
        when(gateway.findByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(List.of(versionRow(2), versionRow(1)));

        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of("title"), SNAPSHOT, 99);

        DocHistoryModel row = savedRow();
        assertEquals("UPDATED", row.action());
        assertEquals("Changed: title", row.change());
        assertEquals(3, row.docVersion());
    }

    @Test
    void recordUpdated_withoutRestoredFrom_keepsTheNormalLabel() {
        when(gateway.latestVersionByDocument(DocumentType.TECHNICAL_DOC, 10L))
                .thenReturn(1);

        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of("content"), SNAPSHOT, null);

        DocHistoryModel row = savedRow();
        assertEquals("UPDATED", row.action());
        assertEquals("Changed: content", row.change());
        verify(gateway, never()).findByDocument(any(), any());
    }

    @Test
    void recordUpdated_restoredFromButNothingChanged_savesNothing() {
        // restoring the version that is already current changes nothing
        service.recordUpdated(
                DocumentType.TECHNICAL_DOC, 10L, user,
                List.of(), SNAPSHOT, 1);

        verifyNoInteractions(gateway);
    }
}
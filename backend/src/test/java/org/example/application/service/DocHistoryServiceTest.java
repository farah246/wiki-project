package org.example.application.service;

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
}
package org.example.infrastructure.persistence.entity;

import jakarta.persistence.*;
import org.example.domain.enums.DocumentType;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// A user starring a document. There is no foreign key to the document tables
// (the three document types share this table), so the services delete the
// favorites of a document when the document itself is deleted.
@Entity
@Table(
        name = "favorites",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_favorites_user_doc",
                columnNames = {"user_id", "doc_type", "doc_id"}
        )
)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // users.id: stays valid when the Clerk username changes
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "doc_type", nullable = false, length = 30)
    private DocumentType docType;

    @Column(name = "doc_id", nullable = false)
    private Long docId;

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Favorite() {}

    public Favorite(Long userId, DocumentType docType, Long docId) {
        this.userId = userId;
        this.docType = docType;
        this.docId = docId;
    }

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public DocumentType getDocType() { return docType; }

    public void setDocType(DocumentType docType) { this.docType = docType; }

    public Long getDocId() { return docId; }

    public void setDocId(Long docId) { this.docId = docId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
package org.example.infrastructure.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "doc_embeddings")
public class Embedding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "technical_doc_id")
    private TechnicalDoc technicalDoc;

    @ManyToOne
    @JoinColumn(name = "commercial_doc_id")
    private CommercialDoc commercialDoc;

    @ManyToOne
    @JoinColumn(name = "procedure_id")
    private Procedure procedure;

    @Column(name = "chunk_index", nullable = false)
    private Integer chunkIndex;

    @Column(name = "chunk_content", columnDefinition = "TEXT")
    private String chunkContent;

    @Column(name = "embedding", columnDefinition = "TEXT", nullable = false)
    private String embeddings;

    @Column(name = "model_used", length = 100)
    private String modelUsed;

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime updatedAt;

    // getters, setters, constructors
    public Embedding() {}

    public Embedding(Object document, Integer chunkIndex, String chunkContent, String embeddings, String modelUsed) {
        setDocument(document);
        this.chunkIndex = chunkIndex;
        this.chunkContent = chunkContent;
        this.embeddings = embeddings;
        this.modelUsed = modelUsed;
    }

// Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TechnicalDoc getTechnicalDoc() {
        return technicalDoc;
    }

    public void setTechnicalDoc(TechnicalDoc technicalDoc) {
        this.technicalDoc = technicalDoc;
    }

    public CommercialDoc getCommercialDoc() {
        return commercialDoc;
    }

    public void setCommercialDoc(CommercialDoc commercialDoc) {
        this.commercialDoc = commercialDoc;
    }

    public Procedure getProcedure() {
        return procedure;
    }

    public void setProcedure(Procedure procedure) {
        this.procedure = procedure;
    }

    public Integer getChunkIndex() {
        return chunkIndex;
    }

    public void setChunkIndex(Integer chunkIndex) {
        this.chunkIndex = chunkIndex;
    }

    public String getChunkContent() {
        return chunkContent;
    }

    public void setChunkContent(String chunkContent) {
        this.chunkContent = chunkContent;
    }

    public String getEmbeddings() {
        return embeddings;
    }

    public void setEmbeddings(String embeddings) {
        this.embeddings = embeddings;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper method to set the correct document reference
    public void setDocument(Object document) {
        if (document instanceof TechnicalDoc) {
            this.technicalDoc = (TechnicalDoc) document;
            this.commercialDoc = null;
            this.procedure = null;
        } else if (document instanceof CommercialDoc) {
            this.commercialDoc = (CommercialDoc) document;
            this.technicalDoc = null;
            this.procedure = null;
        } else if (document instanceof Procedure) {
            this.procedure = (Procedure) document;
            this.technicalDoc = null;
            this.commercialDoc = null;
        }
    }

    // Getter to retrieve the document (returns the non-null reference)
    public Object getDocument() {
        if (technicalDoc != null) return technicalDoc;
        if (commercialDoc != null) return commercialDoc;
        if (procedure != null) return procedure;
        return null;
    }
}
// DocumentType.java

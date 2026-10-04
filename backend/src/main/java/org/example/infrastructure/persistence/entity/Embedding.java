package org.example.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

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

    @JdbcTypeCode(SqlTypes.VECTOR)
    @Column(name = "embedding", columnDefinition = "vector(384)", nullable = false)
    private float[] embeddings;

    @Column(name = "model_used", length = 100)
    private String modelUsed;

    @CreationTimestamp
    @Column(
            name = "created_at",
            columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(
            name = "updated_at",
            columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private LocalDateTime updatedAt;

    public Embedding() {
    }

    public Embedding(
            Object document,
            Integer chunkIndex,
            String chunkContent,
            float[] embeddings,
            String modelUsed
    ) {
        setDocument(document);
        this.chunkIndex = chunkIndex;
        this.chunkContent = chunkContent;
        this.embeddings = embeddings;
        this.modelUsed = modelUsed;
    }

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

    public float[] getEmbeddings() {
        return embeddings;
    }

    public void setEmbeddings(float[] embeddings) {
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

    public Object getDocument() {
        if (technicalDoc != null) {
            return technicalDoc;
        }

        if (commercialDoc != null) {
            return commercialDoc;
        }

        if (procedure != null) {
            return procedure;
        }

        return null;
    }
}
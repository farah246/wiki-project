package org.example.infrastructure.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "doc_history")
public class DocHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technical_doc_id", nullable = true)
    private TechnicalDoc technicalDoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commercial_doc_id", nullable = true)
    private CommercialDoc commercialDoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedure_id", nullable = true)
    private Procedure procedure;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "change_description", columnDefinition = "TEXT")
    private String change;

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime updatedAt;

    @Column(name = "version_number")
    private Integer docVersion;

    // getters, setters, constructors
    // Add this to your DocHistory class (under the fields)
    public DocHistory() {}

    public DocHistory(TechnicalDoc technicalDoc, CommercialDoc commercialDoc, Procedure procedure,
                      User user, String action, String change, Integer docVersion) {
        this.technicalDoc = technicalDoc;
        this.commercialDoc = commercialDoc;
        this.procedure = procedure;
        this.user = user;
        this.action = action;
        this.change = change;
        this.docVersion = docVersion;
    }

// Getters and setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public TechnicalDoc getTechnicalDoc() { return technicalDoc; }

    public void setTechnicalDoc(TechnicalDoc technicalDoc) { this.technicalDoc = technicalDoc; }

    public CommercialDoc getCommercialDoc() { return commercialDoc; }

    public void setCommercialDoc(CommercialDoc commercialDoc) { this.commercialDoc = commercialDoc; }

    public Procedure getProcedure() { return procedure; }

    public void setProcedure(Procedure procedure) { this.procedure = procedure; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public String getAction() { return action; }

    public void setAction(String action) { this.action = action; }

    public String getChange() { return change; }

    public void setChange(String change) { this.change = change; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getDocVersion() { return docVersion; }

    public void setDocVersion(Integer docVersion) { this.docVersion = docVersion; }

    // Helper method to set the correct document reference
    public void setDocument(Object document) {
        this.technicalDoc = null;
        this.commercialDoc = null;
        this.procedure = null;
        if (document instanceof TechnicalDoc) this.technicalDoc = (TechnicalDoc) document;
        else if (document instanceof CommercialDoc) this.commercialDoc = (CommercialDoc) document;
        else if (document instanceof Procedure) this.procedure = (Procedure) document;
    }

    public Object getDocument() {
        if (technicalDoc != null) return technicalDoc;
        if (commercialDoc != null) return commercialDoc;
        if (procedure != null) return procedure;
        return null;
    }
}
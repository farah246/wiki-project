package org.example.infrastructure.persistence.entity;

import jakarta.persistence.*;
import org.example.infrastructure.persistence.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "technical_docs")
public class TechnicalDoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String codeSnippet;

    private String gitRef;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 🛠 No-arg constructor
    public TechnicalDoc() {}

    // 🛠 All-arg constructor (excluding id, timestamps)
    public TechnicalDoc(String title, String content, String codeSnippet, String gitRef, User user) {
        this.title = title;
        this.content = content;
        this.codeSnippet = codeSnippet;
        this.gitRef = gitRef;
        this.user = user;
    }

    // ✅ Getters & Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public String getCodeSnippet() { return codeSnippet; }

    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public String getGitRef() { return gitRef; }

    public void setGitRef(String gitRef) { this.gitRef = gitRef; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

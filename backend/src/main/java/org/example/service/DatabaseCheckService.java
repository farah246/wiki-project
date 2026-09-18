package org.example.service;

import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.infrastructure.persistence.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatabaseCheckService {
    @Autowired
    private CommercialDocRepository repo;

    @Autowired
    private DocHistoryRepository repo2;

    @Autowired
    private EmbeddingRepository repo3;

    @Autowired
    private ProcedureRepository repo4;

    @Autowired
    private TechnicalDocRepository repo5;

    @Autowired
    private UserRepository repo6;


    public void checkConnections() {
        System.out.println("Commercial Docs: " + repo.findAll());
        System.out.println("Doc History: " + repo2.findAll());
        System.out.println("Embeddings: " + repo3.findAll());
        System.out.println("Procedures: " + repo4.findAll());
        System.out.println("Technical Docs: " + repo5.findAll());
        System.out.println("Users: " + repo6.findAll());
    }
}
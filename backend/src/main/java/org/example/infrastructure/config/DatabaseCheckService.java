package org.example.infrastructure.config;

import org.example.infrastructure.persistence.repository.CommercialDocRepository;
import org.example.infrastructure.persistence.repository.DocHistoryRepository;
import org.example.infrastructure.persistence.repository.EmbeddingRepository;
import org.example.infrastructure.persistence.repository.ProcedureRepository;
import org.example.infrastructure.persistence.repository.TechnicalDocRepository;
import org.example.infrastructure.persistence.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DatabaseCheckService {

    private final CommercialDocRepository commercialDocRepository;
    private final DocHistoryRepository docHistoryRepository;
    private final EmbeddingRepository embeddingRepository;
    private final ProcedureRepository procedureRepository;
    private final TechnicalDocRepository technicalDocRepository;
    private final UserRepository userRepository;

    public DatabaseCheckService(
            CommercialDocRepository commercialDocRepository,
            DocHistoryRepository docHistoryRepository,
            EmbeddingRepository embeddingRepository,
            ProcedureRepository procedureRepository,
            TechnicalDocRepository technicalDocRepository,
            UserRepository userRepository
    ) {
        this.commercialDocRepository = commercialDocRepository;
        this.docHistoryRepository = docHistoryRepository;
        this.embeddingRepository = embeddingRepository;
        this.procedureRepository = procedureRepository;
        this.technicalDocRepository = technicalDocRepository;
        this.userRepository = userRepository;
    }

    public void checkConnections() {
        System.out.println("Commercial Docs: " + commercialDocRepository.findAll());
        System.out.println("Doc History: " + docHistoryRepository.findAll());
        System.out.println("Embeddings: " + embeddingRepository.findAll());
        System.out.println("Procedures: " + procedureRepository.findAll());
        System.out.println("Technical Docs: " + technicalDocRepository.findAll());
        System.out.println("Users: " + userRepository.findAll());
    }
}
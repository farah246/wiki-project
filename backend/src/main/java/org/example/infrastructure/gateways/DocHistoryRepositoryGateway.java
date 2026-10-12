package org.example.infrastructure.gateways;

import org.example.application.gateway.DocHistoryGateway;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.DocHistoryModel;
import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.infrastructure.persistence.mapper.DocHistoryEntityMapper;
import org.example.infrastructure.persistence.repository.DocHistoryRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class DocHistoryRepositoryGateway implements DocHistoryGateway {

    private final DocHistoryRepository docHistoryRepository;
    private final DocHistoryEntityMapper docHistoryMapper;

    public DocHistoryRepositoryGateway(
            DocHistoryRepository docHistoryRepository,
            DocHistoryEntityMapper docHistoryMapper
    ) {
        this.docHistoryRepository = docHistoryRepository;
        this.docHistoryMapper = docHistoryMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocHistoryModel> findAll() {
        return docHistoryRepository.findAll()
                .stream()
                .map(docHistoryMapper::toDomain)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocHistoryModel> findById(Long id) {
        return docHistoryRepository.findById(id)
                .map(docHistoryMapper::toDomain);
    }

    @Override
    public DocHistoryModel save(DocHistoryModel history) {
        DocHistory entity = docHistoryMapper.toEntity(history);
        DocHistory saved = docHistoryRepository.save(entity);

        return docHistoryMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        docHistoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocHistoryModel> findByDocument(
            DocumentType type,
            Long docId
    ) {
        List<DocHistory> rows = switch (type) {
            case TECHNICAL_DOC ->
                    docHistoryRepository
                            .findByTechnicalDocIdOrderByCreatedAtDescIdDesc(docId);
            case COMMERCIAL_DOC ->
                    docHistoryRepository
                            .findByCommercialDocIdOrderByCreatedAtDescIdDesc(docId);
            case PROCEDURE ->
                    docHistoryRepository
                            .findByProcedureIdOrderByCreatedAtDescIdDesc(docId);
        };

        return rows.stream()
                .map(docHistoryMapper::toDomain)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public int latestVersionByDocument(DocumentType type, Long docId) {
        return switch (type) {
            case TECHNICAL_DOC -> docHistoryRepository.findLatestVersionByTechnicalDocId(docId);
            case COMMERCIAL_DOC -> docHistoryRepository.findLatestVersionByCommercialDocId(docId);
            case PROCEDURE -> docHistoryRepository.findLatestVersionByProcedureId(docId);
        };
    }

    @Override
    @Transactional
    public void detachDocument(DocumentType type, Long docId) {
        switch (type) {
            case TECHNICAL_DOC -> docHistoryRepository.detachTechnicalDoc(docId);
            case COMMERCIAL_DOC -> docHistoryRepository.detachCommercialDoc(docId);
            case PROCEDURE -> docHistoryRepository.detachProcedure(docId);
        }
    }
}
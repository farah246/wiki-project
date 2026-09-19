package org.example.infrastructure.gateways;

import org.example.application.gateway.DocHistoryGateway;
import org.example.domain.model.DocHistoryModel;
import org.example.infrastructure.persistence.entity.DocHistory;
import org.example.infrastructure.persistence.mapper.DocHistoryEntityMapper;
import org.example.infrastructure.persistence.repository.DocHistoryRepository;
import org.springframework.stereotype.Component;

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
    public List<DocHistoryModel> findAll() {
        return docHistoryRepository.findAll()
                .stream()
                .map(docHistoryMapper::toDomain)
                .toList();
    }

    @Override
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
}
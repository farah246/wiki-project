package org.example.infrastructure.gateways;

import org.example.application.gateway.TechnicalDocGateway;
import org.example.domain.model.TechnicalDocModel;
import org.example.infrastructure.persistence.entity.TechnicalDoc;
import org.example.infrastructure.persistence.mapper.TechnicalDocEntityMapper;
import org.example.infrastructure.persistence.repository.TechnicalDocRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TechnicalDocRepositoryGateway implements TechnicalDocGateway {

    private final TechnicalDocRepository technicalDocRepository;
    private final TechnicalDocEntityMapper technicalDocMapper;

    public TechnicalDocRepositoryGateway(
            TechnicalDocRepository technicalDocRepository,
            TechnicalDocEntityMapper technicalDocMapper
    ) {
        this.technicalDocRepository = technicalDocRepository;
        this.technicalDocMapper = technicalDocMapper;
    }

    @Override
    public List<TechnicalDocModel> findAll() {
        return technicalDocRepository.findAll()
                .stream()
                .map(technicalDocMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<TechnicalDocModel> findById(Long id) {
        return technicalDocRepository.findById(id)
                .map(technicalDocMapper::toDomain);
    }

    @Override
    public TechnicalDocModel save(TechnicalDocModel technicalDoc) {
        TechnicalDoc entity = technicalDocMapper.toEntity(technicalDoc);
        TechnicalDoc saved = technicalDocRepository.save(entity);

        return technicalDocMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        technicalDocRepository.deleteById(id);
    }
}
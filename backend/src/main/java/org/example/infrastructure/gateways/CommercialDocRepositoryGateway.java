package org.example.infrastructure.gateways;

import org.example.application.gateway.CommercialDocGateway;
import org.example.domain.model.CommercialDocModel;
import org.example.infrastructure.persistence.entity.CommercialDoc;
import org.example.infrastructure.persistence.mapper.CommercialDocEntityMapper;
import org.example.infrastructure.persistence.repository.CommercialDocRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CommercialDocRepositoryGateway implements CommercialDocGateway {

    private final CommercialDocRepository commercialDocRepository;
    private final CommercialDocEntityMapper commercialDocMapper;

    public CommercialDocRepositoryGateway(
            CommercialDocRepository commercialDocRepository,
            CommercialDocEntityMapper commercialDocMapper
    ) {
        this.commercialDocRepository = commercialDocRepository;
        this.commercialDocMapper = commercialDocMapper;
    }

    @Override
    public List<CommercialDocModel> findAll() {
        return commercialDocRepository.findAll()
                .stream()
                .map(commercialDocMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<CommercialDocModel> findById(Long id) {
        return commercialDocRepository.findById(id)
                .map(commercialDocMapper::toDomain);
    }

    @Override
    public CommercialDocModel save(CommercialDocModel doc) {
        CommercialDoc entity = commercialDocMapper.toEntity(doc);
        CommercialDoc saved = commercialDocRepository.save(entity);

        return commercialDocMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        commercialDocRepository.deleteById(id);
    }
}
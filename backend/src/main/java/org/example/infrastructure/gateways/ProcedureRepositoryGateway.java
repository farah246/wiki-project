package org.example.infrastructure.gateways;

import org.example.application.gateway.ProcedureGateway;
import org.example.domain.model.ProcedureModel;
import org.example.infrastructure.persistence.entity.Procedure;
import org.example.infrastructure.persistence.mapper.ProcedureEntityMapper;
import org.example.infrastructure.persistence.repository.ProcedureRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ProcedureRepositoryGateway implements ProcedureGateway {

    private final ProcedureRepository procedureRepository;
    private final ProcedureEntityMapper procedureMapper;

    public ProcedureRepositoryGateway(
            ProcedureRepository procedureRepository,
            ProcedureEntityMapper procedureMapper
    ) {
        this.procedureRepository = procedureRepository;
        this.procedureMapper = procedureMapper;
    }

    @Override
    public List<ProcedureModel> findAll() {
        return procedureRepository.findAll()
                .stream()
                .map(procedureMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<ProcedureModel> findById(Long id) {
        return procedureRepository.findById(id)
                .map(procedureMapper::toDomain);
    }

    @Override
    public ProcedureModel save(ProcedureModel procedure) {
        Procedure entity = procedureMapper.toEntity(procedure);
        Procedure saved = procedureRepository.save(entity);

        return procedureMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        procedureRepository.deleteById(id);
    }
}
package org.example.infrastructure.gateways;

import org.example.application.gateway.FavoriteGateway;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.FavoriteModel;
import org.example.infrastructure.persistence.entity.Favorite;
import org.example.infrastructure.persistence.repository.FavoriteRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class FavoriteRepositoryGateway implements FavoriteGateway {

    private final FavoriteRepository favoriteRepository;

    public FavoriteRepositoryGateway(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public List<FavoriteModel> findByUserId(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(favorite -> new FavoriteModel(
                        favorite.getDocType(),
                        favorite.getDocId(),
                        favorite.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public boolean exists(Long userId, DocumentType docType, Long docId) {
        return favoriteRepository
                .existsByUserIdAndDocTypeAndDocId(userId, docType, docId);
    }

    @Override
    public void save(Long userId, DocumentType docType, Long docId) {
        favoriteRepository.save(new Favorite(userId, docType, docId));
    }

    // derived delete queries need a transaction

    @Override
    @Transactional
    public void delete(Long userId, DocumentType docType, Long docId) {
        favoriteRepository
                .deleteByUserIdAndDocTypeAndDocId(userId, docType, docId);
    }

    @Override
    @Transactional
    public void deleteAllForDocument(DocumentType docType, Long docId) {
        favoriteRepository.deleteByDocTypeAndDocId(docType, docId);
    }
}
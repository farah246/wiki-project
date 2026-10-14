package org.example.interfaces.controller;

import org.example.application.service.FavoriteService;
import org.example.domain.enums.DocumentType;
import org.example.domain.model.FavoriteModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Every role can read every document, so every role can star them.
// {type} is a DocumentType name: TECHNICAL_DOC, COMMERCIAL_DOC or PROCEDURE.
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public List<FavoriteModel> getAll(Authentication authentication) {
        return favoriteService.getFavorites(authentication);
    }

    @PutMapping("/{type}/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public void add(
            @PathVariable DocumentType type,
            @PathVariable Long id,
            Authentication authentication
    ) {
        favoriteService.addFavorite(authentication, type, id);
    }

    @DeleteMapping("/{type}/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'SALES', 'MANAGER', 'ADMIN')")
    public void remove(
            @PathVariable DocumentType type,
            @PathVariable Long id,
            Authentication authentication
    ) {
        favoriteService.removeFavorite(authentication, type, id);
    }
}
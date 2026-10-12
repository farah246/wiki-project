package org.example.application.service;

import org.example.domain.enums.UserRole;
import org.example.domain.model.UserModel;
import org.example.infrastructure.security.ClerkService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class CurrentUserService {

    private static final String ROLE_PREFIX = "ROLE_";

    private final UserService userService;
    private final ClerkService clerkService;

    public CurrentUserService(
            UserService userService,
            ClerkService clerkService
    ) {
        this.userService = userService;
        this.clerkService = clerkService;
    }

    public UserModel getCurrentUser(Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();

        String clerkUserId = jwt.getSubject();

        // Clerk is the source of truth for the role: the DB copy is
        // refreshed whenever it differs from the role in the token.
        String role = extractRole(authentication);

        return userService.getByClerkUserId(clerkUserId)
                .map(existing -> role.equals(existing.role())
                        ? existing
                        : userService.updateRole(existing.id(), role))
                .orElseGet(() -> createUserFromClerk(clerkUserId, role));
    }

    // The authorities were built by ClerkJwtAuthenticationConverter, so this
    // reuses the same role the @PreAuthorize checks see.
    private String extractRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith(ROLE_PREFIX))
                .map(authority -> authority.substring(ROLE_PREFIX.length()))
                .filter(this::isKnownRole)
                .findFirst()
                .orElseThrow(() ->
                        new AccessDeniedException("No valid role assigned"));
    }

    private boolean isKnownRole(String role) {
        return Arrays.stream(UserRole.values())
                .anyMatch(known -> known.name().equals(role));
    }

    private UserModel createUserFromClerk(
            String clerkUserId,
            String role
    ) {

        ClerkService.ClerkUserProfile clerkUser =
                clerkService.getUser(clerkUserId);

        UserModel user = new UserModel(
                null,
                clerkUser.id(),
                clerkUser.username(),
                clerkUser.email(),
                role,
                null,
                null
        );

        return userService.saveUser(user);
    }
}
package org.example.application.service;

import org.example.domain.enums.UserRole;
import org.example.domain.model.UserModel;
import org.example.infrastructure.security.ClerkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class CurrentUserService {

    private static final Logger log =
            LoggerFactory.getLogger(CurrentUserService.class);

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

    // Same as getCurrentUser, and also brings the username up to date with
    // Clerk. Used where the name is shown (/api/users/me); writes keep
    // using getCurrentUser and never wait for Clerk.
    public UserModel getCurrentUserWithFreshProfile(
            Authentication authentication
    ) {
        return refreshUsername(getCurrentUser(authentication));
    }

    private UserModel refreshUsername(UserModel user) {
        try {
            ClerkService.ClerkUserProfile profile =
                    clerkService.getUser(user.clerkUserId());

            String username = profile.username();

            // no username in Clerk, or nothing changed: keep what we have
            if (username == null || username.equals(user.username())) {
                return user;
            }

            return userService.updateUsername(user.id(), username);
        } catch (RuntimeException e) {
            // Clerk unreachable or name already taken by another row:
            // keep the stored name, the next call will try again
            log.warn("Could not refresh the username of user {}",
                    user.id(), e);

            return user;
        }
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
package org.example.application.service;

import org.example.domain.model.UserModel;
import org.example.infrastructure.security.ClerkService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

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

        return userService.getByClerkUserId(clerkUserId)
                .orElseGet(() -> createUserFromClerk(clerkUserId, jwt));
    }

    private UserModel createUserFromClerk(
            String clerkUserId,
            Jwt jwt
    ) {

        ClerkService.ClerkUserProfile clerkUser =
                clerkService.getUser(clerkUserId);

        String role = jwt.getClaimAsString("metadata.role");


        if (role == null || role.isBlank()) {
            role = "DEVELOPER";
        } else {
            role = role.toUpperCase();
        }



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

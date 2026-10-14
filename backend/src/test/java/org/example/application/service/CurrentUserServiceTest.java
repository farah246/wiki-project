package org.example.application.service;

import org.example.domain.model.UserModel;
import org.example.infrastructure.security.ClerkService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurrentUserServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private ClerkService clerkService;

    @InjectMocks
    private CurrentUserService currentUserService;

    private Authentication authenticationWith(String... authorities) {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user_1")
                .build();

        return new JwtAuthenticationToken(
                jwt,
                java.util.Arrays.stream(authorities)
                        .map(SimpleGrantedAuthority::new)
                        .toList()
        );
    }

    private UserModel userWithRole(String role) {
        return new UserModel(
                1L, "user_1", "farah", "farah@example.com",
                role, null, null);
    }

    @Test
    void existingUserWithSameRole_isReturnedUnchanged() {
        UserModel existing = userWithRole("MANAGER");
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));

        UserModel result = currentUserService.getCurrentUser(
                authenticationWith("ROLE_MANAGER"));

        assertSame(existing, result);
        verify(userService, never()).updateRole(any(), any());
    }

    @Test
    void existingUserWithStaleRole_isUpdatedFromTheToken() {
        UserModel existing = userWithRole("DEVELOPER");
        UserModel updated = userWithRole("MANAGER");
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));
        when(userService.updateRole(1L, "MANAGER")).thenReturn(updated);

        UserModel result = currentUserService.getCurrentUser(
                authenticationWith("ROLE_MANAGER"));

        assertSame(updated, result);
    }

    @Test
    void newUser_isCreatedWithTheRoleFromTheToken() {
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.empty());
        when(clerkService.getUser("user_1")).thenReturn(
                new ClerkService.ClerkUserProfile(
                        "user_1", "farah", "farah@example.com"));
        when(userService.saveUser(any(UserModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        currentUserService.getCurrentUser(authenticationWith("ROLE_SALES"));

        ArgumentCaptor<UserModel> captor =
                ArgumentCaptor.forClass(UserModel.class);
        verify(userService).saveUser(captor.capture());
        assertEquals("SALES", captor.getValue().role());
        assertNull(captor.getValue().id());
    }

    @Test
    void noRole_isRejected_insteadOfDefaultingToDeveloper() {
        assertThrows(AccessDeniedException.class, () ->
                currentUserService.getCurrentUser(authenticationWith()));

        verifyNoInteractions(userService);
    }

    @Test
    void unknownRole_isRejected() {
        assertThrows(AccessDeniedException.class, () ->
                currentUserService.getCurrentUser(
                        authenticationWith("ROLE_MODERATOR")));
    }

    // ---- username kept in sync with Clerk ----

    private ClerkService.ClerkUserProfile clerkProfile(String username) {
        return new ClerkService.ClerkUserProfile(
                "user_1", username, "farah@example.com");
    }

    @Test
    void freshProfile_usernameChangedInClerk_isUpdatedInTheDatabase() {
        UserModel existing = userWithRole("ADMIN");
        UserModel renamed = new UserModel(
                1L, "user_1", "farah-panda", "farah@example.com",
                "ADMIN", null, null);
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));
        when(clerkService.getUser("user_1"))
                .thenReturn(clerkProfile("farah-panda"));
        when(userService.updateUsername(1L, "farah-panda"))
                .thenReturn(renamed);

        UserModel result = currentUserService.getCurrentUserWithFreshProfile(
                authenticationWith("ROLE_ADMIN"));

        assertSame(renamed, result);
    }

    @Test
    void freshProfile_sameUsername_changesNothing() {
        UserModel existing = userWithRole("ADMIN");
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));
        when(clerkService.getUser("user_1")).thenReturn(clerkProfile("farah"));

        UserModel result = currentUserService.getCurrentUserWithFreshProfile(
                authenticationWith("ROLE_ADMIN"));

        assertSame(existing, result);
        verify(userService, never()).updateUsername(any(), any());
    }

    // Replaces the old "only once per interval" test: there is no timer
    // anymore, so Clerk is asked on every call and a rename shows up on the
    // very next one.
    @Test
    void freshProfile_asksClerkOnEveryCall_soARenameShowsUpImmediately() {
        UserModel existing = userWithRole("ADMIN");
        UserModel renamed = new UserModel(
                1L, "user_1", "farah-panda", "farah@example.com",
                "ADMIN", null, null);
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));
        when(clerkService.getUser("user_1"))
                .thenReturn(clerkProfile("farah"))
                .thenReturn(clerkProfile("farah-panda"));
        when(userService.updateUsername(1L, "farah-panda"))
                .thenReturn(renamed);

        UserModel first = currentUserService.getCurrentUserWithFreshProfile(
                authenticationWith("ROLE_ADMIN"));
        UserModel second = currentUserService.getCurrentUserWithFreshProfile(
                authenticationWith("ROLE_ADMIN"));

        assertSame(existing, first);
        assertSame(renamed, second);
        verify(clerkService, times(2)).getUser("user_1");
    }

    @Test
    void freshProfile_clerkUnavailable_keepsTheStoredUsername() {
        UserModel existing = userWithRole("ADMIN");
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));
        when(clerkService.getUser("user_1"))
                .thenThrow(new RuntimeException("Clerk is down"));

        UserModel result = currentUserService.getCurrentUserWithFreshProfile(
                authenticationWith("ROLE_ADMIN"));

        assertSame(existing, result);
        verify(userService, never()).updateUsername(any(), any());
    }

    @Test
    void freshProfile_noUsernameInClerk_keepsTheStoredUsername() {
        UserModel existing = userWithRole("ADMIN");
        when(userService.getByClerkUserId("user_1"))
                .thenReturn(Optional.of(existing));
        when(clerkService.getUser("user_1")).thenReturn(clerkProfile(null));

        UserModel result = currentUserService.getCurrentUserWithFreshProfile(
                authenticationWith("ROLE_ADMIN"));

        assertSame(existing, result);
        verify(userService, never()).updateUsername(any(), any());
    }
}
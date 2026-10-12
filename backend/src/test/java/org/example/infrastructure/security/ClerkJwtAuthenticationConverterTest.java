package org.example.infrastructure.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ClerkJwtAuthenticationConverterTest {

    private final ClerkJwtAuthenticationConverter converter =
            new ClerkJwtAuthenticationConverter();

    private Jwt jwtWith(Map<String, Object> extraClaims) {
        return Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user_1")
                .claims(claims -> claims.putAll(extraClaims))
                .build();
    }

    private List<String> authoritiesOf(Jwt jwt) {
        return converter.convert(jwt).getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }

    @Test
    void roleInMetadata_becomesAnAuthority() {
        Jwt jwt = jwtWith(Map.of("metadata", Map.of("role", "DEVELOPER")));

        assertEquals(List.of("ROLE_DEVELOPER"), authoritiesOf(jwt));
    }

    @Test
    void lowercaseRole_isNormalizedToUppercase() {
        Jwt jwt = jwtWith(Map.of("metadata", Map.of("role", "admin")));

        assertEquals(List.of("ROLE_ADMIN"), authoritiesOf(jwt));
    }

    @Test
    void missingMetadata_givesNoAuthorities() {
        assertTrue(authoritiesOf(jwtWith(Map.of())).isEmpty());
    }

    @Test
    void metadataWithoutRole_givesNoAuthorities() {
        Jwt jwt = jwtWith(Map.of("metadata", Map.of("other", "value")));

        assertTrue(authoritiesOf(jwt).isEmpty());
    }

    @Test
    void blankRole_givesNoAuthorities() {
        Jwt jwt = jwtWith(Map.of("metadata", Map.of("role", "  ")));

        assertTrue(authoritiesOf(jwt).isEmpty());
    }
}
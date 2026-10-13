package org.example.infrastructure.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthorizedPartyValidatorTest {

    private final AuthorizedPartyValidator validator =
            new AuthorizedPartyValidator(Set.of("http://localhost:3000"));

    private Jwt jwtWith(Map<String, Object> extraClaims) {
        return Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user_1")
                .claims(claims -> claims.putAll(extraClaims))
                .build();
    }

    @Test
    void allowedOrigin_isAccepted() {
        assertFalse(validator.validate(
                jwtWith(Map.of("azp", "http://localhost:3000"))).hasErrors());
    }

    @Test
    void unknownOrigin_isRejected() {
        assertTrue(validator.validate(
                jwtWith(Map.of("azp", "https://evil.example"))).hasErrors());
    }

    @Test
    void missingAzp_isAccepted() {
        assertFalse(validator.validate(jwtWith(Map.of())).hasErrors());
    }
}
package org.example.infrastructure.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Set;

/** Rejects tokens issued for a frontend origin that is not on our allow-list. */
public class AuthorizedPartyValidator implements OAuth2TokenValidator<Jwt> {

    private final Set<String> allowedOrigins;

    public AuthorizedPartyValidator(Set<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String azp = jwt.getClaimAsString("azp");

        // Browser session tokens carry azp; tokens without it are not rejected here.
        if (azp == null || allowedOrigins.contains(azp)) {
            return OAuth2TokenValidatorResult.success();
        }

        return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token",
                        "Token was issued for an unauthorized origin", null)
        );
    }
}
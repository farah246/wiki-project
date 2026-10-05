package org.example.infrastructure.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class ClerkJwtAuthenticationConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        String role = null;

        if (jwt.getClaim("metadata") instanceof java.util.Map<?, ?> metadata) {
            Object roleValue = metadata.get("role");

            if (roleValue != null) {
                role = roleValue.toString();
            }
        }

        if (role == null || role.isBlank()) {
            return new JwtAuthenticationToken(
                    jwt,
                    Collections.emptyList()
            );
        }

        String authority = "ROLE_" + role.toUpperCase();

        return new JwtAuthenticationToken(
                jwt,
                Collections.singletonList(
                        new SimpleGrantedAuthority(authority)
                )
        );
    }
}
package org.example.interfaces.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/debug")
public class DebugSecurityController {

    @GetMapping("/me")
    public SecurityInfo me(Authentication authentication) {

        List<String> authorities = authentication.getAuthorities()
                .stream()
                .map(Object::toString)
                .toList();

        return new SecurityInfo(
                authentication.getName(),
                authorities
        );
    }

    public record SecurityInfo(
            String username,
            List<String> authorities
    ) {
    }
}
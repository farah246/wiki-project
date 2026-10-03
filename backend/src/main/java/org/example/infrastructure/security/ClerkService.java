package org.example.infrastructure.security;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ClerkService {

    private final RestClient restClient;

    public ClerkService(
            @Value("${clerk.secret-key}") String secretKey,
            RestClient.Builder restClientBuilder
    ) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.clerk.com/v1")
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + secretKey
                )
                .build();
    }

    public ClerkUserProfile getUser(String clerkUserId) {

        JsonNode user = restClient.get()
                .uri("/users/{userId}", clerkUserId)
                .retrieve()
                .body(JsonNode.class);

        String id = user.path("id").asText();

        String username = user.path("username").isNull()
                ? null
                : user.path("username").asText(null);

        String primaryEmailId = user.path("primary_email_address_id")
                .asText(null);

        String email = null;

        for (JsonNode emailNode : user.path("email_addresses")) {

            String emailId = emailNode.path("id").asText();

            if (emailId.equals(primaryEmailId)) {
                email = emailNode.path("email_address").asText(null);
                break;
            }
        }

        return new ClerkUserProfile(
                id,
                username,
                email
        );
    }

    public record ClerkUserProfile(
            String id,
            String username,
            String email
    ) {
    }
}

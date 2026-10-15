package org.example.infrastructure.llm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.application.exception.LlmUnavailableException;
import org.example.application.gateway.LlmGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.Map;

// Talks to any "OpenAI-compatible" /chat/completions endpoint. Default: the
// Hugging Face router (same HF_API_TOKEN as before). To use another provider,
// change llm.api.url / llm.api.key / llm.model: no code change.
@Component
public class ChatCompletionsGateway implements LlmGateway {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;
    private final String model;
    private final int maxTokens;

    public ChatCompletionsGateway(
            @Value("${llm.api.url}") String apiUrl,
            @Value("${llm.api.key:}") String apiKey,
            @Value("${llm.model}") String model,
            @Value("${llm.max-tokens:700}") int maxTokens
    ) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(60));
        this.restTemplate = new RestTemplate(factory);
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
    }

    @Override
    public String complete(String systemPrompt, String userMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        if (apiKey != null && !apiKey.isBlank()) {
            headers.setBearerAuth(apiKey);
        }

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMessage)),
                "temperature", 0.2,   // low: we want faithful answers, not creative ones
                "max_tokens", maxTokens,
                "stream", false);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    apiUrl,
                    new HttpEntity<>(objectMapper.writeValueAsString(body), headers),
                    String.class);

            JsonNode content = objectMapper.readTree(response.getBody())
                    .path("choices").path(0).path("message").path("content");

            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new LlmUnavailableException("The LLM returned an empty answer", null);
            }
            return content.asText();

        } catch (RestClientException | JsonProcessingException e) {
            // includes 401/403 (bad token or missing permission), 404 (model not served), 429 (quota)
            throw new LlmUnavailableException("LLM call failed: " + e.getMessage(), e);
        }
    }
}
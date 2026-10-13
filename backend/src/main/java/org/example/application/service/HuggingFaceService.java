package org.example.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.application.exception.EmbeddingUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.util.List;
import java.util.Map;
import org.springframework.web.client.RestClientException;
@Service
public class HuggingFaceService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = createRestTemplate();

    private static RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(2));
        factory.setReadTimeout(Duration.ofSeconds(15));
        return new RestTemplate(factory);
    }
    // Use a valid model that supports feature extraction via API
    @Value("${embedding.api.url:https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5}")
    private String apiUrl;

    @Value("${huggingface.api.token:}")
    private String HF_API_TOKEN;

    public double[] getEmbedding(String inputText) {
        HttpHeaders headers = new HttpHeaders();
        if (HF_API_TOKEN != null && !HF_API_TOKEN.isBlank()) {
            headers.set("Authorization", "Bearer " + HF_API_TOKEN);
        }
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        try {
            // Build the request body as a Java object
            // instead of manually constructing JSON
            Map<String, Object> requestBody = Map.of(
                    "inputs", List.of(inputText)
            );

            // ObjectMapper handles quotes, newlines, backslashes, etc.
            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(apiUrl, request, String.class);


            // Parse the first vector
            List<List<Double>> result =
                    objectMapper.readValue(response.getBody(), List.class);

            List<Double> vector = result.get(0);

            // Convert to double[]
            double[] embedding = new double[vector.size()];

            for (int i = 0; i < vector.size(); i++) {
                embedding[i] = vector.get(i);
            }

            return embedding;

        }catch (RestClientException e) {                      // new: HTTP errors, 402, timeouts, connection refused
            throw new EmbeddingUnavailableException(
                    "Embedding service unavailable: " + e.getMessage(), e
            );
        }catch (Exception e) {
            throw new RuntimeException(
                    "Embedding extraction failed: " + e.getMessage(), e
            );
        }
    }
}
package org.example.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Use a valid model that supports feature extraction via API
    private final String apiUrl = "https://api-inference.huggingface.co/models/thenlper/gte-small";

    @Value("${huggingface.api.token}")
    private String HF_API_TOKEN;

    public double[] getEmbedding(String inputText) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + HF_API_TOKEN);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Must be array of strings!
        String jsonBody = "{ \"inputs\": [\"" + inputText + "\"] }";
        HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            // Print JSON response (optional debug)
            System.out.println("Embedding JSON: " + response.getBody());

            // Parse the first vector
            List<List<Double>> result = objectMapper.readValue(response.getBody(), List.class);
            List<Double> vector = result.get(0);

            // Convert to double[]
            double[] embedding = new double[vector.size()];
            for (int i = 0; i < vector.size(); i++) {
                embedding[i] = vector.get(i);
            }
            return embedding;

        } catch (Exception e) {
            throw new RuntimeException("Embedding extraction failed: " + e.getMessage(), e);
        }
    }
}

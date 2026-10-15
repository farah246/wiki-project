package org.example.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.application.exception.EmbeddingUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceService {

    private static final int BATCH_SIZE = 32; // TEI's default max client batch size
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = createRestTemplate();

    @Value("${embedding.api.url:https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5}")
    private String apiUrl;

    @Value("${huggingface.api.token:}")
    private String HF_API_TOKEN;

    @Value("${embedding.api.batch-size:4}")
    private int batchSize;

    private static RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(2));
        factory.setReadTimeout(Duration.ofSeconds(30)); // Increased read timeout to 30 seconds
        return new RestTemplate(factory);
    }

    public double[] getEmbedding(String inputText) {
        return callApi(List.of(inputText)).get(0);
    }

    public List<double[]> getEmbeddings(List<String> inputs) {
        List<double[]> all = new ArrayList<>();
        for (int i = 0; i < inputs.size(); i += batchSize) {
            all.addAll(callApi(inputs.subList(i, Math.min(i + batchSize, inputs.size()))));
        }
        return all;
    }

    private List<double[]> callApi(List<String> batch) {
        HttpHeaders headers = new HttpHeaders();
        if (HF_API_TOKEN != null && !HF_API_TOKEN.isBlank()) {
            headers.set("Authorization", "Bearer " + HF_API_TOKEN);
        }
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        try {
            String jsonBody = objectMapper.writeValueAsString(Map.of("inputs", batch));
            ResponseEntity<String> response =
                    restTemplate.postForEntity(apiUrl, new HttpEntity<>(jsonBody, headers), String.class);

            List<List<Double>> result = objectMapper.readValue(
                    response.getBody(), new TypeReference<List<List<Double>>>() {});

            if (result.size() != batch.size()) {
                throw new IllegalStateException(
                        "Expected " + batch.size() + " vectors, got " + result.size());
            }

            List<double[]> vectors = new ArrayList<>(result.size());
            for (List<Double> v : result) {
                double[] arr = new double[v.size()];
                for (int i = 0; i < arr.length; i++) arr[i] = v.get(i);
                vectors.add(arr);
            }
            return vectors;

        } catch (RestClientException e) {
            throw new EmbeddingUnavailableException("Embedding service unavailable: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Embedding extraction failed: " + e.getMessage(), e);
        }
    }
}
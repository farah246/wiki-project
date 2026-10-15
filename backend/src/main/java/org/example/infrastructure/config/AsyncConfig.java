package org.example.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    // One thread on purpose: two quick edits of the same document can't interleave
    @Bean(name = "indexingExecutor")
    public Executor indexingExecutor() {
        ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(1);
        ex.setMaxPoolSize(1);
        ex.setQueueCapacity(500);
        ex.setThreadNamePrefix("indexing-");
        return ex;
    }
}
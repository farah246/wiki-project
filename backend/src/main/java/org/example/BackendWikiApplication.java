package org.example;

import io.github.cdimascio.dotenv.Dotenv;
import org.example.application.service.DatabaseCheckService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class BackendWikiApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        ApplicationContext context =
                SpringApplication.run(BackendWikiApplication.class, args);

        DatabaseCheckService service =
                context.getBean(DatabaseCheckService.class);

        service.checkConnections();
    }
}
package org.example.application.gateway;
import java.util.function.Consumer;

// The only thing the RAG code knows about the LLM: "give a system prompt and a
// user message, get text back". Hugging Face, Groq, Bedrock... are
// implementations of this interface, so switching provider never touches AskService.
public interface LlmGateway {

    String complete(String systemPrompt, String userMessage);
    String stream(String systemPrompt, String userMessage, Consumer<String> onToken);
}
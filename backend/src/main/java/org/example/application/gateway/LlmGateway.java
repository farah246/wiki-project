package org.example.application.gateway;

// The only thing the RAG code knows about the LLM: "give a system prompt and a
// user message, get text back". Hugging Face, Groq, Bedrock... are
// implementations of this interface, so switching provider never touches AskService.
public interface LlmGateway {

    String complete(String systemPrompt, String userMessage);
}
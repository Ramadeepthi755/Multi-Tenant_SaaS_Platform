package com.workforce.hrm.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AiProviderFactory {

    private static final Logger log = LoggerFactory.getLogger(AiProviderFactory.class);

    @Value("${app.ai.provider:openai}")
    private String configuredProvider;

    private final OpenAiProvider openAiProvider;
    private final GeminiAiProvider geminiAiProvider;
    private final AnthropicAiProvider anthropicAiProvider;
    private final DeterministicFallbackAiProvider fallbackAiProvider;

    @Autowired
    public AiProviderFactory(
            OpenAiProvider openAiProvider,
            GeminiAiProvider geminiAiProvider,
            AnthropicAiProvider anthropicAiProvider,
            DeterministicFallbackAiProvider fallbackAiProvider) {
        this.openAiProvider = openAiProvider;
        this.geminiAiProvider = geminiAiProvider;
        this.anthropicAiProvider = anthropicAiProvider;
        this.fallbackAiProvider = fallbackAiProvider;
    }

    public AiProvider getActiveProvider() {
        String provider = configuredProvider != null ? configuredProvider.trim().toLowerCase() : "fallback";

        if ("openai".equals(provider)) {
            if (openAiProvider.isAvailable()) {
                return openAiProvider;
            }
            log.warn("OpenAI requested but API key is missing. Falling back to analytical engine.");
        } else if ("gemini".equals(provider)) {
            if (geminiAiProvider.isAvailable()) {
                return geminiAiProvider;
            }
            log.warn("Gemini requested but API key is missing. Falling back to analytical engine.");
        } else if ("anthropic".equals(provider)) {
            if (anthropicAiProvider.isAvailable()) {
                return anthropicAiProvider;
            }
            log.warn("Anthropic requested but API key is missing. Falling back to analytical engine.");
        }

        return fallbackAiProvider;
    }
}

---
name: Hivemind AI chat provider
description: How the AI assistant backend is wired to OpenRouter and why a multi-model fallback chain exists
---

The `/api/ai/chat` route (`artifacts/api-server/src/routes/ai.ts`) calls OpenRouter (OpenAI-compatible API, `baseURL: https://openrouter.ai/api/v1`) using `OPENROUTER_API_KEY`, not OpenAI directly — the project has no OpenAI billing configured.

It tries a list of free-tier models (`AI_MODELS` array) in order, not a single hardcoded model.

**Why:** free OpenRouter models get transiently rate-limited (429) by their upstream hosting provider (e.g. "Venice") under normal, low load — this is expected/routine, not a misconfiguration. A single-model setup would flip to the rule-based fallback ("Offline"/"Smart Fallback" in the UI) far too often.

**How to apply:** if the assistant seems to be hitting the built-in fallback a lot, check logs for 429s from a specific model first — the fix is usually to add another good free model to `AI_MODELS`, not to touch the API key or auth logic. Only 401/auth-type errors indicate a real key problem. Verify current free models via `curl https://openrouter.ai/api/v1/models` before naming one — the available free list changes over time.

---
title: How to Build an AI Agent with Claude (Lessons from a Production Legal Pipeline)
description: A practical guide to building an AI agent with Claude — from a minimal tool-using loop to the multi-agent architecture running FASL, a production legal AI drafting Moroccan appeal memos.
date: 2026-07-13
keywords: how to build an ai agent with claude, build ai agent from scratch, claude tool use, multi-agent pipeline, llm agents
related: fasl, reso-khdma
---

Every "how to build an AI agent" tutorial ends where the real problems begin: a weather-lookup demo that works once, on a sunny day. I run a production multi-agent system — [FASL](/work/fasl), which drafts legal appeal memos for Moroccan lawyers, in Arabic, with real money and real consequences attached. This is the guide I wish I'd had: the minimal agent first, then the parts that actually break in production.

## What an agent actually is

Strip away the hype and an agent is a loop with three parts:

- **A model** that decides what to do next.
- **Tools** the model can call — functions you wrote, described well enough that the model knows when to use them.
- **State** — the conversation history that accumulates tool results so the model can build on what it learned.

The model proposes a tool call, your code executes it, the result goes back into the conversation, and the loop continues until the model decides it's done. That's the whole trick. Everything else — planning, memory, multi-agent orchestration — is engineering around that loop.

## The minimal Claude agent

The Anthropic SDK ships a tool runner that handles the loop for you. Define tools with a schema and a `run` function; the SDK calls the API, executes your functions, feeds results back, and repeats until Claude stops calling tools:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const client = new Anthropic();

const searchLegalCodes = betaZodTool({
  name: "search_legal_codes",
  description:
    "Search Moroccan legal codes for articles relevant to a legal question. " +
    "Call this before drafting any legal argument — never cite law from memory.",
  inputSchema: z.object({
    query: z.string().describe("The legal question, in Arabic or French"),
  }),
  run: async ({ query }) => JSON.stringify(await vectorSearch(query)),
});

const finalMessage = await client.beta.messages.toolRunner({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  thinking: { type: "adaptive" },
  tools: [searchLegalCodes],
  messages: [
    { role: "user", content: "ما هي شروط الطعن بالاستئناف في القضايا المدنية؟" },
  ],
});
```

Two details matter more than they look:

- **The description is the interface.** Claude decides *when* to call your tool from its description alone. "Search legal codes" is weak; "call this before drafting any legal argument — never cite law from memory" changes the model's behavior. Be prescriptive about when, not just what.
- **Adaptive thinking is worth it.** `thinking: { type: "adaptive" }` lets the model reason between tool calls. For anything multi-step, the quality difference is not subtle.

That's a working agent in ~30 lines. Now the parts the tutorials skip.

## Lesson 1: One agent doing four jobs beats four prompts in a trench coat — until it doesn't

FASL started as a single agent with a long system prompt: analyze the case, find the law, draft the memo, review it. It worked in demos and fell apart on real cases — the drafting quality degraded as the context filled with retrieval noise, and a mistake in analysis silently poisoned everything downstream.

The fix was splitting the loop into a **pipeline of specialized agents**, each with one job and a clean context:

1. **Case analysis** — reads the case file, extracts the legal issues at stake.
2. **Retrieval** — RAG over Moroccan legal codes, surfacing the articles that apply.
3. **Drafting** — composes the appeal memo, grounded in the retrieved law.
4. **Review** — checks citations, structure, and legal reasoning before a human sees it.

The counterintuitive part: the win didn't come from the agents being "smarter." It came from each stage receiving *only* what it needs. The drafting agent never sees the raw case file — it sees the analysis. Context discipline is the highest-leverage design decision in a multi-agent system.

## Lesson 2: Structured outputs are the contracts between agents

When agent A hands off to agent B as free text, you've built a game of telephone. Every handoff in FASL is a **validated, typed object** — the analysis agent must produce a structured list of legal issues; the retrieval agent must return articles with source references; the drafter receives typed inputs, not prose.

Claude supports this natively with structured outputs (`output_config.format` with a JSON schema), and zod schemas double as runtime validation. If a stage produces something malformed, you find out at the boundary — not three stages later in a hallucinated citation.

## Lesson 3: Ground everything, because "mostly right" is worthless in some domains

A legal memo that cites a law that doesn't exist isn't 95% good — it's malpractice. FASL's rule: **the model never cites law from memory.** Every citation must come from the RAG pipeline over the actual legal codes, and the review stage verifies each reference resolves to a real article.

This generalizes: decide what your domain's "must never be wrong" facts are, and force them through retrieval. Let the model be creative about structure and language, never about facts you can look up.

## Lesson 4: Keep a human in the loop where mistakes are expensive

FASL doesn't send memos to court. It produces a draft inside a rich-text editor where the lawyer reviews, edits, and owns the result. That's not a limitation we tolerate — it's the design. The agent compresses hours of analysis and drafting into minutes; the professional judgment stays with the professional.

If your agent's output has consequences, design the review surface with as much care as the pipeline. A great agent with a bad review UX is an unshipped agent.

## Lesson 5: Boring engineering carries the whole thing

The unglamorous list that makes the system production-grade:

- **Retries with backoff** on API errors — the SDK's typed exceptions (`RateLimitError` vs `BadRequestError`) tell you what's retryable.
- **Idempotent stages** so a pipeline can resume from the failed step instead of restarting.
- **Logging every tool call and result** — when a lawyer reports a bad draft, you replay the exact trace.
- **Evals on real cases** — a fixed set of past cases with known-good memos, scored on every prompt change. Without this you're tuning blind.

## Where to start

Build the 30-line agent above with one tool from your own domain. Run it on ten real inputs — not demos — and watch where it fails. Those failures will tell you which of the lessons above you need first. In my experience it's almost always context discipline (lesson 1) and grounding (lesson 3) before anything else.

If you're building something in this space — especially Arabic-first or for the MENA market — [I've probably hit your problem already](/#contact).

---
title: "LLM Agent Architecture: What Actually Ships in Production"
description: The anatomy of LLM-powered autonomous agents — planning, tools, memory, and orchestration — and how single-agent, pipeline, and supervisor architectures compare, drawn from systems running in production.
date: 2026-07-13
keywords: llm agents architecture, llm powered autonomous agents, multi agents llm, llm agents framework, what are llm agents
related: fasl, reso-khdma, lakta
---

Most LLM agent architecture diagrams are drawn by people who haven't operated one. They show a tidy planner-executor-memory triangle and skip the questions that actually decide whether your system works: who owns the context window, where state lives, and what happens when step three of seven fails at 2 a.m.

I run three LLM-powered systems in production — a multi-agent legal drafting pipeline ([FASL](/work/fasl)), a WhatsApp job-matching agent ([RESO Khdma](/work/reso-khdma)), and a video-ad generation pipeline ([Lakta](/work/lakta)). This is the architecture writeup from that side of the fence.

## The anatomy of an LLM agent

Every agent, whatever the framework calls its pieces, decomposes into four concerns:

- **Decision core** — the model plus its system prompt. This is where behavior lives; everything else is plumbing to feed it good context.
- **Tools** — typed functions the model can invoke: retrieval, database queries, message sending, code execution. The tool *descriptions* are load-bearing: the model chooses when to act based on them.
- **State** — the conversation history, accumulated tool results, and any external scratchpad. The central engineering problem of agents is deciding what enters the context window and what stays out.
- **Orchestration** — the loop around all of it: when to call the model again, when to stop, when to escalate to a human, what to do on failure.

Frameworks come and go; these four concerns don't. If you understand who owns each one in your system, you understand your architecture.

## Single agent: the right default

One model, one loop, a handful of tools. This is the correct starting architecture for almost everything, and it's what RESO Khdma runs to this day: a conversational agent living inside WhatsApp that interviews Moroccan workers in Darija, extracts structured profiles, and matches them to jobs via semantic search.

A single agent stays the right choice while two things hold:

1. The whole task fits comfortably in one context without drowning the model in irrelevant history.
2. Failure in one part of the task doesn't need to be isolated from the rest.

RESO holds both: each conversation is short, self-contained, and low-stakes per turn. There was never a reason to make it more complicated — and resisting that urge is itself an architectural decision.

## Pipeline of agents: when stages have different jobs

FASL broke both conditions. Drafting a legal appeal memo has distinct phases — case analysis, statute retrieval, drafting, review — with different context needs, different failure modes, and different quality bars. Stuffing them into one loop meant retrieval noise degrading the drafting and analysis errors propagating silently.

The pipeline architecture assigns each stage its own agent with a clean context, connected by **structured-output contracts** — every handoff is a validated, typed object, never free text:

1. **Analysis** reads the case file → structured list of legal issues.
2. **Retrieval** takes the issues → articles from the legal codes, with source references (RAG, so citations are grounded in real law).
3. **Drafting** takes issues + articles → the memo.
4. **Review** takes everything → verified citations, flagged weaknesses, a human-ready draft.

Properties that make pipelines the workhorse of production multi-agent systems:

- **Deterministic control flow.** *Your code* decides what runs next, not a model. Debugging is tractable because the graph is static.
- **Per-stage context discipline.** The drafter never sees the raw case file. Smaller, cleaner contexts consistently beat bigger models with messy ones.
- **Resumability.** When stage three fails, you retry stage three. State lives at the boundaries, in typed artifacts you can persist.

Lakta uses the same shape for a completely different domain — brand kit in, finished Darija video ads out — which is the tell that pipelines are a general pattern, not a legal-tech trick.

## Supervisor/orchestrator: when the task graph is dynamic

The third architecture puts a model in charge of the control flow itself: a supervisor agent decomposes the task, delegates to worker agents, and integrates results. This is what people usually mean by "multi-agent systems," and it's the one to reach for *last*.

Use a supervisor when the task genuinely can't be decomposed ahead of time — open-ended research, sprawling migrations, "look at this codebase and fix what's broken." The costs are real: non-deterministic control flow, harder debugging, compounding token spend, and a failure surface that includes the orchestration itself. When the workflow *is* known ahead of time — and for most business processes it is — a pipeline gives you the modularity without surrendering the control flow.

A useful rule: **let code orchestrate when you can, let a model orchestrate when you must.**

## The decisions that actually matter

Whichever shape you pick, these cut across all of them:

- **Context budget ownership.** Decide explicitly what each agent is allowed to see. Most "the model got dumber" bugs are actually "the context got polluted" bugs.
- **Contracts at boundaries.** Structured outputs with schema validation at every handoff. Free-text handoffs are how errors travel silently.
- **Grounding for facts that must not be wrong.** Route them through retrieval; verify references resolve. Reserve the model's creativity for language and structure, not facts.
- **Human checkpoints where mistakes are expensive.** FASL ends in a lawyer's editor, not a court filing. The checkpoint is part of the architecture, not an apology for it.
- **Observability.** Log every model call, tool call, and handoff artifact. An agent you can't replay is an agent you can't fix.

## A note on frameworks

None of the systems above use an agent framework. The Anthropic SDK's tool runner covers the inner loop; the pipeline orchestration is a few hundred lines of TypeScript with typed contracts — code I can read, test, and debug like any other code. Frameworks earn their place when you need their specific machinery (durable execution, distributed workers), not as a default starting point. Start with the four concerns, own them in plain code, and add machinery when a concrete problem demands it.

If you're designing one of these systems and want a second opinion on the architecture, [my inbox is open](/#contact).

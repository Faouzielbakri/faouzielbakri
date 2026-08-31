---
title: "How to Build an MVP That Ships in Weeks, Not Months"
description: A working method for scoping and building a minimum viable product that reaches real users fast — what to cut, what drives the cost, and the failure modes that turn a six-week MVP into a six-month one.
date: 2026-08-31
keywords: build an mvp, how to build an mvp, how much does it cost to build an mvp, minimum viable product, mvp development, launch an mvp
related: belmo, magical-hekaya, reso-khdma
---

Most MVPs don't fail because the team was slow. They fail because nobody ever decided what the product was allowed to **not** do, so the scope quietly grew a feature a week until the launch date became a rumour.

I've taken four products of my own from an empty repository to real users, plus a dozen client builds. The ones that shipped in weeks and the ones that dragged for months weren't separated by team size or technology. They were separated by how honestly the first version was scoped, and by whether anyone was willing to defend that scope out loud.

This is the method I actually use.

## An MVP is a question, not a small product

The phrase "minimum viable product" gets read as "cheap version of the real thing." That reading is what kills it — it turns the MVP into the full product with worse execution, which is the worst of both outcomes.

An MVP is an experiment. It exists to answer one question you cannot answer by thinking harder:

- Will people pay for this?
- Will they come back after the first use?
- Can I actually deliver this at a price that leaves margin?

Everything in the build either helps answer that question or it doesn't belong in version one. That single filter resolves about eighty percent of scope arguments before they start.

When I built [Belmo](/work/belmo), a K-beauty store for the Moroccan market, the question was not "can we build an e-commerce site" — that's a solved problem. It was: will Moroccan customers order beauty products online and pay cash on delivery, at a volume that supports the inventory? That question dictated the build. Storefront, cart, cash-on-delivery checkout, and an admin panel to fulfil orders. It answered itself with 818 registered clients and 629 orders in the first two months. The recommendation engine, the loyalty programme and the mobile app were all real ideas — and all of them would have delayed the only thing that mattered.

## Write the one sentence first

Before any architecture, write this sentence and put it somewhere you'll see it daily:

> This version is for **[one specific user]** who needs to **[one specific outcome]**, and we'll know it worked if **[one specific number]**.

If you can't fill in the blanks without using "and", the scope is still too wide. Two user types is two products. Two outcomes is two products.

For [Magical Hekaya](/work/magical-hekaya) — AI-personalized children's storybooks — the sentence was: a parent who wants their child to star in a real printed book, and we'll know it worked if strangers pay for one. Not friends. Not "signups". Strangers, paying. The first version had one story template, one age range, and a checkout. It made its first revenue inside two months, which is the only signal that means anything at that stage.

The number in that third blank matters more than people expect. "We'll know it worked if users like it" is unfalsifiable, so the project can never be declared finished or wrong — it just continues. Pick a number that could actually come back negative.

## Cut against the demo, not against the list

Everyone knows to cut features. Almost nobody knows **how** to choose, because a feature list is a flat list and every item on it looks reasonable in isolation.

Here's the technique that works: describe the ninety-second demo you'd give a potential customer. Write it as a sequence of what they see. Anything that doesn't appear in that demo is version two.

That reframing is powerful because it's concrete. "User settings" sounds essential in the abstract; in the demo, nobody opens the settings page. "Password reset" sounds essential; in the demo, nobody forgets their password. Both are real work you will eventually need, and neither answers your question.

Things that are almost always version two:

- **Admin panels for problems you don't have yet.** Your first ten users can be managed with database queries. Building an interface to manage a hundred customers you haven't got is imaginary work.
- **Settings and preferences.** Every toggle is a decision you're refusing to make, and each one doubles your test surface. Pick the default. Ship it.
- **Onboarding flows.** With ten users you can onboard them personally over a call — and you'll learn more from that hour than from any tooltip tour.
- **Multiple ways to do the same thing.** One path through the product. If two paths exist, you'll never learn which one people actually wanted.
- **The scale problem you don't have.** Nothing about a thousand concurrent users matters until you have ten real ones.

Things that are never optional, whatever anyone tells you:

- **Payments, if the question is "will they pay."** A waiting list does not answer that question. Intent is not revenue; people are lovely and generous with hypothetical money.
- **The one flow the product is about.** It must be genuinely good, not a stub. Rough edges everywhere else are fine and even useful — they signal early-stage and lower expectations. A rough edge on the core flow reads as "this doesn't work."
- **A way to see what people did.** Basic analytics, or at minimum logged events in your database. Shipping blind means the experiment produces no data and the whole exercise was decorative.
- **Deployment, from day one.** Not at the end.

## Meet users where they already are

The most effective scope cut is often building no interface at all.

[RESO Khdma](/work/reso-khdma) matches Moroccan workers to jobs. The obvious build was a job-board web app with profiles, search, and applications — months of work, and then the real problem: convincing workers with limited data plans to install and learn something new.

It ships entirely inside WhatsApp instead. An AI agent conducts the intake conversation in Darija, the dialect people actually type, on the app already open on their phone. No signup, no download, no interface to design or maintain. The distribution problem and the scope problem cancelled each other out.

Before designing screens, ask where your users already are — WhatsApp, email, a spreadsheet, a group chat — and whether the first version can just live there. Sometimes the answer is no. When it's yes, you've saved a month and removed the adoption barrier at the same time.

## Boring technology, on purpose

The stack question is where founders burn weeks and engineers get to have opinions. It matters far less than the scoping does.

My default is Next.js, TypeScript, and PostgreSQL, and I reach for something else only when there's a specific reason. Not because it's optimal for every problem — because it's boring in the way that matters at this stage: I've hit its failure modes before, the answers to its problems are already written down, and none of my attention goes to the tooling.

The rules that actually save time:

- **Choose what you can debug at 2 a.m.**, not what benchmarks best. Familiarity beats elegance when the launch is in three weeks.
- **Rent everything that isn't your product.** Auth, payments, email, file storage. Writing your own auth in an MVP is choosing to spend two weeks on a solved problem to save a few euros a month.
- **One database, one deployment target, no microservices.** Distributed systems are a solution to an organizational problem you do not have with one or two engineers.
- **Deploy in week one.** A production deployment on day three is a hard problem solved while it's cheap. The same problem in week six, with a launch date attached, is a crisis. Every project I've delayed deployment on has punished me for it.

The AI question follows the same rule. If the model is the product — as in [FASL](/work/fasl), where multi-agent drafting **is** the value — build it properly and expect it to take real engineering. If AI is a feature on the side of a product that hasn't proven itself yet, it's version two. An unproven product with an impressive AI feature is still an unproven product.

## What actually drives the cost

I get asked for a number more than any other question, and any figure quoted without seeing the project is marketing rather than an estimate. What I can tell you honestly is what moves it, because these are the levers you control:

- **Number of distinct user types.** This is the biggest multiplier by a distance. A product with buyers **and** sellers **and** admins is three interfaces, three permission models, three sets of edge cases. Roughly speaking it's three products. Cutting to one user type in version one is the single largest cost saving available to you.
- **Whether money changes hands inside the product.** Payments bring refunds, failed transactions, reconciliation, tax handling, and a much higher bar for correctness. Worth it when payment is the question you're testing; expensive when bolted on because it seemed natural.
- **Integrations with systems you don't control.** Every external API is someone else's downtime, rate limits, and undocumented behaviour. One is fine. Five is a project of its own.
- **Whether the data already exists in usable form.** Most businesses arrive with knowledge spread across a WhatsApp history, three spreadsheets, and one person's memory. Getting that into a shape software can use is real work that estimates routinely forget.
- **Regulatory or correctness stakes.** Legal, medical, and financial products need review workflows, audit trails, and human oversight. That isn't gold-plating, it's the product — and it costs accordingly.
- **How fast you answer questions.** The most underrated variable, and it's entirely yours. A decision that takes you four days to make is four days the build is blocked. Founders who reply same-day routinely get a product a third faster than founders who batch feedback weekly.

Two things to be wary of when comparing quotes. A quote far below the others usually means the scope was misread, and the gap comes back as change requests. And an hourly arrangement with no fixed scope gives the person building it no reason to be quick — which is why I quote a fixed number against a written scope instead.

## The failure modes, in order of damage

**Scope creep dressed as feedback.** Someone tries the build, suggests something reasonable, and it goes straight into the sprint. Do this six times and the launch moves a month. The fix isn't refusing feedback — it's a version-two list that things visibly go onto. People mostly want to be heard, not to be shipped immediately.

**Building for the user you wish you had.** Designing for the thousandth customer instead of the first ten. Symptoms: sophisticated permission systems, internationalization before a single market works, performance work with no load.

**Perfecting the parts nobody sees.** Refactoring, test coverage on throwaway code, admin tooling. It's comfortable work because it's fully under your control — which is exactly why it expands to fill the time available.

**Delaying launch for one more feature.** There is always one more. The version you're embarrassed by teaches you more than the version you're proud of, because it reaches users while you still have the runway to act on what they say.

**Treating the MVP as a prototype to throw away.** It rarely gets thrown away. If it works, you're building on it Monday. Shortcuts are fine — knowing which ones you took, and writing them down, is what separates a fast MVP from a rewrite in six months.

## The short version

Pick one question worth answering. Write the sentence, including a number that can come back negative. Describe the ninety-second demo and cut everything outside it. Use technology you already know, rent everything that isn't your product, deploy in week one. Ship it while it still embarrasses you slightly, and let the first real users tell you what version two is.

The goal was never a small product. It was the shortest honest path to finding out whether you're building the right thing at all.

If you're scoping a first version and want a second opinion on what to cut, I build MVPs end-to-end — [what that looks like for a small business](/hire/small-business), or [the freelance page](/hire) for larger builds.

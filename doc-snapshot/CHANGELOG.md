# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the `/doc-sync`
page. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-11

### 14:09 UTC — 17 pages, highest severity high

**High — Jev: fast generative UI**

`/deepagents/cookbook/jev-generative-ui` · route `/cookbook/jev-generative-ui` · under “Before you start” · in a `bash` block

10 code lines changed.

````diff
- npm install @copilotkit/core@1.73.0 @copilotkit/react-core@1.73.0 @copilotkit/runtime@1.73.0 @ag-ui/client@0.0.59 @ag-ui/core@0.0.59 @typesafe-ai/sdk@0.6.0 rxjs@7.8.1 zod@4.6.5 @langchain/openai@1.5.13 @langchain/core@1.2.11
+ npm install @copilotkit/core@1.73.0 @copilotkit/react-core@1.73.0 @copilotkit/runtime@1.73.0 @ag-ui/client@1.0.1 @ag-ui/core@1.0.1 @typesafe-ai/sdk@0.6.0 rxjs@7.8.1 zod@4.6.5 @langchain/openai@1.5.13 @langchain/core@1.2.11
- OPENAI_MODEL=gpt-5.4
+ OPENAI_MODEL=gpt-6-luna
- const model = new ChatOpenAI({ model: process.env.OPENAI_MODEL || "gpt-5.4" });
+ const model = new ChatOpenAI({
+ model: process.env.OPENAI_MODEL || "gpt-6-luna",
+ modelKwargs: (process.env.OPENAI_MODEL || "gpt-6-luna") === "gpt-6-luna"
````

**High — A2UI · Dynamic Schema**

`/deepagents/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Backend” · in a `python` block

2 code lines changed.

````diff
- model=ChatOpenAI(model="gpt-5.4"),
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
````

**High — A2UI · Fixed Schema**

`/deepagents/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Configure the runtime (TypeScript)”

2 code lines, 2 prose lines changed.

````diff
- Enable A2UI in your CopilotRuntime:
+ Enable A2UI in your CopilotRuntime, but disable the injected `generate_a2ui` tool. The backend's `search_flights` tool owns this fixed-schema surface; the A2UI middleware still renders its `a2ui.render()` result:
- injectA2UITool: true,
+ injectA2UITool: false,
````

**High — State Rendering**

`/deepagents/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Build an agent that produces state” · in a `python` block

5 code lines changed.

````diff
+ from langchain_openai import ChatOpenAI
- model="openai:gpt-5.4",
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
- model: "openai:gpt-5.4",
+ model: "openai:gpt-6-luna",
````

**High — Tool Rendering**

`/deepagents/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `python` block

5 code lines changed.

````diff
+ from langchain_openai import ChatOpenAI
- model="openai:gpt-4o",
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
- model: "openai:gpt-4o",
+ model: "openai:gpt-6-luna",
````

**High — Interrupt-based HITL**

`/deepagents/generative-ui/your-components/interrupt-based` · route `/generative-ui/your-components/interrupt-based` · under “Call `interrupt` in your Deep Agents agent” · in a `python` block

5 code lines changed.

````diff
+ from langchain_openai import ChatOpenAI
- model="openai:gpt-4o",
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
- model: "openai:gpt-4o",
+ model: "openai:gpt-6-luna",
````

**High — Learned Skills**

`/deepagents/intelligence/learned-skills` · route `/intelligence/learned-skills` · under “BuiltInAgent” · in a `typescript` block

8 code lines changed.

````diff
- model: "openai/gpt-4o",
+ model: "openai/gpt-6-luna",
- model: openai("gpt-4o"),
+ model: openai("gpt-6-luna"),
- model: "openai/gpt-4.1",
+ model: "openai/gpt-6-luna",
- model: "openai/gpt-4o",
+ model: "openai/gpt-6-luna",
````

**High — User Memories**

`/deepagents/intelligence/memories` · route `/intelligence/memories` · under “Overview”

17 code lines, 2 headings, 51 prose lines changed. The number of fenced code blocks changed.

````diff
- Rich Threads remember a conversation. User Memory remembers a person. This page explains
+ AG-UI Streams remember a conversation. User Memory remembers a person. This page explains
- conversation, read [Threads & Persistence Architecture](/deepagents/intelligence/threads-explained)
+ conversation, read [AG-UI Streams & Framework Threads](/deepagents/intelligence/threads-explained)
+ ## Limiting access per request
+ 
+ The runtime configuration in this section uses the TypeScript API. Python, Go, Ruby, and C#/.NET have different policy callbacks; see [Memory policies in other runtime languages](#memory-policies-in-other-runtime-languages).
+ 
````

**High — Automatic Learning**

`/deepagents/learning` · route `/learning` · under “Overview”

54 code lines, 4 headings, 50 prose lines changed. The number of fenced code blocks changed.

````diff
- Automatic Learning turns patterns from real agent runs into skills you can publish. It reads completed conversations in [Rich Threads](/deepagents/threads), writes insights, and proposes instructions you review before you publish them.
+ Automatic Learning turns patterns from real agent runs into skills you can publish. It reads completed conversations in [AG-UI Streams](/deepagents/AG-UI-Streams), writes insights, and proposes instructions you review before you publish them.
+ To record what people do in your app around the agent, such as clicks in a tool's UI and page changes, see [Capture interactions](/deepagents/intelligence/capture-interactions).
+ 
+ | Browser activity to Automatic Learning | `CopilotKitIntelligence.getTrajectoryLearningContainerIds` | Assigns captured Trajectories to existing Learning Spaces. |
+ ## Assign browser activity to a Learning Space
+ 
+ For capture connected to Intelligence, select existing Learning Spaces in your Runtime's server configuration:
````

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Create your Deep Agent” · in a `python` block

20 code lines, 3 prose lines changed.

````diff
- model="openai:gpt-4o",
+ model="openai:gpt-6-luna",
- model: "openai:gpt-4o",
+ model: "openai:gpt-6-luna",
- model="openai:gpt-4o",
+ model="openai:gpt-6-luna",
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime
+ npm install @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**High — Writing agent state**

`/deepagents/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Re-run the agent with updated state”

5 code lines, 2 prose lines changed.

````diff
- If you want to re-run it manually, use `agent.runAgent` after updating state.
+ If you want to re-run it manually, call `copilotkit.runAgent({ agent })` after updating state. Running through `copilotkit` sends your frontend tools and context with the run and executes any frontend tool calls.
- import { useAgent } from "@copilotkit/react-core/v2"; // [!code highlight]
+ import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2"; // [!code highlight]
+ const { copilotkit } = useCopilotKit(); // [!code highlight]
- agent.runAgent();
+ copilotkit.runAgent({ agent });
````

**High — Predictive State Updates**

`/deepagents/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “Emit the intermediate state” · in a `ts` block

13 code lines changed.

````diff
- const model = new ChatOpenAI({ model: "gpt-4o-mini" });
+ const model = new ChatOpenAI({ modelKwargs: { reasoning_effort: "none" }, model: "gpt-6-luna" });
- model = ChatOpenAI(model="gpt-5.4")
+ model = ChatOpenAI(model="gpt-6-luna", reasoning_effort="none")
- model: "gpt-5.4",
- modelKwargs: { parallel_tool_calls: false },
+ model: "gpt-6-luna",
+ modelKwargs: { parallel_tool_calls: false, reasoning_effort: "none" },
````

**Medium — Thread & History Lifecycle**

`/deepagents/threads-lifecycle` · routes `/threads-lifecycle`, `/threads/lifecycle` · under “The lifecycle at a glance”

3 headings, 15 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/deepagents/intelligence/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/deepagents/intelligence/threads-explained) for the full server-side model.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
- verified application user to Rich Threads.
+ verified application user to threads.
````

**Info — Headless Threads**

`/deepagents/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — Multimodal Attachments**

`/deepagents/multimodal-attachments` · route `/multimodal-attachments`

Now tracked for the first time.

**Info — Chat Controls**

`/deepagents/prebuilt-components/chat-controls` · route `/prebuilt-components/chat-controls`

Now tracked for the first time.

**Info — Threads Drawer**

`/deepagents/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

---

## 2026-09-25

### 07:49 UTC — 1 page, highest severity high · _npm run drift:sync_

**High — /deepagents/intelligence/learned-skills**

`/deepagents/intelligence/learned-skills` · route `/intelligence/learned-skills` · `deepagents__intelligence__learned-skills.md`

Code fence count changed. Hash efaf6dd6 ➔ 4108356b.

````diff
- Skill delivery makes one Learning container's published skills available to an agent without another CLI download or process restart. A framework adapter adds an alphabetical catalog and two tools.
- <Image
- src="/images/cloud-hosted/cloud-hosted-skill-delivery.png"
- alt="The Skills tab of a Learning container in cloud-hosted Intelligence. The Skill delivery toggle is on, and skill candidates wait for review."
+ Skill delivery makes published skills from one or more Learning containers available to an agent without another CLI download or process restart. A framework adapter adds an alphabetical catalog and two tools.
+ <Image
+ src="/images/cloud-hosted/cloud-hosted-skill-delivery.png"
+ alt="The Skills tab of a Learning container in cloud-hosted Intelligence. The Skill delivery toggle is on, and skill candidates wait for review."
  … region truncated
````

---

---

## 2026-09-24

### 07:28 UTC — 2 pages, highest severity medium · _npm run drift:sync_

**Medium — /deepagents/intelligence/memories**

`/deepagents/intelligence/memories` · route `/intelligence/memories` · `deepagents__intelligence__memories.md`

Headings / Structure changed. Hash 2887cb7c ➔ 51788919.

````diff
- ## What is a memory?
- A memory is a short, durable statement about a user or a project, stored outside
- any single thread. "Prefers concise status updates" is a memory. The forty
- messages that revealed the preference are a thread.
+ ## Start with your coding agent
+ Copy this prompt into your coding agent to inspect your existing CopilotKit app and configure long-term memory for your users. Prefer to work through the setup yourself? Follow the manual steps below.
+ ### Copy this prompt into your coding agent
+ ```text
  … region truncated
````

**Medium — /deepagents/learning**

`/deepagents/learning` · route `/learning` · `deepagents__learning.md`

Headings / Structure changed. Hash 17c0c2fd ➔ 85a381fe.

````diff
- ## How Automatic Learning works
- Learning starts with a container, which groups Threads from the same kind of work. Intelligence analyzes completed runs in that container and summarizes recurring patterns as Insights.
- When a pattern can be reused, Learning proposes a Skill. You review the supporting Threads and decide whether to publish it. A published Skill is a versioned set of instructions that you load into your agent; Learning does not change the model itself.
- Automatic Learning checks eligible containers on a daily schedule. After you approve a skill, [skill delivery](/deepagents/intelligence/learned-skills) makes it available to connected agents. A scheduled run does not approve skills. Turning on delivery does not connect your agent for you.
+ ## Start with your coding agent
+ Copy this prompt into your coding agent to inspect your existing app and configure Automatic Learning for one focused workflow. Prefer to work through the setup yourself? Follow the manual steps below.
+ #### Copy this prompt into your coding agent
+ ```text
  … region truncated
````

---

---

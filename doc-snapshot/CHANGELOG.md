# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-10-15

### 15:01 UTC — 8 pages, highest severity high

**High — Introduction**

`/deepagents` · routes `/`, `/doc-sync` · under “Introduction”

45 prose lines changed. The number of fenced code blocks changed.

````diff
- {/* TODO: swap feature-viewer URLs back to /deepagents/ once the dojo supports that route */}
+ 
- frameworkIcon={<DeepAgentsIcon className="h-14 w-14" />}
+ frameworkIcon={<DeepAgentsIcon className="h-12 w-12" />}
- subheader="Give your Deep Agents real user-interactivity using CopilotKit and AG-UI. Build rich, interactive, agent-powered applications with LangChain's Deep Agents framework."
- bannerVideo="https://cdn.copilotkit.ai/docs/copilotkit/videos/coagents/overview.mp4"
+ subheader="Deep Agents runs your agent. CopilotKit gives it a surface your users can see, interrupt and steer."
- featuresLink="https://feature-viewer.copilotkit.ai/langgraph/feature/agentic_chat"
````

**High — Interrupt-based HITL**

`/deepagents/generative-ui/your-components/interrupt-based` · route `/generative-ui/your-components/interrupt-based` · under “Set up your agent state” · in a `python` block

78 code lines, 1 heading, 7 prose lines changed.

````diff
- # ...
- from copilotkit import CopilotKitState # extends MessagesState
- # ...
+ from typing import NotRequired
- # This is the state of the agent.
- # It inherits from the CopilotKitState properties from CopilotKit.
+ from copilotkit import CopilotKitState
+ 
````

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Quickstart”

34 code lines, 3 headings, 27 prose lines changed. The number of fenced code blocks changed.

````diff
- <OpsPlatformCTA
- variant="card"
- title="Ship Deep Agents to production"
- body="Add persistent threads and the inspector with CopilotKit Intelligence."
- ctaLabel="Create a free account"
- surface="docs_deepagents_quickstart"
- />
+ ## Start with your coding agent
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

`/deepagents/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “Emit the intermediate state” · in a `python` block

46 code lines changed.

````diff
+ import uuid
+ 
+ from copilotkit import CopilotKitState
- from langgraph.types import Command
- from langgraph.graph import END
- from langchain.tools import tool
- from langchain_openai import ChatOpenAI
- from langchain_core.messages import SystemMessage, AIMessage
````

**Info — Headless Threads**

`/deepagents/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — Threads Drawer**

`/deepagents/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

**Info — Thread & History Lifecycle**

`/deepagents/threads-lifecycle` · route `/threads-lifecycle`

Now tracked for the first time.

---

## 2026-08-26

### 10:23 UTC — 2 pages, highest severity high

**High — State Rendering**

`/deepagents/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Define your agent state”

51 code lines, 2 headings, 4 prose lines changed. The number of fenced code blocks changed.

````diff
- ### Define your agent state
+ ### Build an agent that produces state
- Add properties to your agent state that you want to render in the UI.
+ Define the `searches` state, then add a tool that returns each completed update.
- from copilotkit import CopilotKitState
+ from typing import Any, TypedDict
+ from copilotkit import (
+ CopilotKitMiddleware,
````

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Quickstart”

58 code lines, 1 heading, 24 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
- body="Add persistent threads and the inspector with the Enterprise Intelligence Platform."
+ body="Add persistent threads and the inspector with CopilotKit Intelligence."
- <SignupLink surface="docs_deepagents_quickstart_step1">Sign up for a free developer account</SignupLink> on our Enterprise Intelligence Platform to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_deepagents_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
- ```tsx title="app/api/copilotkit/route.ts"
+ ```tsx title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
- CopilotRuntime,
````

---

---

## 2026-08-17

### 13:24 UTC — 1 page, highest severity high

**High — Input/Output Schemas** · _local snapshot edit, not an upstream change_

`/deepagents/shared-state/state-inputs-outputs` · route `/shared-state/state-inputs-outputs` · under “Implementations”

5 code lines, 2 headings, 4 prose lines changed.

````diff
- ## Implementations
+ ## Implementation
+ 
+ class AgentState(CopilotKitState):
+ question: str
+ answer: str
+ resources: list[str]
- 
````

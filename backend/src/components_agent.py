"""Components and surfaces agent.

https://docs.copilotkit.ai/deepagents/generative-ui/components ("Add the
runtime and an agent")

The page's agent is a TanStack `BuiltInAgent` on `openaiText("gpt-6-luna")`.
This harness runs Deep Agents only, so the same agent is built as a Deep Agents
graph (framework-own-agents swap, labelled): the snippet's system prompt
verbatim, no tools of its own (the snippet defines none), and the model from
`src/shared.py` like every other graph here.

`render_ui` and its guide are not defined here: the runtime adds them to any
run whose provider sends a catalog. The page's instruction for a LangGraph
Python agent is "add `CopilotKitMiddleware`", which hands the run's tools and
context entries to the model.
"""

from copilotkit import CopilotKitMiddleware
from deepagents import create_deep_agent

from src.shared import MODEL

agent = create_deep_agent(
    model=MODEL,
    tools=[],
    middleware=[CopilotKitMiddleware()],
    # The page's prompt, verbatim.
    system_prompt="You are a helpful assistant. When a visual answer helps, render it with generative UI.",
)

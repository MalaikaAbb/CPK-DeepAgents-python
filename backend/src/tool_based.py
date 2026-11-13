"""Agent backing the Components as Tools route.

https://docs.copilotkit.ai/deepagents/generative-ui/tool-based  (rendered 2026-11-11)

The page's two `agent.py` blocks, verbatim. Two harness decisions:

* Order. The page prints the `create_deep_agent` call first and the
  `SYSTEM_PROMPT` it uses second, as two steps of the same file. Pasted in that
  order the module raises `NameError` at import, so the prompt block sits
  above the agent block here. Neither block is edited.
* `model=` reads `src.shared.MODEL` instead of the page's `"openai:gpt-6-luna"`,
  like every agent in this backend.

What the page does NOT publish for Deep Agents is the frontend half: the
`useComponent({ name: "render_bar_chart", parameters, render })` block is
"Missing snippet". So nothing registers `render_bar_chart`, the middleware has
no forwarded tool to merge, and the agent answers in prose. That is the route's
documented failure, not something to fix here.
"""

#region system-prompt
SYSTEM_PROMPT = """
You are a data visualization assistant.

When the user asks for a chart, call `render_bar_chart` with a concise
title and a `data` array of `{label, value}` items.

Keep chat responses brief and let the chart do the talking.
"""
#endregion

#region agent
from deepagents import create_deep_agent
from copilotkit import CopilotKitMiddleware

from src.shared import MODEL

agent = create_deep_agent(
    model=MODEL,
    tools=[],  # Backend tools go here
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)
#endregion

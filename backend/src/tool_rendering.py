"""Agent backing the Tool Rendering route.

https://docs.copilotkit.ai/deepagents/generative-ui/tool-rendering  (Python tab)

The page's `agent.py` verbatim. The tool is deliberately trivial — the whole
point of the page is on the frontend, where `useRenderTool({ name:
"get_weather" })` replaces the default tool-call bubble with a component.

`CopilotKitMiddleware` is not on the page's snippet and is not added here
either: this route renders a backend tool, it does not call frontend ones.
"""

#region tool-rendering-agent
from langchain_openai import ChatOpenAI
from deepagents import create_deep_agent
from langchain.tools import tool

from src.shared import OPENAI_MODEL


@tool
def get_weather(location: str):
    """
    Get the weather for a given location.
    """
    return f"The weather for {location} is 70 degrees."


agent = create_deep_agent(
    # Page (2026-11-11): ChatOpenAI(model="gpt-6-luna", reasoning_effort="none").
    # Model id read from OPENAI_MODEL like every agent here; reasoning_effort verbatim.
    model=ChatOpenAI(model=OPENAI_MODEL, reasoning_effort="none"),
    tools=[get_weather],
    system_prompt="You are a helpful assistant.",
)
#endregion

# client.py
import asyncio
import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from langchain_mcp_adapters.client import MultiServerMCPClient

load_dotenv()


async def main():
    client = MultiServerMCPClient({
        "weather": {
            "transport": "streamable_http",
            "url": "http://localhost:8000/mcp/",
        }
    })
    
    tools = await client.get_tools()

    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=os.getenv("GEMINI_API_KEY"))

    # Define the custom prompt for the tool-calling agent
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful AI assistant. Use the available tools to answer questions."),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )

    # Create the tool-calling agent
    agent = create_tool_calling_agent(llm, tools, prompt)

    # Create the AgentExecutor
    # verbose=True is kept for now, as it shows the agent's internal thought process,
    # which is often useful. You can set it to False if you want a cleaner output.
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    # Manual greeting, as the agent starts with the user input
    print("Gemini: Hi there! How can I help you today?")

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ("exit", "quit"):
            print("Gemini: Goodbye! Have a great day.")
            break
    
        try:
            response = await agent_executor.ainvoke({"input": user_input})
            print("Gemini:", response["output"])
        except Exception as e:
            print(f"An error occurred during agent execution: {e}")
            print("Gemini: I encountered an issue trying to get that information. Could you please try rephrasing or ask something else?")


if __name__ == "__main__":
    asyncio.run(main())
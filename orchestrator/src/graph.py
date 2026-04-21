import datetime
import json
import sys
from typing import Literal
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

from orchestrator.agents.opportunity_finder import execute_opportunity_finder
from orchestrator.agents.compliance_validator import execute_compliance_validator
from shared.schemas import AgentState

import os
from dotenv import load_dotenv

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../.env'))
load_dotenv(dotenv_path=env_path)

# Now the LLM will have the key it needs to initialize
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0, 
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# --- 0. ROUTING SCHEMA (The "CEO's Decision") ---
class RouterDecision(BaseModel):
    """Decide which specialist agent should handle the request."""
    agent: Literal["opportunity_finder", "compliance_validator"] = Field(
        description="The ID of the agent to route to."
    )
    action: str = Field(description="The UI action name (e.g., 'add_opportunity' or 'sync_compliance').")

# Bind the schema to the LLM
router_llm = llm.with_structured_output(RouterDecision)

# --- 1. TASK ALLOCATOR ---
def task_allocator(state: AgentState):
    """Classifies the prompt and routes it to the correct specialist."""
    system_prompt = """
    You are the proGlobax Router. Classify the user prompt:
    1. 'opportunity_finder': Use for market trends, demand spikes, finding buyers/clients. 
       UI Action: 'add_opportunity'
    2. 'compliance_validator': Use for export/import laws, trade routes, and regulatory checks.
       UI Action: 'sync_compliance'
    """
    
    # LLM makes the decision
    decision = router_llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=state["input_prompt"])
    ])

    return {
        "target_agent": {
            "agent": decision.agent,
            "action": decision.action
        }
    }

# --- 2. AGENT EXECUTION NODE ---
def call_specialized_agent(state: AgentState):
    """Switches execution based on the Allocator's routing decision."""
    target = state["target_agent"]["agent"]
    prompt = state["input_prompt"]
    
    print(f"[EXECUTION] Routing to: {target}", file=sys.stderr)

    if target == "opportunity_finder":
        result = execute_opportunity_finder(prompt)
    elif target == "compliance_validator":
        result = execute_compliance_validator(prompt)
    else:
        result = json.dumps({"message": "No specialist available.", "opportunities": []})
        
    return {"agent_raw_output": result}

# --- 3. UI CONTROLLER ---
def ui_controller(state: AgentState):
    """Packages the result into a UISignal for React/Zustand."""
    raw_output = state["agent_raw_output"]
    target_info = state["target_agent"]
    
    try:
        parsed_data = json.loads(raw_output)
    except json.JSONDecodeError:
        parsed_data = {"message": "Parsing error.", "opportunities": [], "compliance_checks": []}

    # Generate modern UTC timestamp
    timestamp = datetime.datetime.now(datetime.UTC).isoformat()

    signal = {
        "agent": target_info["agent"],
        "action": target_info["action"], 
        "payload": {
            "message": parsed_data.get("message", "Task complete."),
            "opportunities": parsed_data.get("opportunities", []),
            "compliance_checks": parsed_data.get("compliance_checks", []),
            "trade_route": parsed_data.get("trade_route", []),
            "timestamp": timestamp
        },
        "status": "success"
    }
    
    print(f"[UI_CONTROLLER] Signal dispatched: {target_info['action']}", file=sys.stderr)
    return {"ui_signals": [signal]}

# --- ASSEMBLE GRAPH ---
workflow = StateGraph(AgentState)

workflow.add_node("allocator", task_allocator)
workflow.add_node("specialist", call_specialized_agent)
workflow.add_node("ui_controller", ui_controller)

workflow.set_entry_point("allocator")
workflow.add_edge("allocator", "specialist")
workflow.add_edge("specialist", "ui_controller")
workflow.add_edge("ui_controller", END)

agentic_brain = workflow.compile()
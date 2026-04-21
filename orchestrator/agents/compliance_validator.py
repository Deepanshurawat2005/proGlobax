import os
import json
from datetime import datetime, UTC
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

# Load API Key from .env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../.env'))
load_dotenv(dotenv_path=env_path)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", # Use 2.5-flash for high-speed logic
    temperature=0.1, # Lower temperature for higher factual accuracy in laws
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def execute_compliance_validator(prompt: str) -> str:
    system_instructions = """
    You are the 'Global Trade Compliance Validator' for proGlobax.
    Task: Analyze trade prompts to identify Origin, Destination, and Transit routes. Validate Export/Import laws for the specific goods mentioned.

    ### OPERATIONAL STEPS:
    1. Identify 'Country A' (Origin) and 'Country B' (Destination), If origin country Not given default is India.
    2. If no route is defined, suggest the most common maritime or air route for the specific goods.
    3. For EVERY country in the route (Origin, Transit, Destination):
    - Validate Export/Import/Transit laws based on the goods' specifications.
    - Identify required certifications (e.g., ISO, CE, IEC Code, REACH).
    - Assign a specific 'compliance_status' (e.g., fully_compliant, easy, moderate, strict, blocked).

    CRITICAL: Output ONLY a valid JSON object. Do not include markdown formatting like ```json. Do not include any conversational preamble or postscript.

    ### JSON Structure:
    {
        "message": "A 1 to 3 sentence summary of the compliance status across the route. End with 'Validation complete.'",
        "compliance_checks": [
            {   "country": "string",
                "longitude": float,
                "latitude": float,
                "role": "origin | transit | destination",
                "note": "📈 Law: [Relevant Act/Regulation] | 🎯 Requirement: [Specific doc/license needed] | ⚠️ Risk: [Sanction or delay factor]",
                "compliance_status": "fully_compliant | easy | moderate | strict | blocked"
            }
        ]
    }
    """

    try:
        response = llm.invoke([
            SystemMessage(content=system_instructions),
            HumanMessage(content=prompt)
        ])
        
        # --- THE CLEANING LAYER ---
        raw_content = response.content.strip()
        if raw_content.startswith("```"):
            raw_content = raw_content.split('\n', 1)[-1].rsplit('\n', 1)[0].strip()
            if raw_content.startswith("json"):
                raw_content = raw_content[4:].strip()

        return raw_content
    except Exception as e:
        return json.dumps({
            "message": "Compliance check failed.",
            "compliance_checks": [],
            "error": str(e)
        })
    


# proGLOBAX  
Agentic AI Workstation for Global Trade  

proGLOBAX is an AI-powered platform designed to help startups, SMEs, and MSMEs access and operate in global markets. It simplifies trade by automating opportunity discovery, compliance validation, and trade intelligence using a multi-agent system.

---

## Overview  
Global trade involves complex compliance requirements, fragmented data sources, and manual workflows.  
proGLOBAX addresses these challenges by combining document processing, AI agents, and structured decision-making into a single system.

---

## Key Features  
- Identifies relevant global market opportunities  
- Validates cross-border compliance requirements  
- Processes trade documents using a RAG-based pipeline  
- Uses a hybrid LLM setup (cloud + local) for performance and security  
- Supports structured trade workflows and decision-making  

---

## Tech Stack  
- Backend: FastAPI (Python)  
- Frontend: React  
- Database: PostgreSQL, ChromaDB  
- AI: LangGraph, Gemini API, Llama/Ollama  
- Document Processing: EasyOCR, pdfplumber  

---

## Workflow  
1. Document ingestion using OCR and RAG  
2. Opportunity discovery through agent-based analysis  
3. Compliance validation  
4. Trade intelligence generation  
5. Human-in-the-loop approval for critical decisions  

---

## Steps to run 
**Setup Dependency On First run**
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```
**Run All Servers**
```
.\start_services.ps1
```

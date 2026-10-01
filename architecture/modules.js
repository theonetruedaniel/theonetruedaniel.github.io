export default [
  {
    "id": "M01",
    "state": "Architecture design",
    "name": "Intent & task design",
    "purpose": "Maps research, coding, planning, or document work into a bounded, inspectable plan before a model path is selected.",
    "relationships": [
      "Receives scope from the personal platform shell.",
      "Defines the handoff to model and tool design."
    ],
    "decisions": [
      "Route by task risk and scope.",
      "No implicit tool access."
    ]
  },
  {
    "id": "M02",
    "state": "Architecture design",
    "name": "Model path design",
    "purpose": "Describes interchangeable cloud or local model paths through a clear model boundary.",
    "relationships": [
      "Reads permissions and budget envelopes.",
      "Reports compatibility and evidence back to the trace."
    ],
    "decisions": [
      "A model swap preserves authoritative memory and settings.",
      "Compatibility is evaluated at the boundary for each selected model path."
    ]
  },
  {
    "id": "M03",
    "state": "Architecture design",
    "name": "Evidence & tool design",
    "purpose": "Defines how normalized evidence, provenance, and readiness checks support future research, coding, document, runtime, and integration components.",
    "relationships": [
      "Informed by foundation inventory and normalization.",
      "Feeds decisions and artifact checks."
    ],
    "decisions": [
      "Evidence is separate from confidence.",
      "Optional tool slots preserve the core record."
    ]
  },
  {
    "id": "M04",
    "state": "Architecture design",
    "name": "Memory & UI design",
    "purpose": "Makes customizable memory scopes, workflows, and interface choices visible to the person directing the system.",
    "relationships": [
      "Scoped by permissions.",
      "Available to the task design when approved."
    ],
    "decisions": [
      "Memory is opt-in and inspectable.",
      "Personalization preserves authoritative data."
    ]
  },
  {
    "id": "M05",
    "state": "Architecture design",
    "name": "Permission design",
    "purpose": "Maps read, propose, and simulated act choices across the personal platform.",
    "relationships": [
      "Constrains routing and action planning.",
      "Receives Stop state from the walkthrough."
    ],
    "decisions": [
      "Read, propose, and act are different verbs.",
      "Stop blocks subsequent simulated steps."
    ]
  },
  {
    "id": "M06",
    "state": "Foundation tooling",
    "name": "Foundation tooling",
    "purpose": "Provides environment inventory, evidence normalization, and artifact/readiness checks for planning and review.",
    "relationships": [
      "Connected to evidence and roadmap milestones.",
      "Supports the next application phase."
    ],
    "decisions": [
      "Readiness is recorded as a documented judgment for the next phase.",
      "Foundation tooling stays distinct from the core application."
    ]
  }
];

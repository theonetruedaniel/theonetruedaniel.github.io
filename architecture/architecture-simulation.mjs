                                
                                                                    
                                                                  
  
export const examples                                                                   = {
  'Draft a requirements trace': {
    input: 'A sample document assistant must cite its sources, ask before sending a draft, and stop when requested.',
    title: 'Sample requirements trace',
    rows: ['REQ-01 · Cite sources → Evidence module → Every factual claim links to a supplied source.', 'REQ-02 · Approval before sending → Permission module → A draft remains held until a separate approval.', 'REQ-03 · Stop → Workflow control → No later step advances while paused.'],
  },
  'Research a topic': {
    input: 'Compare local and cloud model paths using two supplied fictional architecture notes.',
    title: 'Sample research brief',
    rows: ['Local path: keeps this example within the local model boundary. Fixture source: Architecture note A.', 'Cloud path: introduces an external provider boundary and a larger sample budget. Fixture source: Architecture note B.', 'Open question: actual quality, latency, privacy controls and cost require a separate evaluation. No benchmark is claimed.'],
  },
  'Review a code change': {
    input: 'Review a fictional change that sends a draft immediately after saving it, without checking approval.',
    title: 'Sample code review',
    rows: ['Finding: the proposed send step does not check approval.', 'Suggested change: keep the draft pending and check explicit approval before sending.', 'Acceptance check: a missing or denied approval produces no send; approved execution is a separate operation.'],
  },
  'Plan a project': {
    input: 'Plan a small document assistant from requirements through a synthetic demonstration.',
    title: 'Sample project plan',
    rows: ['1. Define scope → List allowed inputs, outputs and approval boundaries.', '2. Build the synthetic path → Use fixture documents and a mock model response.', '3. Validate → Check source references, permission holds and Stop before considering any real integration.'],
  },
  'Draft a document': {
    input: 'Draft a short project update from fictional notes: requirements reviewed, prototype pending, approval gate unresolved.',
    title: 'Sample project update',
    rows: ['Requirements review is complete in this fictional scenario. The prototype has not been built.', 'The next step is a synthetic demonstration using fixture documents.', 'The approval gate still needs an acceptance check. No external action is scheduled.'],
  },
  'Propose an external action': {
    input: 'Prepare a proposal to send a fictional project update to a reviewer. Do not send it.',
    title: 'Sample action proposal',
    rows: ['Proposed action: send the prepared fictional project update to a reviewer.', 'Approval packet: review the recipient, exact message and intended destination before authorizing execution.', 'Disposition: proposal prepared; external action remains held. This demonstration never sends messages.'],
  },
};
export function inspectRoute(c                  ) {
  const broad = c.scope === 'Research a topic' || c.scope === 'Propose an external action';
  const checks = [
    { title: 'Evidence', passed: c.evidenceReady, detail: c.evidenceReady ? 'The supplied fictional input is marked ready for this run.' : 'Check “Sample evidence reviewed and ready” to release this input.' },
    { title: 'Permission', passed: c.permission !== 'read', detail: c.permission === 'read' ? 'Choose Read + propose to create a sample draft.' : c.permission === 'act' ? 'Simulated act is selected. It never authorizes a real external action.' : 'Read + propose permits a sample draft; external actions remain held.' },
    { title: 'Budget', passed: !broad || c.budget === 'generous', detail: broad && c.budget !== 'generous' ? 'Choose Generous for this task, or select a smaller task.' : `${c.budget} covers this task under the illustrative policy; no money is spent.` },
    { title: 'Model path', passed: !(c.route === 'cloud-adaptive' && c.budget === 'lean'), detail: c.route === 'cloud-adaptive' && c.budget === 'lean' ? 'Choose Balanced or Generous for the cloud example, or use the local path.' : c.route === 'review' ? 'Prepare a human review packet instead of a model draft.' : c.route === 'cloud-adaptive' ? 'Use a mock cloud response; no provider is contacted.' : 'Use a mock local response; no model is running.' },
  ];
  return { checks, allowed: checks.every(check => check.passed) };
}
export const configKey = (c                  ) => JSON.stringify([c.scope, c.budget, c.route, c.toolAdapter, c.memoryScope, c.permission, c.evidenceReady]);
                                                                                                      
export function advanceRun(run     , action                                                 , config                  )      {
  if (action === 'reset') return null;
  const key = configKey(config);
  if (action === 'start') return inspectRoute(config).allowed ? { key, completed: 1, phase: 'running' } : null;
  if (!run || run.key !== key || !inspectRoute(config).allowed) return null;
  if (action === 'pause' && run.phase === 'running') return { ...run, phase: 'paused' };
  if (action === 'resume' && run.phase === 'paused') return { ...run, phase: 'running' };
  if (action === 'next' && run.phase === 'running') {
    const completed = Math.min(4, run.completed + 1);
    return { ...run, completed, phase: completed === 4 ? 'complete' : 'running' };
  }
  return run;
}

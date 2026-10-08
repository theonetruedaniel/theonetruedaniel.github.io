import { advanceRun, examples, inspectRoute, configKey } from './architecture-simulation.mjs';
import modules from './modules.js';

// Browser-only case study. All task outputs are existing fictional fixtures.
const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const comparisons = {
  skills: ["Q-29","Can tested skill edits improve recurring work?","Compare Microsoft SkillOpt with unchanged skills, manual revisions and bounded search. SkillOpt changes reusable instructions while keeping target model weights fixed. Coordinate with Q-20 experiments and Q-28 Prime Agent refinement.","Synthetic research, personal knowledge, document creation and household planning. Measure unseen-task correctness, task regressions, correction effort, skill length, latency and total optimization plus deployment cost.","Use matched models, tools and budgets, an untouched final test set and critical-case regression checks. Stage versioned changes for review and rollback; retain Core permissions.","Source researched October 7, 2026. Planned and untested; no adoption. Sleep transcript replay is a separate privacy and execution scope."],
  desktop: ['BO-01','Does a desktop shell earn its complexity?','Tauri 2 with React / TypeScript versus a contract-equivalent local web or PWA shell, driven by the same mock Core event stream.','Keyboard access, approval and Stop visibility, crash / reconnect behavior, startup, and process resources.','Choose Tauri only when demonstrated native value passes the gates. Keep the web / PWA path as the fallback.','Planned comparison. No completed shell bake-off or product UI is claimed.'],
  core: ['BO-02','Where should the authoritative Core live?','Compare a Node / TypeScript Core, a narrow Rust Core with a Node worker, and a split service behind identical interfaces.','Boundary clarity, privileged code size, event-stream consistency, restart behavior, packaging, and maintenance.','Choose the placement from measured contract, recovery, and operating trade-offs before freezing the interface.','Planned comparison. No Core implementation or winning placement is claimed.'],
  runtime: ['BO-03','Can a runtime respect the Abrams contract?','Cline and the restored OpenCodex / Open Claude Code runtime candidates are subject to intake and provenance gates. A deterministic AbramsRuntime supplies the contract oracle, not a production winner.','At least 20 frozen model-neutral tasks with the same admitted route, grants, events, restart cases, and removal checks. Runtime conformance is separate from model quality.','Abrams keeps authority over routing, credentials, policy, budgets, durable state, and effects. Admit only the exact tested scope.','Candidate coverage is planned. Intake gates remain; no candidate adoption or completed runtime bake-off is claimed.'],
  memory: ['BO-06','When does richer retrieval justify more machinery?','Start with SQLite, SQL / FTS5, temporal context, and provenance. Compare vector or hybrid retrieval on a labeled corpus.','Recall and ranking, supported-answer accuracy, latency, scope isolation, deletion, rebuild, migration, and removal.','Add retrieval complexity only for a material measured gain while preserving authoritative records and clean removal.','Planned comparison on 10,000 then 100,000 records. No retrieval benchmark or production memory system is claimed.']
};
document.querySelectorAll('[data-bakeoff]').forEach(button => button.addEventListener('click', () => {
  const [id,title,description,evaluate,rule,evidence] = comparisons[button.dataset.bakeoff];
  document.querySelectorAll('[data-bakeoff]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  $('#bakeoff-detail').innerHTML = `<div class="section-label">${id} · planned comparison</div><h3>${title}</h3><p>${description}</p><dl><dt>Evaluate</dt><dd>${evaluate}</dd><dt>Decision rule</dt><dd>${rule}</dd><dt>Current evidence</dt><dd>${evidence}</dd></dl>`;
}));

document.querySelectorAll('[data-module-id]').forEach(button => button.addEventListener('click', () => {
  const module = modules.find(m => m.id === button.dataset.moduleId);
  document.querySelectorAll('[data-module-id]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  $('.module-detail').innerHTML = `<div class="section-label">${module.id} · ${module.state}</div><h2 data-testid="text-selected-module">${module.name}</h2><p>${module.purpose}</p><div class="detail-block"><h3>Relationships</h3><ul>${module.relationships.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="detail-block"><h3>Design decisions</h3><ul>${module.decisions.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}));

const base = {scope:'Draft a requirements trace',budget:'balanced',route:'local-safe',toolAdapter:'none',memoryScope:'Task context only',permission:'propose',evidenceReady:false};
let config = {...base}, run = null;
const fields = ['scope','budget','permission','route','toolAdapter','memoryScope','evidenceReady'];
const controls = [...$('.simulation-fields').querySelectorAll('select,input')];
controls.forEach((control,index) => control.addEventListener('change', () => {
  config[fields[index]] = control.type === 'checkbox' ? control.checked : control.value;
  run = null;
  render();
}));
// Invalidate a displayed result immediately while typing, not just on field blur.
controls[5].addEventListener('input', () => { config.memoryScope=controls[5].value; run=null; render(); });
function syncFields() { controls.forEach((control,i) => { if(control.type==='checkbox') control.checked=config[fields[i]]; else control.value=config[fields[i]]; }); }
const leftButtons = [...$('.feedback-walkthrough > div').querySelectorAll('button')];
leftButtons[0].addEventListener('click', () => {config={...base,evidenceReady:true};run=null;syncFields();render();});
leftButtons[1].addEventListener('click', () => {config={...base};run=null;syncFields();render();});
$('.walkthrough-result').addEventListener('click', event => {
  const button=event.target.closest('[data-action]');
  if(button && !button.disabled) {run=advanceRun(run,button.dataset.action,config);render();$('.walkthrough-result [data-action]')?.focus({preventScroll:true});}
});
function render() {
  const policy=inspectRoute(config), current=run?.key===configKey(config)?run:null, example=examples[config.scope];
  const model=config.route==='review'?'Human-guided review':config.route==='cloud-adaptive'?'Cloud / adaptive mock model':'Local / safe mock model';
  const tool=config.toolAdapter==='none'?'Supplied sample only; no optional tool':`${config.toolAdapter}: use a fictional ${config.toolAdapter.split(' ')[0]} fixture; no tool is called`;
  const steps=[
    ['Check the sample input',`Evidence, permission and budget checks passed for "${config.scope}".`],
    ['Select the route',`${model}. ${tool}. Memory boundary: ${config.memoryScope.trim()||'No memory scope selected'}; nothing is saved between visits.`],
    [config.route==='review'?'Assemble a review packet':'Assemble the sample output',config.route==='review'?'The request and open checks are prepared for a person. No model draft is produced.':`The prewritten "${example.title}" fixture is now visible below. It is a demonstration, not a model-generated result.`],
    ['Check the handoff',config.scope==='Propose an external action'?'Proposal complete; sending remains held for a separate real approval. Nothing was sent.':'The sample is ready for human review. Real-world accuracy and acceptance still need validation.']
  ];
  $('.sample-input p').textContent=example.input;
  const state=!policy.allowed?'Needs changes':current?.phase==='paused'?'Paused':current?.phase==='complete'?'Sample complete':current?`Step ${current.completed} of 4 complete`:'Ready to run';
  const message=!policy.allowed?'Resolve the checks below, or load the ready example.':current?.phase==='paused'?'Progress is preserved. Continue to unlock the next step.':current?.phase==='complete'?'All four sample steps are complete. Review the output below or change the settings to compare another route.':current?`Completed: ${steps[current.completed-1][0]}. Next: ${steps[current.completed][0]}.`:'Choose Run sample to begin. Each Next step reveals the next decision and keeps the earlier results visible.';
  const action=(name,label,testId,disabled=false)=>`<button class="button ${name==='pause'?'secondary':''}" data-action="${name}" data-testid="${testId}" ${disabled?'disabled':''}>${escape(label)}</button>`;
  let buttons=!current||current.phase==='complete'?action('start',current?'Run again':'Run sample','button-run-simulation',!policy.allowed):current.phase==='paused'?action('resume','Continue simulation','button-continue-simulation')+action('pause','Stopped','button-stop-simulation',true):action('next',`Next step: ${steps[current.completed][0]}`,'button-next-simulation')+action('pause','Stop simulation','button-stop-simulation');
  const outputRows=config.route==='review'?[`Request: ${example.input}`,'Reviewer check: confirm source coverage, scope and acceptance criteria.','Disposition: awaiting human review. No model draft or external action was produced.']:example.rows;
  $('.walkthrough-result').classList.toggle('blocked',!policy.allowed);
  $('.walkthrough-result').innerHTML=`<div role="status" aria-live="polite" aria-atomic="true" data-testid="status-simulation-result"><div class="result-state"><strong>${state}</strong></div><p>${escape(message)}</p></div><ul class="simulation-checks" aria-label="Route checks">${policy.checks.map(c=>`<li class="${c.passed?'passed':'needs-change'}"><strong>${c.passed?'Pass':'Change needed'} · ${c.title}</strong><span>${escape(c.detail)}</span></li>`).join('')}</ul><div class="simulation-actions">${buttons}</div><ol class="simulation-steps" aria-label="Walkthrough steps">${steps.map(([title,detail],i)=>`<li class="${current&&current.completed>i?'done':'pending'}"><div class="simulation-step-heading"><strong>${i+1}. ${title}</strong><span>${current&&current.completed>i?'Complete':'Pending'}</span></div>${current&&current.completed>i?`<p>${escape(detail)}</p>`:''}</li>`).join('')}</ol>${current&&current.completed>=3?`<section class="simulation-output" aria-label="Sample output" data-testid="sample-output"><div class="section-label">Fictional sample output</div><h3>${config.route==='review'?'Human review packet':example.title}</h3><ul>${outputRows.map(row=>`<li>${escape(row)}</li>`).join('')}</ul><p><strong>Route receipt:</strong> ${model} · ${config.budget} budget · ${config.permission} permission.</p><p><strong>Evidence:</strong> ${escape(tool)}.</p><p><strong>Memory boundary:</strong> ${escape(config.memoryScope.trim()||'None')} · session display only.</p></section>`:''}`;
}
syncFields();render();

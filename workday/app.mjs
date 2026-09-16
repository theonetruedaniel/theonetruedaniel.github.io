import {createRecords,act} from './model.mjs';
let records=createRecords(),selected='northstar',filter='all';
const $=id=>document.getElementById(id);
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function announce(message){$('announcement').textContent=message;}
function queue(){
 $('all').setAttribute('aria-pressed',String(filter==='all'));$('needs').setAttribute('aria-pressed',String(filter==='needs'));
 const target=$('queue');target.replaceChildren();const shown=records.filter(r=>filter==='all'||!r.done);
 if(!shown.length)target.append(el('p','All four cases have a prepared next step. Reset to try again.','empty'));
 for(const r of shown){const b=el('button',undefined,'account');b.type='button';b.setAttribute('aria-pressed',String(r.id===selected));b.setAttribute('aria-label',`${r.name}: ${r.done?'Next step prepared':r.label}`);const meta=el('span',undefined,'meta');meta.append(el('strong',r.name),el('span',r.timing,'timing'));b.append(meta,el('span',r.done?'Next step prepared':r.label,'label'),el('span',r.description,'description'));b.onclick=()=>{selected=r.id;render();$('detail').focus();};target.append(b);}
 $('remaining').textContent=`${records.filter(r=>!r.done).length} of 4 cases need action.`;
}
function field(form,r,key,label,options={}){
 const wrap=el('label',undefined,options.wide?'field wide':'field');wrap.append(el('span',label));let input;
 if(options.choices){input=el('select');input.append(new Option('Choose one',''));for(const item of options.choices)input.append(new Option(item,item));}
 else input=el(options.area?'textarea':'input');
 input.name=key;input.id=`${r.id}-${key}`;input.value=r.values[key]||'';input.required=!!options.required;input.maxLength=1200;
 if(options.placeholder)input.placeholder=options.placeholder;
 input.oninput=()=>{r.values[key]=input.value;input.setCustomValidity('');};
 input.onchange=()=>{r.values[key]=input.value;};wrap.append(input);form.append(wrap);
}
function render(){queue();const r=records.find(x=>x.id===selected),d=$('detail');d.replaceChildren();d.append(el('h2',r.name),el('p',r.subtitle,'subtitle'));
 const steps=el('ol',undefined,'steps');const labels=r.id==='relay'?['Route','Acknowledge','Resolve']:['Review','Prepare','Next action'];labels.forEach((s,i)=>steps.append(el('li',s,i===Math.min(r.stage,2)?'active':'')));d.append(steps);
 const attention=el('div',undefined,'attention');attention.append(el('h3','What needs attention'),el('p',r.attention),el('p',r.context,'context'));d.append(attention);
 if(!r.done){const form=el('form');const fields=el('div',undefined,'fields');form.append(fields);let label='Prepare follow-up';
 if(r.id==='northstar'){field(fields,r,'usecase','Use case or question to confirm',{required:true,placeholder:'e.g. Confirm the intended pilot use case'});field(fields,r,'timing','Timing or question to confirm',{required:true,placeholder:'e.g. Ask when the pilot needs to start'});field(fields,r,'note','Internal handoff note',{area:true,wide:true});}
 if(r.id==='fieldwork'){field(fields,r,'nextstep','Proposed next step',{required:true,wide:true,placeholder:'e.g. Schedule a 20-minute pilot scoping call'});field(fields,r,'due','Next follow-up',{required:true,choices:['Today','Tomorrow','Friday']});field(fields,r,'note','Internal note',{area:true,wide:true});}
 if(r.id==='relay'){
  if(r.stage===0){field(fields,r,'owner','Support owner',{required:true,choices:['Support queue','Solutions engineer']});field(fields,r,'impact','Customer impact',{required:true,placeholder:'e.g. Cannot begin the scheduled pilot'});field(fields,r,'note','Issue context and checks completed',{required:true,area:true,wide:true});label='Prepare handoff';}
  else if(r.stage===1){form.append(el('p','A routed issue still needs an acknowledgment. Simulate the owner accepting it; the issue will remain open.','help'));label='Simulate acknowledgment';}
  else{field(fields,r,'resolution','Customer-confirmed resolution',{required:true,area:true,wide:true,placeholder:'Describe the simulated fix and confirmation'});label='Record simulated resolution';}
 }
 if(r.id==='juniper'){field(fields,r,'objective','Meeting objective',{required:true,wide:true,placeholder:'e.g. Agree a measurable pilot scope'});field(fields,r,'question','Opening question',{required:true,wide:true,placeholder:'e.g. What would make this pilot worth expanding?'});field(fields,r,'note','Preparation note',{area:true,wide:true});label='Prepare meeting brief';}
 const submit=el('button',label,'primary');submit.type='submit';form.append(submit,el('p','Use sample details. Required fields must contain text. Drafts use fixed templates.','help'));form.onsubmit=e=>{e.preventDefault();for(const input of form.querySelectorAll('[required]')){if(!input.value.trim()){input.setCustomValidity('Enter a value before continuing.');input.reportValidity();return;}}if(act(r)){render();$('detail').focus();announce(`${r.name}: ${r.events.at(-1)}`);}};d.append(form);
 }else d.append(el('p',r.id==='relay'?'Simulated issue resolved.':'Next step prepared. Nothing has been sent.','saved'));
 if(r.draft){d.append(el('h3',r.id==='juniper'?'Meeting brief':'Prepared draft'),el('div',r.draft,'draft'));}
 const activity=el('section',undefined,'activity');activity.append(el('h3','Activity'));const log=el('ol');r.events.forEach(e=>log.append(el('li',e)));activity.append(log);d.append(activity);
}
for(const kind of ['all','needs'])$(kind).onclick=()=>{filter=kind;const shown=records.filter(r=>kind==='all'||!r.done);if(shown.length&&!shown.some(r=>r.id===selected))selected=shown[0].id;render();announce(`${shown.length} accounts shown.`);};
$('reset').onclick=()=>{records=createRecords();selected='northstar';filter='all';render();announce('Demo reset. Four accounts need action.');};
$('menu').onclick=()=>{const open=$('menu').getAttribute('aria-expanded')!=='true';$('menu').setAttribute('aria-expanded',String(open));$('navlinks').classList.toggle('open',open);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('menu').getAttribute('aria-expanded')==='true'){$('menu').setAttribute('aria-expanded','false');$('navlinks').classList.remove('open');$('menu').focus();}});render();

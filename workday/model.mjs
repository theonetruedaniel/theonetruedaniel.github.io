export function createRecords(){return [
{id:'northstar',name:'Northstar',label:'Incomplete intake',timing:'Today',description:'Company and contact received; use case and timing are missing.',subtitle:'New inbound inquiry',attention:'A new inquiry has a company and contact, but no use case or timing.',context:'Contact: Alex · Source: website form · Owner: you',stage:0,done:false,values:{usecase:'',timing:'',note:''},events:['9:00 AM · Received inquiry.'],draft:''},
{id:'fieldwork',name:'Fieldwork',label:'Follow-up overdue',timing:'2 days overdue',description:'A pricing question has no recorded reply or next step.',subtitle:'Customer follow-up',attention:'The prospect asked how a pilot would work. A follow-up was due Monday; no reply is recorded.',context:'Contact: Morgan · Last message: Friday · Owner: you',stage:0,done:false,values:{nextstep:'',due:'Today',note:''},events:['Friday · Prospect asked about a pilot.','Monday · Follow-up became due.'],draft:''},
{id:'relay',name:'Relay',label:'Support handoff',timing:'Yesterday',description:'An access issue needs an owner and a customer update.',subtitle:'Open customer issue',attention:'The customer cannot access their workspace. The cause is unknown. Route the issue and track it through resolution.',context:'Contact: Sam · Issue: workspace access · Customer update: due today',stage:0,done:false,values:{owner:'',impact:'',note:'',resolution:''},events:['Yesterday · Customer reported an access issue.'],draft:''},
{id:'juniper',name:'Juniper',label:'Meeting tomorrow',timing:'Tomorrow',description:'Prepare a discovery agenda and make unknowns explicit.',subtitle:'Discovery preparation',attention:'The prospect wants to discuss a pilot. Success criteria, constraints, and the decision process are still unknown.',context:'Contact: Casey · Meeting: Thursday, 10 AM · Owner: you',stage:0,done:false,values:{objective:'',question:'',note:''},events:['Yesterday · Discovery meeting booked.'],draft:''}
];}
export function act(r){
 if(r.done)return false;
 const v=r.values, has=k=>typeof v[k]==='string'&&v[k].trim().length>0;
 if(r.id==='northstar'){
  if(!has('usecase')||!has('timing'))return false;
  r.draft=`Hi Alex,\n\nThanks for your inquiry. Could you help us clarify these points?\n\nUse case: ${v.usecase.trim()}\nTiming: ${v.timing.trim()}\n\nPlease share any constraints we should consider before scheduling a discussion.\n\n${v.note.trim()?`Internal handoff note (exclude from customer email): ${v.note.trim()}`:''}`.trim();
  r.events.push('Prepared intake follow-up; awaiting customer confirmation.');r.done=true;r.stage=2;
 }else if(r.id==='fieldwork'){
  if(!has('nextstep')||!has('due'))return false;
  r.draft=`Hi Morgan,\n\nFollowing up on your pilot question. The proposed next step is: ${v.nextstep.trim()}. Would that work for you?\n\nInternal task: follow up ${v.due.trim()}. Owner: you.${v.note.trim()?`\nInternal note: ${v.note.trim()}`:''}`;
  r.events.push(`Prepared follow-up and recorded next check: ${v.due.trim()}.`);r.done=true;r.stage=2;
 }else if(r.id==='relay'){
  if(r.stage===0){
   if(!has('owner')||!has('impact')||!has('note'))return false;
   r.draft=`Support handoff\nOwner: ${v.owner.trim()}\nCustomer impact: ${v.impact.trim()}\nContext: ${v.note.trim()}\nCause: unknown; needs investigation.\nNext customer update: today.\n\nCustomer update draft\nHi Sam, I have prepared your access issue for our support team. I will follow up today with an update.`;
   r.events.push(`Prepared handoff for ${v.owner.trim()}; acknowledgment still needed.`);r.stage=1;
  }else if(r.stage===1){r.events.push('Simulated support acknowledgment; issue remains open.');r.stage=2;}
  else{if(!has('resolution'))return false;r.events.push(`Simulated customer-confirmed resolution: ${v.resolution.trim()}`);r.draft+=`\n\nResolution note: ${v.resolution.trim()}`;r.stage=3;r.done=true;}
 }else if(r.id==='juniper'){
  if(!has('objective')||!has('question'))return false;
  r.draft=`Discovery brief · Thursday, 10 AM\nContact: Casey\n\nMeeting objective\n${v.objective.trim()}\n\nOpening question\n${v.question.trim()}\n\nConfirm during the call\n• Success criteria and pilot scope\n• Constraints and timeline\n• Decision process and next-step owner${v.note.trim()?`\n\nPreparation note\n${v.note.trim()}`:''}`;
  r.events.push('Prepared meeting brief with questions and open items.');r.done=true;r.stage=2;
 }
 return true;
}

const $=id=>document.getElementById(id);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shapes=[
['Ordinary task, impossible snag','Give the viewpoint character a small, clear goal. Let one impossible detail obstruct it. End with a choice to investigate.','Someone tries to buy a snack. The machine wants payment in secrets.'],
['Two people, one disagreement','Begin with a concrete disagreement. An interruption forces cooperation. End with a practical decision; friendship can stay unsettled.','Two kids disagree over the route. Both maps suddenly change.'],
['A rule gets tested','Show a rule through action. Give someone a reason to bend it. Let the immediate consequence introduce the mystery.','A sign says never answer the third knock. Someone needs help outside.'],
['A small favor goes sideways','Someone asks for a manageable favor. The attempt reveals a complication. End with a new question.','Return a borrowed umbrella. It refuses to enter its owner’s house.'],
['A clue nobody else values','Show an overlooked detail. Let a character’s interest make it meaningful. One small test produces a surprising result.','Every receipt has the same impossible time printed on it.'],
['Arrival with a mismatch','Arrive somewhere with a specific expectation. Find one thing that doesn’t fit. Make a child act on the discrepancy.','The welcome desk has already checked them out.'],
['An embarrassing interruption','Start with a recognizably awkward moment. Interrupt it with something strange. Let the embarrassment influence the first response.','An attempted introduction is interrupted by a voice from a locked bag.'],
['Try, fail, notice','Attempt a small solution. Let it fail for an observable reason. Use that failure to discover one useful thing.','A door won’t open. Knocking makes the handle move to a different wall.']
];
const sentences=[['Action first','Start with a concrete action, then one surprising consequence.','Sam caught the coin before it could scream.'],['Dialogue first','Open with a short line that creates an immediate question.','“Please tell me that’s your tail.”'],['Specific oddity','Name a concrete thing, then show what’s wrong with it.','The elevator had grown an extra button.'],['A small want','State what the character wants, then give the obstacle.','Hudson wanted his change. The cashier wanted a year of his life.'],['A confident mistake','Let a confident statement meet visible contradiction.','Izumi knew exactly where they were. The street disagreed.'],['An inconvenient rule','Give one unusual rule and imply the trouble it’ll cause.','Nobody had told them the fountain could file complaints.'],['A sensory clue','Begin with a specific sound, smell, or texture that matters to the action.','Something inside the suitcase sneezed.'],['Free choice','Use whichever opening fits the chapter.','No sentence constraint.']];
let selected=[],journalDate='',shape=0;
let wordBag=[], wordIndex=-1;
function wordRoll(){
 if(!wordBag.length){wordBag=vocabulary.map((_,i)=>i);for(let i=wordBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[wordBag[i],wordBag[j]]=[wordBag[j],wordBag[i]]}if(wordBag[wordBag.length-1]===wordIndex&&wordBag.length>1){[wordBag[0],wordBag[wordBag.length-1]]=[wordBag[wordBag.length-1],wordBag[0]]}}
 wordIndex=wordBag.pop();const [word,pos,meaning]=vocabulary[wordIndex];$('wordResult').textContent=word;$('wordDefinition').textContent=pos+' — '+meaning;invalidate();
}
$('wordCount').textContent=vocabulary.length;
$('wordRoll').onclick=wordRoll;
$('to').value=new Date().toLocaleDateString('en-CA'); // replaced below with stable local ISO
const now=new Date();$('to').value=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
$('manual').innerHTML=characters.map((c,i)=>`<label class="check"><input type="checkbox" value="${i}">${c.name}</label>`).join('');
$('sentenceChoice').innerHTML=sentences.map((s,i)=>`<option value="${i}">${s[0]}</option>`).join('');
const typeGroups=[...new Set(sentenceTypes.map(t=>t[0]))];
$('sentenceType').innerHTML=typeGroups.map(group=>`<optgroup label="${group}">${sentenceTypes.map((t,i)=>t[0]===group?`<option value="${i}">${t[1]}</option>`:'').join('')}</optgroup>`).join('');
$('sentenceFunction').innerHTML=sentenceFunctions.map((f,i)=>`<option value="${i}">${f[0]}</option>`).join('');
$('sentenceBankCount').textContent=sentenceTypes.length+' sentence options · '+sentenceFunctions.length+' information categories';
const customPovWeights=new Map();
function currentPov(){const value=Number($('pov').value);return selected.includes(value)?value:(selected[0]??0)}
function activeWeights(){return customPovWeights.get(currentPov())||povProfiles[currentPov()].weights}
function weightPercent(index){const w=activeWeights();return 100*w[index]/w.reduce((a,b)=>a+b,0)}
function updateWeightSummary(){
 const id=currentPov(),w=activeWeights(),total=w.reduce((a,b)=>a+b,0);
 $('povActive').textContent=selected.length?'Writing from '+characters[id].name+'’s perspective.':'Choose a POV to add a character to this scene.';
 $('weightTitle').textContent=characters[id].name+' · '+(customPovWeights.has(id)?'custom mix':'proposed mix');
 const pct=indices=>(100*indices.reduce((n,i)=>n+w[i],0)/total).toFixed(1)+'%';
 $('weightSummary').textContent='Spoken dialogue '+pct([5])+' · Internal dialogue '+pct([6])+' · Setting & sensory observation '+pct([0,7])+' · Other '+pct([1,2,3,4,8,9,10,11,12,13,14,15]);
 $('weightReason').textContent=povProfiles[id].reason+' Sentence structures are also weighted: common forms dominate, with modest POV-specific variations. Consecutive dialogue rolls are allowed.';
 w.forEach((_,i)=>$('weightPct'+i).textContent=weightPercent(i).toFixed(1)+'%');
}
function renderWeightControls(){
 $('weightControls').innerHTML='';activeWeights().forEach((weight,i)=>{
 const row=document.createElement('div');row.className='weight-row';
 const label=document.createElement('label');label.htmlFor='weight'+i;label.textContent=sentenceFunctions[i][0];
 const input=document.createElement('input');input.id='weight'+i;input.type='number';input.min='0';input.max='100';input.step='1';input.value=weight;
 input.onchange=()=>{const n=Number(input.value),w=[...activeWeights()];
 if(input.value===''||!Number.isFinite(n)||n<0||n>100||!Number.isInteger(n)){input.value=activeWeights()[i];$('weightError').textContent='Use a whole-number weight from 0 to 100.';return}
 w[i]=n;if(w.every(x=>x===0)){input.value=activeWeights()[i];$('weightError').textContent='At least one category needs a positive weight.';return}
 customPovWeights.set(currentPov(),w);$('weightError').textContent='';updateWeightSummary();invalidate();};
 const output=document.createElement('output');output.id='weightPct'+i;output.setAttribute('for','weight'+i);row.append(label,input,output);$('weightControls').append(row);
 });$('weightError').textContent='';updateWeightSummary();
}
function weightedDraw(weights,random=Math.random){const total=weights.reduce((a,b)=>a+b,0);if(!(total>0))throw Error('At least one positive weight is required.');let target=random()*total;for(let i=0;i<weights.length;i++){target-=weights[i];if(target<0)return i}return weights.findLastIndex(x=>x>0)}
function activeTypeWeights(){const id=currentPov();return commonTypeWeights.map((w,i)=>w*(povTypeBoosts[id][i]||1))}
$('pov').onchange=()=>{const id=Number($('pov').value);if(!selected.includes(id))selected.push(id);castRender()};
$('resetWeights').onclick=()=>{customPovWeights.delete(currentPov());renderWeightControls();relationRender();invalidate()};
function weightInstruction(){return 'POV WEIGHTING (craft settings, not canon or fixed chapter quotas)\n'+characters[currentPov()].name+': '+activeWeights().map((_,i)=>sentenceFunctions[i][0]+' '+weightPercent(i).toFixed(1)+'%').join('; ')+'.\n'+povProfiles[currentPov()].reason+' Common grammatical constructions are more likely than marked rhetorical patterns; POV-specific boosts influence type rolls. Dialogue rolls can repeat so exchanges can develop. Spoken lines can come from any present character; keep each speaker’s own voice. Internal dialogue stays with the POV. Apply the scene’s actual social situation: a solitary character needn’t talk aloud just to satisfy the bias. These are adjustable authoring preferences, not new personality facts. For sentence-by-sentence drafting, preserve the brief and immediate causality across rolls; flag unsuitable combinations instead of forcing them.'}

function sentenceRender(){
 const t=sentenceTypes[Number($('sentenceType').value)],f=sentenceFunctions[Number($('sentenceFunction').value)];
 $('typeName').textContent=t[1];$('typeExplanation').textContent=t[2];$('typeExample').textContent='Invented example: '+t[3];$('functionExplanation').textContent=f[1];invalidate();
}
function typeRoll(){$('sentenceType').value=weightedDraw(activeTypeWeights());sentenceRender()}
function functionRoll(){$('sentenceFunction').value=weightedDraw(activeWeights());sentenceRender()}
function sentenceRoll(){$('sentenceType').value=weightedDraw(activeTypeWeights());$('sentenceFunction').value=weightedDraw(activeWeights());sentenceRender()}
$('typeRoll').onclick=typeRoll;$('functionRoll').onclick=functionRoll;$('sentenceRoll').onclick=sentenceRoll;
$('sentenceType').onchange=sentenceRender;$('sentenceFunction').onchange=sentenceRender;
function sentenceInstruction(){const t=sentenceTypes[Number($('sentenceType').value)],f=sentenceFunctions[Number($('sentenceFunction').value)];return `SENTENCE-LEVEL INGREDIENT\n${weightInstruction()}\n\nType: ${t[1]} (${t[0]}). ${t[2]}\nInformation conveyed: ${f[0]}. ${f[1]}\nWrite one natural sentence somewhere in this chapter combining these choices. This is separate from the opening-sentence pattern; it needn't be the opener or contain the vocabulary word. These options mix grammatical structures, communicative purposes, and stylistic patterns, so they can overlap. Keep the chosen information category accurate: direct inner dialogue differs from narrated emotion, and outward behavior differs from an involuntary bodily response. Questions or commands in narration can be focalized through the viewpoint when that fits; don't turn narration into spoken dialogue just to fit the form. If this pairing can't work naturally in the requested scene, flag it for Keith rather than forcing it or silently replacing it. Across the remaining prose, vary sentence length, clause structure, openings, and information according to scene needs. Don't repeat this pattern throughout the chapter, cycle mechanically through categories, or insert labels into the story. Don't copy illustrative examples into canon. After the prose, add an author-only sentence check quoting the chosen sentence and naming its type and information category.`}

function castRender(){const old=$('pov').value;$('cast').innerHTML=selected.map(i=>`<span class="chip">${characters[i].name}</span>`).join('');$('pov').innerHTML=characters.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('');if(selected.includes(Number(old)))$('pov').value=old;else if(selected.length)$('pov').value=String(selected[0]);document.querySelectorAll('#manual input').forEach(el=>el.checked=selected.includes(Number(el.value)));$('facts').innerHTML='';selected.forEach(i=>{const h=document.createElement('h3');h.textContent=characters[i].name;const p=document.createElement('p');p.className='help';p.textContent=characters[i].summary;$('facts').append(h,p)});renderWeightControls();relationRender();invalidate()}
function castRoll(){let pool=[0,1,2,3,4];for(let i=4;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}const n=$('count').value==='random'?1+Math.floor(Math.random()*5):Number($('count').value);selected=pool.slice(0,n);castRender()}
function dateRoll(){const a=Date.parse($('from').value+'T00:00:00Z'),b=Date.parse($('to').value+'T00:00:00Z');if(!Number.isFinite(a)||!Number.isFinite(b)||a>b){$('status').textContent='Choose a valid date range with From before Through.';return false}journalDate=new Date(a+Math.floor(Math.random()*((b-a)/86400000+1))*86400000).toISOString().slice(0,10);$('dateResult').textContent=new Date(journalDate+'T12:00:00Z').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});invalidate();return true}
function shapeRender(){$('shape').innerHTML=`<strong>${shapes[shape][0]}</strong><p>${shapes[shape][1]}</p><small>Invented example: ${shapes[shape][2]}</small>`;const s=sentences[Number($('sentenceChoice').value)];$('sentenceHelp').textContent=s[1]+' Example: '+s[2];invalidate()}
function shapeRoll(){shape=Math.floor(Math.random()*shapes.length);$('sentenceChoice').value=Math.floor(Math.random()*sentences.length);shapeRender()}
function invalidate(){$('preview').hidden=true;$('status').textContent='';$('sentenceCopyStatus').textContent='';$('sentenceCopyFallback').hidden=true}
function relationActor(){return $('relationFrom').value==='pov'?currentPov():Number($('relationFrom').value)}
function relationTarget(){return $('relationTo').value==='other'?null:Number($('relationTo').value)}
function relationAllowed(i){return relationShades[i][1]!=='Peer crush'||(relationActor()<4&&relationTarget()!==null&&relationTarget()<4)}
function relationRender(){
 const from=relationActor();
 $('relationTo').innerHTML=characters.map((c,i)=>`<option value="${i}" ${i===from?'disabled':''}>${c.name}</option>`).join('')+'<option value="other">Other character</option>';
 const previous=relationTargetValue;
 $('relationTo').value=previous==='other'?'other':String(Number(previous)===from?(from+1)%characters.length:Number(previous));
 relationTargetValue=$('relationTo').value;
 $('relationOther').disabled=relationTarget()!==null;
 const old=$('relationShade').value;
 $('relationShade').innerHTML='<option value="">Choose an emotional shade</option>'+[...new Set(relationShades.map(r=>r[0]))].map(g=>`<optgroup label="${g}">${relationShades.map((r,i)=>r[0]===g?`<option value="${i}" ${relationAllowed(i)?'':'disabled'}>${r[1]}</option>`:'').join('')}</optgroup>`).join('');
 $('relationShade').value=old!==''&&relationAllowed(Number(old))?old:'';
 const has=$('relationShade').value!=='';const r=has?relationShades[Number($('relationShade').value)]:null;
 const target=relationTarget()===null?($('relationOther').value.trim()||'another character'):characters[relationTarget()].name;
 $('relationHeading').textContent=characters[from].name+' → '+target;
 $('relationMeaning').textContent=r?r[1]+': '+r[2]:'Select a feeling or roll for a suggestion.';
 $('relationCue').textContent=r?'Possible expression: '+r[3]:'';
 $('relationPerspective').textContent=from===currentPov()?'This is the POV character’s reaction.':'The POV stays with '+characters[currentPov()].name+'. Show this other character’s reaction through observable behavior or dialogue; their private thoughts remain unknown.';
 $('relationStatus').textContent='';$('relationFallback').hidden=true;invalidate();
}
function relationRoll(){const pool=relationShades.map((_,i)=>i).filter(relationAllowed);const old=Number($('relationShade').value);const choices=pool.filter(i=>$('relationShade').value===''||i!==old);$('relationShade').value=pick(choices);relationRender()}
function relationText(){
 if($('relationShade').value==='')throw Error('Choose or roll an emotional shade first.');
 if(relationTarget()===null&&!$('relationOther').value.trim())throw Error('Enter the other character’s name.');
 const r=relationShades[Number($('relationShade').value)],from=relationActor();
 if(!relationAllowed(Number($('relationShade').value)))throw Error('Choose a feeling that fits this pair.');
 const target=relationTarget()===null?$('relationOther').value.trim():characters[relationTarget()].name;
 return `Character relation: ${characters[from].name} → ${target}\nEmotional shade: ${r[1]}. ${r[2]}\nPossible expression: ${r[3]}\nTreat this as a momentary prompt, not established canon.${from!==currentPov()?' Keep '+characters[currentPov()].name+'’s POV; convey the other character’s reaction through observable cues, without asserting private thoughts.':''}`;
}
let relationTargetValue='1';
$('relationFrom').innerHTML='<option value="pov">Current POV character</option>'+characters.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('');$('relationFrom').value='pov';
$('relationFrom').onchange=relationRender;
$('relationTo').onchange=()=>{relationTargetValue=$('relationTo').value;relationRender()};
$('relationOther').oninput=relationRender;$('relationShade').onchange=relationRender;$('relationRoll').onclick=relationRoll;
$('copyRelation').onclick=async()=>{try{const text=relationText();try{await navigator.clipboard.writeText(text);$('relationStatus').textContent='Relation selection copied.';$('relationFallback').hidden=true}catch{$('relationFallback').value=text;$('relationFallback').hidden=false;$('relationFallback').focus();$('relationFallback').select();$('relationStatus').textContent='Automatic copying is unavailable. Copy the selected text below.'}}catch(e){$('relationStatus').textContent=e.message}};
function sentenceSelectionText(){
 if(!selected.length)throw Error('Choose a Character POV first.');
 const t=sentenceTypes[Number($('sentenceType').value)],f=sentenceFunctions[Number($('sentenceFunction').value)];
 return `Character POV: ${characters[currentPov()].name}\nSentence type: ${t[1]} (${t[0]}). ${t[2]}\nInformation conveyed: ${f[0]}. ${f[1]}${$('includeRelation').checked?'\n\n'+relationText():''}`;
}
function brief(){
 if(!selected.length)throw Error('Choose at least one main character.');
 if(!$('chapter').checkValidity()||!$('length').checkValidity())throw Error('Enter a valid chapter number and word count.');
 const opening=sentences[Number($('sentenceChoice').value)],ending=sceneEndings[Number($('sceneEnder').value)],word=vocabulary[wordIndex];
 const lines=[`DOARKS — CHAPTER ${$('chapter').value} · SHORT BRIEF`,
 `Target length: approximately ${$('length').value} words.`,
 `POV: close third person through ${characters[currentPov()].name}.`,
 `Cast: ${selected.map(i=>characters[i].name).join(', ')}.`,
 `Journal inspiration date: ${journalDate} (source prompt, not the story date).`];
 for(const [id,label] of [['journal','Detail to borrow'],['spinner','Story Spinner elements'],['notes','Chapter action / setting'],['continuity','Approved continuity']]){const value=$(id).value.trim();if(value)lines.push(label+': '+value)}
 lines.push(`Scene shape: ${shapes[shape][0]}. ${shapes[shape][1]}`,
 `Opening pattern: ${opening[0]}. ${opening[1]}`,
 `Scene ender: ${ending[1]}. ${ending[2]}`);
 if($('stop').value.trim())lines.push('Required stopping point (takes priority): '+$('stop').value.trim());
 lines.push(`Vocabulary: ${word[0]} (${word[1]}) — ${word[2]}. Use naturally with a context clue.`,
 'Current sentence selection:\n'+sentenceSelectionText(),
 'Workflow: Draft only the next sentence from the supplied selection, then wait for feedback. Build toward the chapter target one approved sentence at a time. Follow the existing DOARKS profiles and approved continuity; don’t invent missing canon.');
 return lines.join('\n\n');
}
$('castRoll').onclick=castRoll;$('dateRoll').onclick=dateRoll;$('shapeRoll').onclick=shapeRoll;$('sentenceChoice').onchange=shapeRender;$('all').onclick=()=>{if(dateRoll()){castRoll();shapeRoll();wordRoll();sentenceRoll();enderRoll();relationRoll()}};
document.querySelectorAll('#manual input').forEach(el=>el.onchange=()=>{selected=[...document.querySelectorAll('#manual input:checked')].map(x=>Number(x.value));castRender()});
document.querySelectorAll('textarea,input,select').forEach(el=>el.addEventListener('input',invalidate));
$('show').onclick=()=>{try{$('preview').textContent=brief();$('preview').hidden=false}catch(e){$('status').textContent=e.message}};
$('copy').onclick=async()=>{try{const text=brief();try{await navigator.clipboard.writeText(text);$('status').textContent='Chapter brief copied. Paste it into our chat.'}catch{ $('preview').textContent=text;$('preview').hidden=false;const r=document.createRange();r.selectNodeContents($('preview'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(r);$('status').textContent='Automatic copying is unavailable. The brief is selected—copy it manually.'}}catch(e){$('status').textContent=e.message}};

$('sceneEnder').innerHTML=[...new Set(sceneEndings.map(e=>e[0]))].map(group=>`<optgroup label="${group}">${sceneEndings.map((e,i)=>e[0]===group?`<option value="${i}">${e[1]}</option>`:'').join('')}</optgroup>`).join('');
function enderRender(){const e=sceneEndings[Number($('sceneEnder').value)];$('enderName').textContent=e[1];$('enderDescription').textContent=e[2];$('enderExample').textContent='Invented example: '+e[3];invalidate()}
function enderRoll(){const old=Number($('sceneEnder').value)||0;$('sceneEnder').value=(old+1+Math.floor(Math.random()*(sceneEndings.length-1)))%sceneEndings.length;enderRender()}
$('enderRoll').onclick=enderRoll;$('sceneEnder').onchange=enderRender;
$('copySentence').onclick=async()=>{try{const text=sentenceSelectionText();try{await navigator.clipboard.writeText(text);$('sentenceCopyFallback').hidden=true;$('sentenceCopyStatus').textContent='Sentence selection copied.'}catch{$('sentenceCopyFallback').value=text;$('sentenceCopyFallback').hidden=false;$('sentenceCopyFallback').focus();$('sentenceCopyFallback').select();$('sentenceCopyStatus').textContent='Select and copy the text below; automatic copying is unavailable.'}}catch(e){$('sentenceCopyStatus').textContent=e.message}};
castRoll();dateRoll();shapeRoll();wordRoll();sentenceRoll();enderRoll();relationRender();

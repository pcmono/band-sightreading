import {test} from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';

function mockElement(id){
  const options=id==='instrument'?['concert','clarinet','trumpet','alto','bass','mallets']:id==='level'?['1','2','3','4','5','6','7','8']:id==='measures'?['4','8']:[];
  return {value:id==='mode'?'class':id==='level'?'1':id==='measures'?'4':id==='instrument'?'concert':'68',options:options.map(value=>({value})),hidden:false,disabled:false,textContent:'',innerHTML:'',events:{},attributes:{},classList:{toggle(){return false},remove(){}},addEventListener(type,fn){this.events[type]=fn},setAttribute(key,value){this.attributes[key]=value}};
}
const ids='mode instrument level measures tempo-slider tempo-value scores proceed replay new-exercise copy-link exercise-number score-title status score-area theme instrument-wrap tempo-wrap play-along tracker metro'.split(' ');
const nodes=Object.fromEntries(ids.map(id=>[id,mockElement(id)]));
globalThis.document={getElementById:id=>nodes[id],body:{classList:{toggle(){return false},remove(){}}},querySelectorAll:()=>[]};
globalThis.localStorage={getItem:()=>null,setItem(){}};
globalThis.location={search:'?view=single&instrument=alto&level=7&measures=8',href:'https://example.org/'};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{async writeText(value){globalThis.copiedLink=value}}}});
await import('../app.js');

test('student link opens the chosen part and level',()=>{
  assert.equal(nodes.mode.value,'single');assert.equal(nodes.instrument.value,'alto');assert.equal(nodes.level.value,'7');assert.equal(nodes.measures.value,'8');
  assert.equal(nodes.scores.innerHTML.match(/class="part"/g)?.length,1);
  assert.equal(nodes['tempo-wrap'].hidden,false);assert.equal(nodes['new-exercise'].hidden,true);
});
test('class view shows six parts, no tempo slider, all eight bars in each line',()=>{
  nodes.mode.value='class';nodes.mode.onchange();assert.equal(nodes['tempo-wrap'].hidden,true);assert.equal(nodes['new-exercise'].hidden,false);
  assert.equal(nodes.scores.innerHTML.match(/class="part"/g)?.length,6);
  assert.equal(nodes.scores.innerHTML.match(/viewBox="0 0 2300 170"/g)?.length,6);
  assert.equal(nodes.scores.innerHTML.match(/class="bar"/g)?.length,48);
});
test('new exercise bypasses playback and leaves the score ready',()=>{
  const prior=nodes['exercise-number'].textContent;nodes['new-exercise'].onclick();assert.notEqual(nodes['exercise-number'].textContent,prior);
  assert.equal(nodes.proceed.textContent,'Hear this exercise');assert.equal(nodes.status.textContent,'Ready to read');
});
test('no courtesy accidentals in Levels 7 and 8',()=>{
  for(const level of ['7','8']){nodes.level.value=level;nodes.level.onchange();assert.doesNotMatch(nodes.scores.innerHTML,/data-accidental=/)}
});
test('copy student link includes the selected settings',async()=>{
  nodes.mode.value='single';nodes.mode.onchange();await nodes['copy-link'].onclick();
  const url=new URL(globalThis.copiedLink);assert.equal(url.searchParams.get('instrument'),'alto');assert.equal(url.searchParams.get('level'),'8');
});
test('courtesy marks remain inside their own bars',()=>{
  nodes.measures.value='8';
  for(const level of ['1','2','3','4','5','6']){
    nodes.level.value=level;
    for(let sample=0;sample<30;sample++){
      nodes.level.onchange();
      for(const [,barText,xText] of nodes.scores.innerHTML.matchAll(/data-accidental="(?:flat|sharp)" data-measure="(\d+)" d="M ([\d.]+)/g)){
        const bar=Number(barText),left=Number(xText),begin=195+bar*260;
        assert.ok(left>=begin&&left<begin+260,`Accidental outside measure ${bar+1}`);
      }
    }
  }
});
test('tempo range and tracker default match classroom controls',()=>{
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html,/id="tempo-slider"[^>]*min="48" max="172" value="68"/);
  assert.equal(nodes.tracker.attributes['aria-pressed'],undefined);
  assert.match(html,/id="tracker" hidden aria-pressed="true"/);
});

import {SCALES, LEVELS, generate, midi, stavePosition} from './core.mjs';

function assert(condition,message){if(!condition)throw new Error(message)}
function seeded(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}}
export const checks=[
  ['Instrument scale and registers',()=>{
    assert(Object.keys(SCALES).length===6,'Six instrument parts required');
    assert(SCALES.concert.join()==='Bb4,C5,D5,Eb5,F5,G5,A5,Bb5','Concert scale differs');
    assert(SCALES.clarinet.join()==='C4,D4,E4,F4,G4,A4,B3,C4','Clarinet break constraint differs');
    assert(SCALES.mallets.every((note,i)=>midi(note)===midi(SCALES.concert[i])-12),'Mallet octave differs');
    for(let i=0;i<8;i++){
      assert((midi(SCALES.trumpet[i])-midi(SCALES.concert[i])+120)%12===2,'B-flat transposition differs');
      assert((midi(SCALES.alto[i])-midi(SCALES.concert[i])+120)%12===9,'E-flat transposition differs');
      assert(midi(SCALES.bass[i])===midi(SCALES.concert[i])-24,'Bass register differs');
    }
  }],
  ['Staff positions',()=>{
    assert(stavePosition('E4','treble')===0,'Treble reference differs');
    assert(stavePosition('G2','bass')===0,'Bass reference differs');
    assert(stavePosition('Bb4','treble')===4,'B-flat position differs');
    assert(stavePosition('F#5','treble')===8,'Sharp position differs');
  }],
  ['Level rules and exact measure lengths',()=>{
    for(let level=1;level<=8;level++)for(const count of [4,8])for(let seed=1;seed<=100;seed++){
      const bars=generate(level,count,seeded(seed));const cfg=LEVELS[level];
      assert(bars.length===count,'Incorrect measure count');
      for(const bar of bars){
        assert(bar.reduce((sum,e)=>sum+e.duration,0)===4,'Measure is not four beats');
        for(let i=0,beat=0;i<bar.length;i++){
          const e=bar[i];assert(e.index>=0&&e.index<cfg.notes,'Pitch outside level range');
          assert(cfg.rests||e.kind!=='rest','Rest at disallowed level');
          assert(cfg.expression||(e.accent===false&&e.staccato===false),'Expression at disallowed level');
          if(e.kind==='eighth'){
            assert(cfg.eighths,'Eighth at disallowed level');
            assert(e.duration===.5,'Eighth duration differs');
            if(e.pair==='start'){assert(Number.isInteger(beat),'Pair starts off the beat');assert(bar[i+1]?.pair==='end','Pair missing second eighth')}
            if(e.pair==='end')assert(bar[i-1]?.pair==='start','Pair missing first eighth');
          }else assert([1,2,4].includes(e.duration),'Unsupported note duration');
          if(e.kind==='rest')assert(e.duration===1,'Only quarter rests allowed');
          beat+=e.duration;
        }
      }
    }
  }],
  ['Same seed produces the same exercise',()=>{
    assert(JSON.stringify(generate(8,8,seeded(733)))===JSON.stringify(generate(8,8,seeded(733))),'Generator is not reproducible');
  }],
  ['Unsupported settings fail clearly',()=>{
    for(const args of [[0,4],[9,4],[1,3]]){let failed=false;try{generate(...args)}catch{failed=true}assert(failed,`Unsupported settings ${args} accepted`)}
  }]
];
export function runChecks(){return checks.map(([name,fn])=>{try{fn();return {name,passed:true}}catch(error){return {name,passed:false,detail:error.message}}})}

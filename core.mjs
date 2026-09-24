// Pure music data and exercise generation; no browser or hosting dependency.
export const SCALES = Object.freeze({
  concert: ['Bb4','C5','D5','Eb5','F5','G5','A5','Bb5'],
  clarinet: ['C4','D4','E4','F4','G4','A4','B3','C4'],
  trumpet: ['C4','D4','E4','F4','G4','A4','B4','C5'],
  alto: ['G4','A4','B4','C5','D5','E5','F#5','G5'],
  bass: ['Bb2','C3','D3','Eb3','F3','G3','A3','Bb3'],
  mallets: ['Bb3','C4','D4','Eb4','F4','G4','A4','Bb4']
});
export const LEVELS = Object.freeze({
  1: {notes:3,eighths:false,rests:false,expression:false},
  2: {notes:3,eighths:true,rests:false,expression:false},
  3: {notes:3,eighths:true,rests:true,expression:false},
  4: {notes:5,eighths:false,rests:false,expression:false},
  5: {notes:5,eighths:true,rests:false,expression:false},
  6: {notes:5,eighths:true,rests:true,expression:false},
  7: {notes:8,eighths:true,rests:true,expression:false},
  8: {notes:8,eighths:true,rests:true,expression:true}
});
const semitones={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
export function midi(note){const match=/^([A-G])(b|#)?(\d)$/.exec(note);if(!match)throw new Error(`Invalid note: ${note}`);return (+match[3]+1)*12+semitones[match[1]]+(match[2]==='b'?-1:match[2]==='#'?1:0)}
export function stavePosition(note,clef){const match=/^([A-G])(?:b|#)?(\d)$/.exec(note);if(!match||!['bass','treble'].includes(clef))throw new Error('Invalid note or clef');const reference=clef==='bass'?18:30;return +match[2]*7+'CDEFGAB'.indexOf(match[1])-reference}
export function generate(level,measureCount,random=Math.random){const config=LEVELS[level];if(!config||![4,8].includes(measureCount))throw new Error('Unsupported exercise settings');const choose=items=>items[Math.floor(random()*items.length)];const bars=[];let previous=0;
  for(let measure=0;measure<measureCount;measure++){
    let beat=0;const row=[];
    while(beat<4){const remaining=4-beat;const paired=config.eighths&&remaining>=1&&row.at(-1)?.pair!=='end'&&random()<.28;
      if(paired){for(let half=0;half<2;half++){previous=Math.max(0,Math.min(config.notes-1,previous+choose([-1,0,1])));row.push({duration:.5,index:previous,kind:'eighth',pair:half===0?'start':'end',accent:false,staccato:false})}beat+=1;continue}
      const choices=[1,2,4].filter(value=>value<=remaining&&!(value===4&&row.length));const duration=choose(choices);
      const rest=config.rests&&duration===1&&row.length>0&&random()<.11;
      if(!rest)previous=Math.max(0,Math.min(config.notes-1,previous+choose([-2,-1,0,1,2])));
      row.push({duration,index:previous,kind:rest?'rest':'note',accent:config.expression&&!rest&&random()<.12,staccato:config.expression&&!rest&&random()<.1});beat+=duration;
    }
    bars.push(row);
  }
  return bars;
}

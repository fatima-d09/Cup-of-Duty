import { DRINKS, MILKS, SYR, TOP, SIZES } from './data.js'

/* shop logic */
export const DEF={drink:'latte',size:'Medium',iced:false,milk:'whole',syrups:[],tops:[]};
export const NAMES=['Maya','Theo','June','Ravi','Ines','Sam','Noor','Luca','Aiko','Dana','Priya','Marcus'];
export const rnd=a=>a[Math.floor(Math.random()*a.length)];
export const pickN=(a,n)=>[...a].sort(()=>Math.random()-.5).slice(0,n);
export const priceOf=o=>DRINKS.find(x=>x.id===o.drink).p+SIZES.find(x=>x.id===o.size).p+MILKS.find(x=>x.id===o.milk).p+o.syrups.length*.5+o.tops.length*.5;
export const lines=o=>[`${o.size} ${o.iced?'iced':'hot'} ${DRINKS.find(x=>x.id===o.drink).n}`,o.milk!=='none'&&`${MILKS.find(x=>x.id===o.milk).n} milk`,...o.syrups.map(id=>SYR.find(s=>s.id===id).n+' syrup'),...o.tops.map(id=>TOP.find(t=>t.id===id).n)].filter(Boolean);
export const jac=(a,b)=>{const u=new Set([...a,...b]);if(!u.size)return 1;return a.filter(x=>b.includes(x)).length/u.size};
export function grade(w,g){const notes=[];let p=0;
 if(w.drink===g.drink)p+=30;else notes.push('wanted a '+DRINKS.find(x=>x.id===w.drink).n.toLowerCase());
 if(w.size===g.size)p+=10;else notes.push('wrong size');
 if(w.iced===g.iced)p+=10;else notes.push(w.iced?'wanted it iced':'wanted it hot');
 if(w.milk===g.milk)p+=15;else notes.push(w.milk==='none'?'no milk please':'wanted '+MILKS.find(x=>x.id===w.milk).n.toLowerCase()+' milk');
 const sj=jac(w.syrups,g.syrups);p+=15*sj;if(sj<1)notes.push('syrup was off');
 const tj=jac(w.tops,g.tops);p+=20*tj;if(tj<1)notes.push('toppings were off');
 return{pct:Math.round(p),notes}}
export const stars=p=>p>=95?3:p>=75?2:p>=50?1:0;
export const REACT=['Walked out unhappy.','Not quite right…','Pretty good, thanks!','Perfect. Thank you!'];
export const LS='littlecafe_runs_v2';
export const load=()=>{try{return JSON.parse(localStorage.getItem(LS))||[]}catch(e){return[]}};
export const store=r=>{try{localStorage.setItem(LS,JSON.stringify(r))}catch(e){}};

export function mk(id,used,n){
 const drink=rnd(DRINKS).id;
 const o={drink,size:rnd(SIZES).id,iced:drink==='cold'||Math.random()<.45,milk:Math.random()<.2?'none':rnd(MILKS.slice(1)).id,syrups:pickN(SYR.map(x=>x.id),Math.floor(Math.random()*3)),tops:pickN(TOP.map(x=>x.id),Math.floor(Math.random()*3))};
 const rush=n>=2&&Math.random()<Math.min(.35,.14+n*.012);
 const base=(50+(o.syrups.length+o.tops.length+(o.milk!=='none'?1:0))*10)*Math.max(.6,1-n*.015);
 const max=Math.round(rush?Math.max(20,base*.5):base);
 return{id,o,rush,name:rnd(NAMES.filter(x=>!used.includes(x))),face:Math.floor(Math.random()*20),left:max,max}}
export function tick(s,dt){
 if(s.ph!=='play'||s.fb||s.paused)return s;
 let t=s.t.map(x=>({...x,left:x.left-dt}));
 const lost=t.filter(x=>x.left<=0);t=t.filter(x=>x.left>0);
 let n=s.n,next=s.next-dt,hearts=s.hearts,done=s.done,streak=s.streak;
 let toast=s.toast&&s.toast.left-dt>0?{...s.toast,left:s.toast.left-dt}:null;
 if(lost.length){hearts-=lost.length;streak=0;done=[...done,...lost.map(x=>({name:x.name,pct:0,late:true}))];toast={text:lost[0].name+' walked out!',left:3}}
 if(hearts<=0)return{...s,hearts:0,t:[],done,streak,ph:'done',toast:null};
 if(t.length<(n<8?3:4)&&(next<=0||!t.length)){const x=mk(n,t.map(q=>q.name),n);
  if(x.rush){t.unshift(x);toast={text:'Rush order! '+x.name+' wants it now.',left:3.5}}else t.push(x);
  n++;next=Math.max(5,12-n*.3)+Math.random()*5}
 return{...s,t,n,next,done,hearts,streak,toast,sel:t.some(x=>x.id===s.sel)?s.sel:(t[0]?t[0].id:null)}}
export const INIT={ph:'idle',t:[],n:0,next:0,done:[],profit:0,hearts:3,sel:null,fb:null,streak:0,bs:0,times:[],fast:null,paused:false,toast:null};

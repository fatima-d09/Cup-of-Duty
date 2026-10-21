import { useState, useEffect, useRef } from 'react'
import Cup from './Cup.jsx'
import Face from './Face.jsx'
import Board from './Board.jsx'
import { DRINKS, MILKS, SYR, TOP, SIZES, TEMPS } from './data.js'
import { DEF, priceOf, lines, grade, stars, REACT, load, store, mk, tick, INIT } from './game.js'

const Pick=({items,val,on,multi,sw})=><div className="pk">{items.map(it=>{const a=multi?val.includes(it.id):val===it.id;return <button key={it.id} className={a?'on':''} onClick={()=>on(it.id)}>{sw&&<s style={{background:it.c}}/>}{it.n}</button>})}</div>;
const CATS=[['drink','Drink'],['cup','Cup'],['milk','Milk'],['syrup','Syrup'],['top','Toppings']];

export default function Shop(){
 const [s,setS]=useState(INIT),[o,setO]=useState(DEF),[cat,setCat]=useState('drink'),[lb,setLb]=useState(load),[last,setLast]=useState(null),[cc,setCc]=useState(false);
 const saved=useRef(true);
 const set=(k,v)=>setO(p=>({...p,[k]:v}));
 const tog=(k,id,max)=>setO(p=>{const a=p[k];return{...p,[k]:a.includes(id)?a.filter(x=>x!==id):[...a,id].slice(-max)}});
 useEffect(()=>{const id=setInterval(()=>{if(!document.hidden)setS(p=>tick(p,.25))},250);return()=>clearInterval(id)},[]);
 useEffect(()=>{if(s.ph==='done'&&!s.fb&&!saved.current){saved.current=true;
  const sv=s.done.filter(d=>!d.late);if(!sv.length)return;
  const run={id:Date.now(),profit:s.profit,served:sv.length,acc:Math.round(s.done.reduce((a,d)=>a+d.pct,0)/s.done.length),avgT:+(s.times.reduce((a,b)=>a+b,0)/s.times.length).toFixed(1),fast:s.fast,bs:s.bs,date:new Date().toLocaleDateString([], {month:'short',day:'numeric'})};
  const n=[...lb,run].slice(-40);setLb(n);store(n);setLast(run.id)}},[s.ph,s.fb]);
 const start=()=>{setO(DEF);setCat('drink');saved.current=false;setLast(null);const f=mk(0,[],0);setS({...INIT,ph:'play',t:[f],n:1,next:8,sel:f.id})};
 const end=()=>{setCc(false);setS(p=>({...p,ph:'done',t:[],paused:false}))};
 const askEnd=()=>{if(cc)end();else{setCc(true);setTimeout(()=>setCc(false),3000)}};
 const cur=s.t.find(x=>x.id===s.sel);
 const serve=()=>{if(!cur)return;
  const {pct,notes}=grade(cur.o,o),base=priceOf(cur.o),tip=pct>=80?base*.4*cur.left/cur.max:0,mult=cur.rush&&pct>=50?1.5:1,
   total=+((base*pct/100+tip)*mult).toFixed(2),cost=+(base*.3).toFixed(2),time=cur.max-cur.left,t=s.t.filter(q=>q.id!==cur.id),streak=pct>=75?s.streak+1:0;
  setS({...s,t,sel:t[0]?t[0].id:null,profit:+(s.profit+total-cost).toFixed(2),done:[...s.done,{name:cur.name,pct,time}],times:[...s.times,time],
   fast:pct>=90&&(s.fast==null||time<s.fast)?time:s.fast,streak,bs:Math.max(s.bs,streak),
   fb:{name:cur.name,face:cur.face,rush:cur.rush&&pct>=50,pct,notes,total,cost,tip:+(tip*mult).toFixed(2),time}});setO(DEF)};

 if(s.ph==='idle')return <div className="big"><h2>Open the shop</h2><p>Customers keep coming. Match each ticket before its timer runs out. Three walkouts and you’re closed. Watch for rush orders: they want it now, and they pay extra.</p><button className="aqua" onClick={start}>Start a shift</button><Board lb={lb} last={null}/></div>;
 if(s.ph==='done'&&!s.fb){
  const sv=s.done.filter(d=>!d.late),acc=s.done.length?Math.round(s.done.reduce((a,d)=>a+d.pct,0)/s.done.length):0,avgT=s.times.length?(s.times.reduce((a,b)=>a+b,0)/s.times.length).toFixed(1):'–';
  return <div className="big"><h2>{s.hearts<=0?'Shop’s closed':'Shift over'}</h2><p style={{margin:'0 0 4px'}}>{s.hearts<=0?'Three customers walked out.':'You closed up for the day.'}</p>
   <div style={{fontSize:30,letterSpacing:4}}>{[0,1,2].map(i=><span key={i} style={{color:i<stars(acc)?'#f0b429':'#d9d2bd'}}>★</span>)}</div>
   <div className="stat"><div><b>${s.profit.toFixed(2)}</b><span>profit</span></div><div><b>{sv.length}</b><span>served</span></div><div><b>{acc}%</b><span>accuracy</span></div><div><b>{avgT}{avgT==='–'?'':'s'}</b><span>avg time</span></div></div>
   <button className="aqua" onClick={start}>Start another shift</button><Board lb={lb} last={last}/></div>}
 if(s.paused)return <div className="big"><h2>Paused</h2><p>Timers are stopped.</p><button className="aqua" onClick={()=>setS(p=>({...p,paused:false}))}>Resume</button> <button className="gray" onClick={askEnd}>{cc?'Tap again to close':'Close shop'}</button></div>;

 const body=cat==='drink'?<Pick items={DRINKS} val={o.drink} on={v=>set('drink',v)}/>
  :cat==='cup'?<><div className="lab">Size</div><Pick items={SIZES} val={o.size} on={v=>set('size',v)}/><div className="lab">Temperature</div><Pick items={TEMPS} val={o.iced?'iced':'hot'} on={v=>set('iced',v==='iced')}/></>
  :cat==='milk'?<Pick items={MILKS} val={o.milk} on={v=>set('milk',v)}/>
  :cat==='syrup'?<><Pick items={SYR} val={o.syrups} multi sw on={id=>tog('syrups',id,2)}/><div className="lab">Pick up to two</div></>
  :<Pick items={TOP} val={o.tops} multi on={id=>tog('tops',id,6)}/>;
 return <div className="max">
  <div className="hdr"><span className="hearts">{[0,1,2].map(i=><span key={i} style={{color:i<s.hearts?'#d9342b':'#c9c0ad'}}>♥</span>)}</span>
   <span>Streak {s.streak}</span><span>Profit ${s.profit.toFixed(2)}</span>
   <span><button className="gray sm" disabled={!!s.fb} onClick={()=>setS(p=>({...p,paused:true}))}>Pause</button></span></div>
  <div className="toastrow">{s.toast&&<div className="toast">{s.toast.text}</div>}</div>
  <div className="rail"><div className="tix">
   {!s.t.length&&<div className="wait">Waiting for the next customer…</div>}
   {s.t.map(x=>{const f=Math.max(0,x.left/x.max);return <button key={x.id} className={'tkt '+(x.rush?'rush ':'')+(s.sel===x.id?'on':'')} onClick={()=>setS(p=>({...p,sel:x.id}))}>
    {x.rush&&<div className="rushtag">RUSH · NOW!</div>}
    <div className="th"><Face k={x.face} a={x.rush}/>{x.name}<span className={f<.25?'late':''}>{Math.ceil(x.left)}s</span></div>
    <div className="tl">{lines(x.o).map((l,i)=><div key={i}>{l}</div>)}</div>
    <div className="tm"><i style={{width:f*100+'%',background:f>.5?'#4cae4c':f>.25?'#e8b020':'#d9442f'}}/></div></button>})}
  </div></div>
  <div className="wrap">
   <div className="stage"><div className="ctr"/>
    {cur&&<div className="who"><Face k={cur.face} a={cur.rush}/>{cur.rush?'Rush: ':'For '}{cur.name}</div>}
    <div className="cupw" style={{width:240*SIZES.find(x=>x.id===o.size).s}}><Cup o={o}/></div>
    {s.fb&&<div className="fb"><Face k={s.fb.face}/><b>{s.fb.name}</b>
     <div className="stars">{[0,1,2].map(i=><span key={i} style={{color:i<stars(s.fb.pct)?'#f0b429':'#d9d2bd'}}>★</span>)}</div>
     <div>{REACT[stars(s.fb.pct)]}</div><div className="pc">{s.fb.pct}% match · {Math.round(s.fb.time)}s</div>
     {s.fb.notes.length>0&&<div className="nt">{s.fb.notes.join(' · ')}</div>}
     <div className="pay">+${s.fb.total.toFixed(2)}{s.fb.tip>0&&<small> incl. ${s.fb.tip.toFixed(2)} tip</small>}</div>
     <small>{s.fb.rush?'Rush bonus ×1.5 · ':''}ingredients −${s.fb.cost.toFixed(2)}</small>
     <button className="aqua" style={{marginTop:6}} onClick={()=>setS(p=>({...p,fb:null}))}>Next customer</button></div>}
   </div>
   <div className="panel">
    <div className="seg">{CATS.map(([id,n])=><button key={id} className={cat===id?'on':''} onClick={()=>setCat(id)}>{n}</button>)}</div>
    <div className="body2">{body}</div>
    <div className="sum">{lines(o).join(' · ')}</div>
    <div className="foot"><button className="gray" onClick={()=>setO(DEF)}>Reset cup</button><button className="aqua" disabled={!cur||!!s.fb} onClick={serve}>{cur?'Serve '+cur.name:'No customer'}</button></div>
   </div></div>
  <div style={{textAlign:'center',marginTop:12}}><button className="gray sm" disabled={!!s.fb} onClick={askEnd}>{cc?'Tap again to close shop':'Close shop'}</button></div></div>;
}

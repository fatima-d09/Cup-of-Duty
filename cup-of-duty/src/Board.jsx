import { useState } from 'react'

export default function Board({lb,last}){
 const [m,setM]=useState('profit');
 const rows=lb.filter(r=>m==='profit'||(r.served>=3&&r.avgT!=null)).sort((a,b)=>m==='profit'?b.profit-a.profit:a.avgT-b.avgT).slice(0,6);
 const fasts=lb.filter(r=>r.fast!=null).map(r=>r.fast);
 return <div className="lb"><h3>Leaderboard<div className="seg"><button className={m==='profit'?'on':''} onClick={()=>setM('profit')}>Profit</button><button className={m==='speed'?'on':''} onClick={()=>setM('speed')}>Speed</button></div></h3>
  {!rows.length?<div className="none">{m==='profit'?'No shifts yet. Be the first on the board.':'Serve at least 3 drinks in a shift to rank by speed.'}</div>:
  <table><thead><tr><th>#</th><th>{m==='profit'?'Profit':'Avg time'}</th><th>Served</th><th>Accuracy</th><th>Date</th></tr></thead><tbody>
   {rows.map((r,i)=><tr key={r.id} className={r.id===last?'me':''}><td>{i+1}</td><td>{m==='profit'?'$'+r.profit.toFixed(2):r.avgT.toFixed(1)+'s'}</td><td>{r.served}</td><td>{r.acc}%</td><td>{r.date}</td></tr>)}</tbody></table>}
  {lb.length>0&&<div className="rec"><span>Best profit ${Math.max(...lb.map(r=>r.profit)).toFixed(2)}</span><span>Fastest perfect serve {fasts.length?Math.min(...fasts).toFixed(1)+'s':'–'}</span><span>Best streak {Math.max(...lb.map(r=>r.bs))}</span><span>Most served {Math.max(...lb.map(r=>r.served))}</span></div>}
  <div className="rec"><span>Scores are saved on this device.</span></div></div>;
}

import { mix, DRINKS, MILKS, SYR, SIZES, BODY, DOTS } from './data.js'

export default function Cup({o}){
 const d=DRINKS.find(x=>x.id===o.drink),mk=MILKS.find(x=>x.id===o.milk),sz=SIZES.find(x=>x.id===o.size);
 const r=o.milk==='none'?0:d.m,coffee=o.drink==='cold'?'#2b160b':'#4a2a14';
 const top=mix(coffee,mk.c,Math.min(1,r+.3)),mid=mix(coffee,mk.c,r),bot=mix(coffee,mk.c,Math.max(0,r-.4));
 const sy=o.syrups.map(id=>SYR.find(s=>s.id===id).c),has=t=>o.tops.includes(t),w=has('whip'),ty=w?-16:0;
 const foam=o.milk!=='none'&&d.foam,art=foam&&!w&&o.drink==='latte';
 const Drz=({c,dy})=><path d="M76 58 Q88 46 100 58 T124 58 T148 58" transform={`translate(0 ${ty+dy})`} stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round"/>;
 const Tops=<g>
  {w&&[[110,56,50,13],[110,43,38,12],[110,31,25,11],[110,21,12,9]].map((e,i)=><ellipse key={i} cx={e[0]} cy={e[1]} rx={e[2]} ry={e[3]} fill="#fffdf7" stroke="#e4dac6"/>)}
  {has('cinn')&&DOTS.map(([x,y,i])=><circle key={i} cx={x} cy={y+ty} r="1.5" fill="#a0522d"/>)}
  {has('choc')&&<Drz c="#3a1e10" dy={0}/>}{has('carm')&&<Drz c="#d49230" dy={7}/>}
  {has('marsh')&&[[88,60],[104,64],[120,58],[134,63],[111,54]].map(([x,y],i)=><rect key={i} x={x-6} y={y-6+ty} width="12" height="11" rx="4" fill="#fff" stroke="#efc3d0" transform={`rotate(${i*23-30} ${x} ${y+ty})`}/>)}
  {has('sprk')&&DOTS.map(([x,y,i])=><rect key={i} x={x} y={y-2+ty} width="5" height="1.8" rx=".9" fill={['#e33','#fc2','#3b3','#29d','#e6c'][i%5]} transform={`rotate(${i*41} ${x} ${y+ty})`}/>)}
 </g>;
 return <svg width={240*sz.s} viewBox="0 0 240 230" style={{display:'block',overflow:'visible'}}>
  <defs><linearGradient id="lq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset=".45" stopColor={mid}/><stop offset="1" stopColor={bot}/></linearGradient>
   <linearGradient id="cr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9d9d9"/><stop offset=".3" stopColor="#fff"/><stop offset="1" stopColor="#c8c8c8"/></linearGradient>
   <radialGradient id="tp"><stop offset="0" stopColor={top}/><stop offset="1" stopColor={mix(top,'#000000',.35)}/></radialGradient>
   <clipPath id="cp"><path d={BODY}/></clipPath></defs>
  <ellipse cx="120" cy="214" rx="100" ry="13" fill="rgba(0,0,0,.28)"/>
  <ellipse cx="120" cy="208" rx="92" ry="12" fill="#f4f4f4" stroke="#bbb"/><ellipse cx="120" cy="206" rx="64" ry="7" fill="#e2e2e2"/>
  <g transform="translate(10 0)">
  {o.iced?<g>
   <g clipPath="url(#cp)"><rect x="40" y="76" width="140" height="140" fill="url(#lq)"/>
    {sy.map((c,i)=><rect key={i} x="40" y={193-i*14} width="140" height="14" fill={c} opacity=".85"/>)}
    {[[82,96,-12],[116,108,14],[92,140,8],[128,150,-18]].map(([x,y,a],i)=><rect key={i} x={x} y={y} width="26" height="26" rx="5" fill="rgba(255,255,255,.4)" stroke="rgba(255,255,255,.8)" transform={`rotate(${a} ${x+13} ${y+13})`}/>)}</g>
   <ellipse cx="110" cy="76" rx="57" ry="9" fill="url(#tp)"/>
   <path d="M126 -2 L116 150" stroke="#d33" strokeWidth="7"/><path d="M126 -2 L116 150" stroke="#fff" strokeWidth="7" strokeDasharray="6 8"/>
   <path d={BODY} fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.9)" strokeWidth="2"/><rect x="58" y="76" width="7" height="110" rx="3" fill="rgba(255,255,255,.4)"/>
   <ellipse cx="110" cy="64" rx="62" ry="12" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2"/>
  </g>:<g>
   <path d="M168 84 Q205 80 198 118 Q190 150 156 160" fill="none" stroke="#e8e8e8" strokeWidth="14" strokeLinecap="round"/><path d="M168 84 Q205 80 198 118 Q190 150 156 160" fill="none" stroke="#bbb" strokeWidth="1"/>
   <path d={BODY} fill="url(#cr)" stroke="#aaa"/><ellipse cx="110" cy="64" rx="62" ry="12" fill="#f2f2f2" stroke="#aaa"/>
   <ellipse cx="110" cy="65" rx="55" ry="9.5" fill="url(#tp)"/>
   {foam&&<ellipse cx="110" cy={d.foam===2?62:64} rx="52" ry={d.foam===2?10:8} fill="#f6eddc" opacity={d.foam===2?1:.85}/>}
   {sy.map((c,i)=><path key={i} d={`M${82+i*6} ${64+i*3} Q110 ${72-i*4} ${138-i*6} ${64+i*3}`} stroke={c} strokeWidth="3" fill="none" opacity=".75"/>)}
   {art&&<path d="M110 72 C95 63 100 54 110 60 C120 54 125 63 110 72Z" fill="#fbf5e8"/>}
  </g>}
  {Tops}
  {!o.iced&&<g className="steam" transform="translate(0 -6)"><path d="M92 38 q-8 -10 0 -20 t0 -18"/><path d="M112 34 q-8 -10 0 -20 t0 -18"/><path d="M132 38 q-8 -10 0 -20 t0 -18"/></g>}
  </g></svg>;
}

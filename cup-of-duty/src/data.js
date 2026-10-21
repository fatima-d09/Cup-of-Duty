export const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
export const DRINKS=[{id:'espresso',n:'Espresso',p:2.5,m:.12},{id:'americano',n:'Americano',p:3,m:.12},{id:'latte',n:'Latte',p:4,m:.65,foam:1},{id:'cappuccino',n:'Cappuccino',p:4,m:.45,foam:2},{id:'cold',n:'Cold Brew',p:4.25,m:.2}];
export const MILKS=[{id:'none',n:'No milk',c:'#ffffff',p:0},{id:'whole',n:'Whole',c:'#f5ecdc',p:0},{id:'oat',n:'Oat',c:'#ecd9b5',p:.7},{id:'almond',n:'Almond',c:'#f1e4cc',p:.7},{id:'soy',n:'Soy',c:'#efe5c6',p:.6}];
export const SYR=[{id:'vanilla',n:'Vanilla',c:'#f0d9a0'},{id:'caramel',n:'Caramel',c:'#c4801f'},{id:'hazelnut',n:'Hazelnut',c:'#8b5a2b'},{id:'mocha',n:'Mocha',c:'#4a2414'},{id:'lavender',n:'Lavender',c:'#a98bd0'},{id:'rose',n:'Rose',c:'#e58aa3'}];
export const TOP=[{id:'whip',n:'Whipped cream'},{id:'cinn',n:'Cinnamon'},{id:'choc',n:'Chocolate drizzle'},{id:'carm',n:'Caramel drizzle'},{id:'marsh',n:'Marshmallows'},{id:'sprk',n:'Sprinkles'}];
export const SIZES=[{id:'Small',n:'Small',s:.88,p:0},{id:'Medium',n:'Medium',s:1,p:.5},{id:'Large',n:'Large',s:1.12,p:1}];
export const TEMPS=[{id:'hot',n:'Hot'},{id:'iced',n:'Iced'}];
export const BODY="M48 64 L172 64 L156 196 Q155 207 145 207 L75 207 Q65 207 64 196 Z";
export const DOTS=Array.from({length:18},(_,i)=>[88+((i*37)%44),56+((i*53)%11),i]);

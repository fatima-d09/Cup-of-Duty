const SK=['#f2c9a0','#d9a273','#a8704a','#6f4730'],HR=['#2b1b10','#6b3a1a','#c9922a','#9b9b9b','#b8322a'];
const Face=({k,a})=><svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12" fill={a?'#ffc9bf':'#cfe3f5'}/><circle cx="13" cy="14" r="7" fill={SK[k%4]}/><path d="M6 13a7 7 0 0 1 14 0c-3-3-11-3-14 0z" fill={HR[(k>>2)%5]}/>
 {a?<><path d="M8 11.5l4 1.6M18 11.5l-4 1.6" stroke="#222" strokeWidth="1.2"/><circle cx="10.5" cy="14.5" r=".9" fill="#222"/><circle cx="15.5" cy="14.5" r=".9" fill="#222"/><path d="M10.5 19q2.5-2.4 5 0" stroke="#222" fill="none" strokeWidth="1"/></>
 :<><circle cx="10.5" cy="14" r=".9" fill="#222"/><circle cx="15.5" cy="14" r=".9" fill="#222"/><path d="M10.5 17q2.5 2 5 0" stroke="#222" fill="none" strokeWidth=".9"/></>}</svg>;

export default Face

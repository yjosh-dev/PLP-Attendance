import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ScatterChart, Scatter, ZAxis, Cell, Treemap,
} from "recharts";

const MONTHS      = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS        = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOURS       = Array.from({length:24},(_,i)=>`${String(i).padStart(2,"0")}:00`);
const DEPTS       = ["Engineering","Sales","HR","Marketing","Operations","Legal","Finance"];
const DEPT_COLORS = ["#10b981","#0ea5e9","#8b5cf6","#f59e0b","#f43f5e","#34d399","#38bdf8"];

function seededRand(seed) {
  let s = seed;
  return () => { s=(s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; };
}
function generateHeatmap(year,mi) {
  const rand=seededRand(year*12+mi);
  return Array.from({length:24},(_,h)=>{
    const row={hour:HOURS[h]};
    DAYS.forEach((d,di)=>{ const base=(h>=9&&h<=17)?0.7:(h>=6&&h<=21)?0.3:0.05; row[d]=Math.round((base*(di<5?1.2:0.4)+rand()*0.3)*380); });
    return row;
  });
}
function generateMonthlyTrend(year) {
  const rand=seededRand(year);
  return MONTHS.map((m,i)=>{ const s=Math.sin((i/11)*Math.PI)*15,p=Math.round(310+s+rand()*40),a=Math.round(20+rand()*25),l=Math.round(10+rand()*20); return {month:m,present:p,absent:a,late:l,rate:Math.round((p/(p+a+l))*1000)/10,target:95,productivity:Math.round(70+rand()*25)}; });
}
function generateScatter() {
  const rand=seededRand(42);
  return DEPTS.map((d,i)=>({dept:d,satisfaction:Math.round((60+rand()*38)*10)/10,attendance:Math.round((80+rand()*18)*10)/10,headcount:Math.round(30+rand()*120),lateRate:Math.round((3+rand()*15)*10)/10,color:DEPT_COLORS[i]}));
}
function generateTreemap() {
  const rand=seededRand(99);
  return DEPTS.map((d,i)=>({name:d,size:Math.round(20+rand()*150),rate:Math.round((85+rand()*13)*10)/10,color:DEPT_COLORS[i]}));
}
function generateRadar() {
  const rand=seededRand(77);
  return ["Punctuality","Attendance","Productivity","Engagement","Retention","Compliance"].map(m=>({metric:m,current:Math.round(70+rand()*28),benchmark:Math.round(75+rand()*15)}));
}
function generateForecast(trend) {
  const avg=trend.slice(-3).reduce((s,r)=>s+r.rate,0)/3;
  return Array.from({length:6},(_,i)=>({label:`+${i+1}m`,forecast:Math.round((avg+Math.sin(i)*1.5)*10)/10,lower:Math.round((avg-2-i*0.3)*10)/10,upper:Math.round((avg+2+i*0.3)*10)/10}));
}
function generateCohort() {
  const rand=seededRand(55);
  return MONTHS.slice(0,6).map((m,mi)=>{ const row={cohort:m}; for(let w=0;w<=mi;w++) row[`W${w}`]=Math.round((100-w*(8+rand()*6))*10)/10; return row; });
}
function generateDaily(year,mi) {
  const rand=seededRand(year*100+mi); const n=new Date(year,mi+1,0).getDate(); let acc=290;
  return Array.from({length:n},(_,i)=>{ acc=Math.min(370,Math.max(250,Math.round(acc+(rand()-0.5)*30))); return {day:i+1,present:acc,absent:Math.round(15+rand()*30),late:Math.round(8+rand()*18),anomaly:rand()>0.92}; });
}

const TT=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-2 text-[10px]"><p className="font-semibold text-gray-700 mb-1">{label}</p>{payload.map((p,i)=><p key={i} style={{color:p.color??p.fill??"#555"}}>{p.name}: <b>{typeof p.value==="number"?p.value.toLocaleString():p.value}</b></p>)}</div>;
};

function HeatmapGrid({data}) {
  const maxVal=useMemo(()=>{ let m=0; data.forEach(r=>DAYS.forEach(d=>{ if((r[d]??0)>m) m=r[d]; })); return m||1; },[data]);
  const color=v=>{ if(!v) return"#f8fafc"; const t=v/maxVal; return t>.8?"#047857":t>.6?"#10b981":t>.4?"#34d399":t>.2?"#6ee7b7":"#d1fae5"; };
  return (
    <div className="overflow-x-auto">
      <table className="text-[8px] border-separate" style={{borderSpacing:2}}>
        <thead><tr><th className="w-9 pr-1"></th>{DAYS.map(d=><th key={d} className="text-gray-500 font-medium text-center w-7 pb-1">{d}</th>)}</tr></thead>
        <tbody>{data.map((row,ri)=>(
          <tr key={ri}>
            <td className="text-gray-400 text-right pr-1 font-mono leading-none">{row.hour}</td>
            {DAYS.map(d=><td key={d} title={`${row.hour} ${d}: ${row[d]??0}`}><div style={{width:22,height:11,borderRadius:2,background:color(row[d])}}/></td>)}
          </tr>
        ))}</tbody>
      </table>
      <div className="flex items-center gap-1 mt-1.5">
        <span className="text-[8px] text-gray-400">Low</span>
        {["#d1fae5","#6ee7b7","#34d399","#10b981","#047857"].map(c=><div key={c} style={{width:14,height:7,borderRadius:2,background:c}}/>)}
        <span className="text-[8px] text-gray-400">High</span>
      </div>
    </div>
  );
}

function CohortTable({data}) {
  const weeks=["W0","W1","W2","W3","W4","W5"];
  const rc=v=>v===undefined?"transparent":v>=90?"#059669":v>=75?"#10b981":v>=60?"#34d399":v>=45?"#6ee7b7":"#d1fae5";
  return (
    <table className="text-[10px] w-full border-separate" style={{borderSpacing:3}}>
      <thead><tr><th className="text-gray-500 font-semibold text-left pb-1">Cohort</th>{weeks.map(w=><th key={w} className="text-gray-500 font-semibold text-center pb-1">{w}</th>)}</tr></thead>
      <tbody>{data.map(row=>(
        <tr key={row.cohort}>
          <td className="text-gray-700 font-medium pr-2">{row.cohort}</td>
          {weeks.map(w=>{ const v=row[w]; return <td key={w} style={{padding:2}}>
            {v!==undefined?<div style={{background:rc(v),borderRadius:3,padding:"2px 0",color:v>=60?"#fff":"#065f46",fontWeight:600,fontSize:9,textAlign:"center"}}>{v}%</div>
            :<div style={{background:"#f1f5f9",borderRadius:3,padding:"2px 0",color:"#cbd5e1",fontSize:9,textAlign:"center"}}>–</div>}
          </td>; })}
        </tr>
      ))}</tbody>
    </table>
  );
}

function TreeCell({x,y,width,height,name,tmData}) {
  if(width<28||height<16) return null;
  const item=tmData?.find?.(d=>d.name===name);
  return (
    <g>
      <rect x={x+1} y={y+1} width={width-2} height={height-2} rx={4} fill={item?.color??"#10b981"}/>
      {width>50&&height>22&&<text x={x+5} y={y+15} fill="#fff" fontSize={9} fontWeight={700}>{name}</text>}
      {width>50&&height>32&&<text x={x+5} y={y+26} fill="rgba(255,255,255,.8)" fontSize={8}>{item?.size}·{item?.rate}%</text>}
    </g>
  );
}

export default function AdvancedAnalyticsDashboard() {
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [mi,setMi]=useState(now.getMonth());
  const [tab,setTab]=useState("overview");

  const heatmap  = useMemo(()=>generateHeatmap(year,mi),[year,mi]);
  const trend    = useMemo(()=>generateMonthlyTrend(year),[year]);
  const scatter  = useMemo(()=>generateScatter(),[]);
  const tmData   = useMemo(()=>generateTreemap(),[]);
  const radar    = useMemo(()=>generateRadar(),[]);
  const forecast = useMemo(()=>generateForecast(trend),[trend]);
  const cohort   = useMemo(()=>generateCohort(),[]);
  const daily    = useMemo(()=>generateDaily(year,mi),[year,mi]);

  const kpis=useMemo(()=>{ const m=trend[mi]; return {rate:m.rate,present:m.present,absent:m.absent,late:m.late,productivity:m.productivity,anomalies:daily.filter(d=>d.anomaly).length}; },[trend,mi,daily]);

  const [animP,setAnimP]=useState(0);
  const [animA,setAnimA]=useState(0);
  useEffect(()=>{ const go=(end,set)=>{ let c=0,inc=end/(800/16); const t=setInterval(()=>{ c+=inc; if(c>=end){set(end);clearInterval(t);}else set(Math.floor(c)); },16); }; go(kpis.present,setAnimP); go(Math.min(400,kpis.absent),setAnimA); },[kpis.present,kpis.absent]);

  const periodLabel=`${FULL_MONTHS[mi]} ${year}`;
  const TABS=["overview","heatmap","forecast","cohort","scatter"];

  return (
    <div className="h-[98%] w-[97%] bg-gray-200 rounded-xl overflow-hidden flex flex-col shadow-xl">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="h-full min-h-0 w-full rounded-xl overflow-hidden flex flex-col shadow-xl">

        {/* header */}
        <div className="border-b border-gray-200 bg-gray-200 px-4 py-2 shrink-0">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h1 className="text-lg font-bold text-gray-800">ADVANCED ANALYTICS</h1>
              <p className="text-gray-500 text-xs">Deep-dive workforce intelligence — {periodLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-white/70 rounded-lg p-0.5 gap-0.5">
                {TABS.map(t=>(
                  <button key={t} onClick={()=>setTab(t)} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize transition-all ${tab===t?"bg-white text-gray-800 shadow-sm":"text-gray-400 hover:text-gray-600"}`}>{t}</button>
                ))}
              </div>
              <select value={mi} onChange={e=>setMi(+e.target.value)} className="text-xs font-medium text-gray-800 border border-gray-200 rounded-md px-2 py-1 bg-white">
                {FULL_MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
              </select>
              <select value={year} onChange={e=>setYear(+e.target.value)} className="text-xs font-medium text-gray-800 border border-gray-200 rounded-md px-2 py-1 bg-white">
                {[year-1,year,year+1].map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/><span className="text-gray-600 text-xs">Live</span></div>
            </div>
          </div>
        </div>

        {/* scrollable body */}
        <div className="flex-1 min-h-0 p-3 overflow-auto custom-scrollbar">

          {/* KPI strip */}
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[
              {label:"Attendance rate",val:`${kpis.rate}%`,color:"text-green-600"},
              {label:"Avg present",val:animP,color:"text-gray-800"},
              {label:"Absent (month)",val:animA,color:"text-red-500"},
              {label:"Late incidents",val:kpis.late,color:"text-amber-600"},
              {label:"Productivity",val:kpis.productivity,color:"text-violet-600"},
              {label:"Anomaly days",val:kpis.anomalies,color:"text-rose-500"},
            ].map(k=>(
              <motion.div key={k.label} whileHover={{scale:1.02}} className="bg-white rounded-lg p-2.5 shadow-md border border-gray-100 min-w-0">
                <p className="text-gray-400 text-[10px] mb-1 leading-tight">{k.label}</p>
                <p className={`text-xl font-bold ${k.color}`}>{k.val}</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {tab==="overview"&&(
              <motion.div key="ov" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Monthly attendance trend</h3>
                    <p className="text-[10px] text-gray-400 mb-2">Present area, absence & late bars, rate line vs 95% target</p>
                    <ResponsiveContainer width="100%" height={195}>
                      <ComposedChart data={trend}>
                        <defs><linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.25}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="month" fontSize={9} stroke="#ccc"/>
                        <YAxis yAxisId="l" fontSize={9} stroke="#ccc"/>
                        <YAxis yAxisId="r" orientation="right" domain={[80,100]} tickFormatter={v=>`${v}%`} fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Area yAxisId="l" dataKey="present" name="Present" fill="url(#gP)" stroke="#10b981" strokeWidth={2}/>
                        <Bar yAxisId="l" dataKey="absent" name="Absent" fill="#fda4af" radius={[2,2,0,0]}/>
                        <Bar yAxisId="l" dataKey="late" name="Late" fill="#fde68a" radius={[2,2,0,0]}/>
                        <Line yAxisId="r" dataKey="rate" name="Rate %" stroke="#0ea5e9" strokeWidth={2} dot={false}/>
                        <Line yAxisId="r" dataKey="target" name="Target" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Workforce radar</h3>
                    <p className="text-[10px] text-gray-400 mb-1">6 dimensions vs benchmark</p>
                    <ResponsiveContainer width="100%" height={195}>
                      <RadarChart data={radar}>
                        <PolarGrid stroke="#e5e7eb"/>
                        <PolarAngleAxis dataKey="metric" fontSize={8} tick={{fill:"#9ca3af"}}/>
                        <Radar name="Current" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2}/>
                        <Radar name="Benchmark" dataKey="benchmark" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2"/>
                        <Tooltip content={<TT/>}/>
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-3 justify-center">
                      {[["#10b981","Current"],["#8b5cf6","Benchmark"]].map(([c,l])=><div key={l} className="flex items-center gap-1 text-[9px] text-gray-500"><div style={{width:7,height:7,borderRadius:2,background:c}}/>{l}</div>)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Dept headcount treemap</h3>
                    <p className="text-[10px] text-gray-400 mb-1">Area = headcount · colour = dept</p>
                    <ResponsiveContainer width="100%" height={165}>
                      <Treemap data={tmData} dataKey="size" aspectRatio={4/3} isAnimationActive={false}
                        content={(props)=><TreeCell {...props} tmData={tmData}/>}/>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Daily pulse + anomaly flags</h3>
                    <p className="text-[10px] text-gray-400 mb-1">Present area · absent line · ⚠ = outlier</p>
                    <ResponsiveContainer width="100%" height={145}>
                      <ComposedChart data={daily}>
                        <defs><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="day" fontSize={8} stroke="#ccc" interval={4}/>
                        <YAxis fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Area dataKey="present" name="Present" fill="url(#gD)" stroke="#10b981" strokeWidth={1.5}/>
                        <Line dataKey="absent" name="Absent" stroke="#fb7185" strokeWidth={1.5} dot={false}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-2 mt-1 flex-wrap min-h-[16px]">
                      {daily.filter(d=>d.anomaly).map(d=><span key={d.day} className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 rounded-full px-1.5 py-0.5 font-semibold">⚠ Day {d.day}</span>)}
                      {!daily.filter(d=>d.anomaly).length&&<span className="text-[9px] text-emerald-600 font-medium">✓ No anomalies</span>}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                  <h3 className="text-gray-700 text-xs font-semibold mb-2">Department leaderboard</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {[...scatter].sort((a,b)=>b.attendance-a.attendance).map((d,rank)=>(
                      <div key={d.dept} className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-300 w-3">{rank+1}</span>
                        <span className="text-[10px] font-semibold text-gray-700 w-20 shrink-0">{d.dept}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <motion.div initial={{width:0}} animate={{width:`${d.attendance}%`}} transition={{duration:0.8,delay:rank*0.04}} style={{height:"100%",background:d.color,borderRadius:9999}}/>
                        </div>
                        <span className="text-[10px] font-bold w-9 text-right" style={{color:d.color}}>{d.attendance}%</span>
                        <span className="text-[9px] text-gray-400 w-12 text-right">{d.headcount} staff</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── HEATMAP ── */}
            {tab==="heatmap"&&(
              <motion.div key="hm" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                  <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Hourly attendance density — by day of week</h3>
                  <p className="text-[10px] text-gray-400 mb-2">Darker = more staff present at that hour</p>
                  <HeatmapGrid data={heatmap}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Peak hours (total across week)</h3>
                    <ResponsiveContainer width="100%" height={165}>
                      <ComposedChart data={heatmap.map(r=>({hour:r.hour,total:DAYS.reduce((s,d)=>s+(r[d]??0),0)}))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="hour" fontSize={7} stroke="#ccc" interval={3}/>
                        <YAxis fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Bar dataKey="total" name="Total present" radius={[2,2,0,0]}>
                          {heatmap.map((r,i)=>{ const t=DAYS.reduce((s,d)=>s+(r[d]??0),0)/(380*7); return <Cell key={i} fill={t>.6?"#047857":t>.4?"#10b981":t>.2?"#34d399":"#d1fae5"}/>; })}
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Day-of-week average</h3>
                    <ResponsiveContainer width="100%" height={165}>
                      <ComposedChart data={DAYS.map(d=>({day:d,avg:Math.round(heatmap.reduce((s,r)=>s+(r[d]??0),0)/heatmap.length)}))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="day" fontSize={10} stroke="#ccc"/>
                        <YAxis fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Bar dataKey="avg" name="Avg present" radius={[3,3,0,0]}>
                          {DAYS.map((_,i)=><Cell key={i} fill={i<5?"#10b981":"#fda4af"}/>)}
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FORECAST ── */}
            {tab==="forecast"&&(
              <motion.div key="fc" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-0.5">6-month attendance rate forecast</h3>
                    <p className="text-[10px] text-gray-400 mb-2">Shaded band = 90% confidence interval</p>
                    <ResponsiveContainer width="100%" height={225}>
                      <ComposedChart data={[...trend.slice(-4).map(m=>({label:m.month,actual:m.rate})),...forecast]}>
                        <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.12}/><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="label" fontSize={10} stroke="#ccc"/>
                        <YAxis domain={[85,100]} tickFormatter={v=>`${v}%`} fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Area dataKey="upper" name="Upper" fill="url(#gB)" stroke="none"/>
                        <Area dataKey="lower" name="Lower" fill="#fff" stroke="none"/>
                        <Line dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={2.5} dot={{r:3,fill:"#10b981"}} connectNulls/>
                        <Line dataKey="forecast" name="Forecast" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="6 3" dot={{r:3,fill:"#0ea5e9"}} connectNulls/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Forecast summary</h3>
                    <div className="space-y-2">
                      {forecast.map((f,i)=>(
                        <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-1.5 gap-2">
                          <span className="text-[10px] font-semibold text-gray-500 w-8">{f.label}</span>
                          <div className="flex flex-col items-end">
                            <span className="text-[12px] font-bold text-sky-600">{f.forecast}%</span>
                            <span className="text-[8px] text-gray-400">{f.lower}–{f.upper}%</span>
                          </div>
                          <div style={{width:32,height:5,borderRadius:3,background:"#e2e8f0",overflow:"hidden"}}>
                            <div style={{width:`${((f.forecast-85)/15)*100}%`,height:"100%",background:f.forecast>=94?"#10b981":f.forecast>=90?"#f59e0b":"#f43f5e",borderRadius:3}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                  <h3 className="text-gray-700 text-xs font-semibold mb-2">Productivity index — full year</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <ComposedChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="month" fontSize={9} stroke="#ccc"/>
                      <YAxis domain={[50,100]} fontSize={9} stroke="#ccc"/>
                      <Tooltip content={<TT/>}/>
                      <Bar dataKey="productivity" name="Productivity" radius={[3,3,0,0]}>
                        {trend.map((m,i)=><Cell key={i} fill={m.productivity>=85?"#059669":m.productivity>=75?"#10b981":m.productivity>=65?"#f59e0b":"#f43f5e"}/>)}
                      </Bar>
                      <Line dataKey="rate" name="Rate %" stroke="#8b5cf6" strokeWidth={1.5} dot={false}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* ── COHORT ── */}
            {tab==="cohort"&&(
              <motion.div key="co" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                  <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Employee retention cohort analysis</h3>
                  <p className="text-[10px] text-gray-400 mb-2">% of cohort still active each week · green = high retention</p>
                  <CohortTable data={cohort}/>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[8px] text-gray-400">Low</span>
                    {["#d1fae5","#6ee7b7","#34d399","#10b981","#059669"].map(c=><div key={c} style={{width:14,height:7,borderRadius:2,background:c}}/>)}
                    <span className="text-[8px] text-gray-400">High retention</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Week-0 cohort sizes</h3>
                    <ResponsiveContainer width="100%" height={155}>
                      <ComposedChart data={cohort.map(r=>({cohort:r.cohort,w0:r["W0"]??100}))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="cohort" fontSize={10} stroke="#ccc"/>
                        <YAxis fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Bar dataKey="w0" name="Initial %" fill="#34d399" radius={[3,3,0,0]}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Retention decay curve</h3>
                    <ResponsiveContainer width="100%" height={155}>
                      <ComposedChart data={["W0","W1","W2","W3","W4","W5"].map(w=>{ const vals=cohort.map(r=>r[w]).filter(v=>v!==undefined); return {week:w,avg:vals.length?Math.round(vals.reduce((s,v)=>s+v,0)/vals.length*10)/10:null}; })}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="week" fontSize={10} stroke="#ccc"/>
                        <YAxis domain={[0,105]} tickFormatter={v=>`${v}%`} fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Area dataKey="avg" name="Avg retention" fill="#d1fae5" stroke="#10b981" strokeWidth={2} connectNulls/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SCATTER ── */}
            {tab==="scatter"&&(
              <motion.div key="sc" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-0.5">Satisfaction vs attendance</h3>
                    <p className="text-[10px] text-gray-400 mb-1">Bubble size = headcount</p>
                    <ResponsiveContainer width="100%" height={195}>
                      <ScatterChart margin={{top:8,right:8,bottom:22,left:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="satisfaction" name="Satisfaction" type="number" domain={[55,100]} fontSize={8} stroke="#ccc" label={{value:"Satisfaction",position:"insideBottom",offset:-10,fontSize:9,fill:"#9ca3af"}}/>
                        <YAxis dataKey="attendance" name="Attendance" type="number" domain={[78,100]} fontSize={8} stroke="#ccc"/>
                        <ZAxis dataKey="headcount" range={[50,400]}/>
                        <Tooltip content={({active,payload})=>{ if(!active||!payload?.length) return null; const d=payload[0]?.payload; return <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-2 text-[10px]"><p className="font-bold">{d?.dept}</p><p>Att: {d?.attendance}%</p><p>Sat: {d?.satisfaction}%</p><p>Staff: {d?.headcount}</p></div>; }}/>
                        <Scatter data={scatter} isAnimationActive>{scatter.map((d,i)=><Cell key={i} fill={d.color} fillOpacity={0.85}/>)}</Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {scatter.map(d=><div key={d.dept} className="flex items-center gap-1 text-[9px] text-gray-500"><div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/>{d.dept}</div>)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Late rate by department</h3>
                    <ResponsiveContainer width="100%" height={195}>
                      <ComposedChart data={[...scatter].sort((a,b)=>b.lateRate-a.lateRate)} layout="vertical" margin={{left:4,right:8}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
                        <XAxis type="number" domain={[0,20]} tickFormatter={v=>`${v}%`} fontSize={9} stroke="#ccc"/>
                        <YAxis dataKey="dept" type="category" width={68} fontSize={9} stroke="#ccc"/>
                        <Tooltip content={<TT/>}/>
                        <Bar dataKey="lateRate" name="Late %" radius={[0,3,3,0]}>
                          {scatter.map((d,i)=><Cell key={i} fill={d.lateRate>12?"#f43f5e":d.lateRate>8?"#f59e0b":"#10b981"}/>)}
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <h3 className="text-gray-700 text-xs font-semibold">Department risk matrix</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-gray-50 border-b border-gray-100">
                        {["#","Department","Attendance","Satisfaction","Late %","Headcount","Risk"].map(h=><th key={h} className="text-left px-3 py-2 text-gray-500 font-semibold text-[10px]">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[...scatter].sort((a,b)=>b.attendance-a.attendance).map((d,i)=>{
                          const risk=d.attendance<85||d.lateRate>12?"High":d.attendance<92||d.lateRate>8?"Medium":"Low";
                          const rc=risk==="High"?"#fecdd3":risk==="Medium"?"#fef3c7":"#d1fae5";
                          const tc=risk==="High"?"#be123c":risk==="Medium"?"#92400e":"#065f46";
                          return (
                            <tr key={d.dept} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                              <td className="px-3 py-2 text-gray-400 text-[10px]">{i+1}</td>
                              <td className="px-3 py-2 font-semibold text-gray-800 text-[10px]"><div className="flex items-center gap-1.5"><div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/>{d.dept}</div></td>
                              <td className="px-3 py-2"><div className="flex items-center gap-1.5"><div className="w-12 bg-gray-100 rounded-full h-1.5"><div style={{width:`${d.attendance}%`,height:"100%",background:d.color,borderRadius:9999}}/></div><span className="font-bold text-[10px]" style={{color:d.color}}>{d.attendance}%</span></div></td>
                              <td className="px-3 py-2 text-gray-700 text-[10px]">{d.satisfaction}%</td>
                              <td className="px-3 py-2 text-[10px]" style={{color:d.lateRate>10?"#e11d48":"#374151"}}>{d.lateRate}%</td>
                              <td className="px-3 py-2 text-gray-700 text-[10px]">{d.headcount}</td>
                              <td className="px-3 py-2"><span style={{background:rc,color:tc,borderRadius:9999,padding:"2px 8px",fontWeight:600,fontSize:9}}>{risk}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-1.5 border-t border-gray-100 flex justify-between">
                    <span className="text-[9px] text-gray-400">{DEPTS.length} departments</span>
                    <span className="text-[9px] text-gray-400">{periodLabel}</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
  
    </div>
  );
}
import React from 'react';
import { Sparkles } from 'lucide-react';
import { ScanRecord } from '@/types/doctor';

export const ScanReportViewer = ({ scan }: { scan: ScanRecord }) => {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(true);

  const SEV: Record<string, { border: string; glow: string; text: string; bg: string }> = {
    critical: { border: '#ff5050', glow: 'rgba(255,80,80,0.4)',  text: '#ff7e7e', bg: 'rgba(255,80,80,0.08)' },
    high:     { border: '#f97316', glow: 'rgba(249,115,22,0.35)', text: '#fb923c', bg: 'rgba(249,115,22,0.08)' },
    medium:   { border: '#f59e0b', glow: 'rgba(245,158,11,0.35)', text: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
    low:      { border: '#00ffb2', glow: 'rgba(0,255,178,0.30)', text: '#34d399', bg: 'rgba(0,255,178,0.05)' },
  };
  const col = (sev: string) => SEV[sev] ?? SEV.low;
  const NUMS = ['①','②','③','④','⑤','⑥','⑦','⑧'];

  return (
    <div style={{
      background: '#1c1d26',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '1.25rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }} className="space-y-4">
      {/* Section header with expand toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-widest text-[#8c9ba5] hover:text-white transition-colors outline-none"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8c9ba5]" />
          Clinical AI Scan Annotation
        </span>
        <span className="text-zinc-500 text-[10px]">{expanded ? '▲ COLLAPSE' : '▼ EXPAND'}</span>
      </button>

      {expanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Scan image with overlaid bounding boxes */}
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={scan.imageUrl} alt="Patient scan" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', filter: 'brightness(0.7)' }} />

            {/* Scan type + confidence badges */}
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(12,12,18,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#8c9ba5', padding: '3px 9px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 800 }}>
              {scan.scanType}
            </div>
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#00ffb2', color: '#091512', padding: '3px 9px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 900 }}>
              {(scan.confidenceScore * 100).toFixed(0)}% CONFIDENCE
            </div>

            {/* Anomaly bounding boxes */}
            {scan.anomalyRegions.map((r, i) => {
              const c = col(r.severity);
              const isHov = hoveredIdx === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    position: 'absolute',
                    left: `${r.x * 100}%`, top: `${r.y * 100}%`,
                    width: `${r.width * 100}%`, height: `${r.height * 100}%`,
                    border: `1.5px dashed ${c.border}`,
                    borderRadius: 6,
                    background: isHov ? c.bg : 'transparent',
                    boxShadow: `0 0 ${isHov ? 16 : 8}px ${c.glow}`,
                    cursor: 'pointer', zIndex: 10 + i,
                    transition: 'all 0.2s'
                  }}
                  title={r.description}
                >
                  {/* Corners */}
                  {([['top','left'],['top','right'],['bottom','left'],['bottom','right']] as const).map(([v,h]) => (
                    <div key={v+h} style={{
                      position:'absolute',[v]:'-3px',[h]:'-3px',
                      width:9, height:9,
                      borderTop: v==='top' ? `1.5px solid ${c.border}` : 'none',
                      borderBottom: v==='bottom' ? `1.5px solid ${c.border}` : 'none',
                      borderLeft: h==='left' ? `1.5px solid ${c.border}` : 'none',
                      borderRight: h==='right' ? `1.5px solid ${c.border}` : 'none',
                    }}/>
                  ))}
                  {/* Index badge */}
                  <div style={{ position:'absolute', top:'-1px', left:'-1px', background:c.border, color:'#090e14', fontWeight:900, fontSize:'0.55rem', padding:'1px 4px', borderRadius:'4px 0 4px 0', lineHeight:1.4 }}>{NUMS[i] ?? i+1}</div>
                  {/* Label pill */}
                  <div style={{ position:'absolute', bottom:'100%', left:'50%', transform:'translateX(-50%) translateY(-5px)', background:'rgba(12,14,20,0.98)', border:`1px solid ${c.border}`, borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap', fontSize:'0.6rem', fontWeight:800, color:'#fff', display:'flex', alignItems:'center', gap:5, boxShadow:'0 4px 15px rgba(0,0,0,0.8)', zIndex:30, pointerEvents:'none' }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:c.border, display:'inline-block' }}/>
                    <span>{r.label}</span>
                    <span style={{ color:c.text, fontWeight:900 }}>{(r.probability*100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}

            {/* Overall impression gradient bar */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top, rgba(12,12,18,0.98) 55%, transparent)', padding: '1.25rem 0.9rem 0.75rem', fontSize:'0.7rem', color:'rgba(255,255,255,0.75)', fontStyle:'italic', lineHeight:1.4 }}>
              <span style={{ color:'#8c9ba5', fontWeight:800, fontStyle:'normal' }}>IMPRESSION: </span>
              {scan.overallImpression}
            </div>
          </div>

          {/* Differential Diagnosis probability bars */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-2">Differential Diagnoses (Confidence Level)</div>
            {[...scan.differentialDiagnoses].sort((a,b) => b.probability - a.probability).map((d, i) => {
              const pct = (d.probability * 100).toFixed(1);
              const c = d.probability > 0.6 ? '#ff5050' : d.probability > 0.3 ? '#f59e0b' : '#00ffb2';
              return (
                <div key={i} className="bg-[#12131a] rounded-lg px-4 py-2.5" style={{ border: `1px solid ${c}15` }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11.5px] font-bold text-zinc-300">{d.condition}</span>
                    <span className="text-[11px] font-extrabold font-mono" style={{ color: c }}>{pct}%</span>
                  </div>
                  <div className="h-[5px] rounded-full bg-[#1c1e28] overflow-hidden">
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${c}, ${c}aa)`, borderRadius: 3, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Region index legend */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c9ba5] mb-2">Annotated Scan Findings</div>
            {scan.anomalyRegions.map((r, i) => {
              const c = col(r.severity);
              const isHov = hoveredIdx === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all"
                  style={{ background: isHov ? c.bg : '#12131a', border: `1px solid ${isHov ? c.border : 'rgba(255,255,255,0.04)'}` }}
                >
                  <span style={{ fontSize:'1.1rem', fontWeight:950, color:c.border, minWidth:20, lineHeight:1.3, flexShrink:0 }}>{NUMS[i]??i+1}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[12px] font-extrabold text-zinc-200">{r.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black" style={{ background:`${c.border}20`, color:c.border }}>{(r.probability*100).toFixed(0)}%</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded capitalize font-black text-zinc-400 bg-zinc-800">{r.severity}</span>
                    </div>
                    <p className="text-[11px] text-[#8c9ba5] leading-relaxed m-0">{r.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

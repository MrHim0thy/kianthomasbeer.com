import type { ReactNode } from 'react';
import { Database, HeartPulse, Layers3, Wind } from 'lucide-react';
import { seasonalMonths, monthSlope, coefficientLabel } from '../../content/virginiaSeasonalModel';

// Presentational previews only. Values use the same verified helpers as Section 05.
// The atmospheric drawing remains conceptual; no geographic observations are invented.
export default function PastelHeroPanels({ children }: { children: ReactNode }) {
  return <div className="uva-pastel-composition">
    <div className="uva-pastel-orbit" aria-hidden="true" />
    <figure className="uva-preview-slopes">
      <figcaption><Layers3 size={14} aria-hidden="true" /> Documented seasonal slopes</figcaption>
      <svg viewBox="0 0 330 136" role="img" aria-label={`PM2.5 slopes from Section 05: ${seasonalMonths.map(m => `${m.month} ${coefficientLabel(monthSlope(m))}`).join(', ')}. Coefficients, not visit counts.`}>
        <line x1="191" x2="191" y1="12" y2="127" stroke="#d3d9ed" />
        {seasonalMonths.map((month, i) => {
          const slope = monthSlope(month), end = 191 + slope / .1 * 70;
          return <g key={month.month}><text x="8" y={26 + i * 29} fill="#52617a" fontSize="11">{month.month}</text><rect x={Math.min(191,end)} y={14 + i * 29} width={Math.max(1,Math.abs(end-191))} height="15" rx="4" fill={slope < 0 ? '#67cdb7' : '#a59af5'} /><text x="320" y={26 + i * 29} textAnchor="end" fill="#142344" fontSize="11">{coefficientLabel(slope)}</text></g>;
        })}
      </svg>
      <p>Section 05 preview · coefficients, not visit counts</p>
    </figure>
    <div className="uva-preview-atmosphere"><div className="uva-preview-title"><Wind size={16} aria-hidden="true" /> Atmosphere meets analysis <span>UVA / 2026</span></div>{children}</div>
    <div className="uva-preview-sources"><span className="uva-preview-icon"><Database size={19} aria-hidden="true" /></span><strong>Connected research inputs</strong><div><span>EPA</span><span>VDH</span><span>HDPulse + BLS</span></div><p>Air quality · respiratory visits · socioeconomic context</p></div>
    <div className="uva-preview-health" aria-hidden="true"><HeartPulse size={24} /></div>
  </div>;
}

// Original, code-drawn artwork: a cipher wheel set out like an engineering drawing.
// No stock images, no licences, scales to any screen.

const B = "var(--text-primary)"
const Y = "var(--accent)"
const CX = 260
const CY = 260

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const HEX = "0123456789ABCDEF".split("")

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

/** Letters set around a ring, upright toward the outside. */
function Ring({
  chars,
  radius,
  size,
  opacity = 1,
  dividers,
}: {
  chars: string[]
  radius: number
  size: number
  opacity?: number
  dividers?: [number, number]
}) {
  const step = 360 / chars.length
  return (
    <g>
      {dividers &&
        chars.map((_, i) => {
          const a = polar(dividers[0], i * step - step / 2 - 90)
          const b = polar(dividers[1], i * step - step / 2 - 90)
          return (
            <line key={`d${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={B} strokeOpacity="0.45" strokeWidth="1" />
          )
        })}
      {chars.map((c, i) => (
        <text
          key={i}
          x={CX}
          y={CY - radius + size * 0.36}
          textAnchor="middle"
          transform={`rotate(${i * step} ${CX} ${CY})`}
          fontSize={size}
          fontWeight="700"
          fill={B}
          fillOpacity={opacity}
          style={{ fontFamily: "var(--f-label), monospace" }}
        >
          {c}
        </text>
      ))}
    </g>
  )
}

function Callout({
  from,
  to,
  end,
  title,
  sub,
}: {
  from: [number, number]
  to: [number, number]
  end: number
  title: string
  sub: string
}) {
  return (
    <g className="draw-late">
      <path d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]} H${end}`} fill="none" stroke={B} strokeWidth="1" />
      <circle cx={from[0]} cy={from[1]} r="3" fill={Y} />
      <text x={to[0] + 6} y={to[1] - 9} fontSize="13" fontWeight="700" fill={B}
        style={{ fontFamily: "var(--f-label), monospace" }}>{title}</text>
      <text x={to[0] + 6} y={to[1] + 17} fontSize="11" fill={B} fillOpacity="0.8"
        style={{ fontFamily: "var(--f-label), monospace" }}>{sub}</text>
    </g>
  )
}

export function CipherWheel({ className = "" }: { className?: string }) {
  const p1 = polar(232, -35)
  const p2 = polar(163, 8)
  return (
    <svg
      viewBox="0 0 700 570"
      className={className}
      role="img"
      aria-label="Technical drawing of a cipher wheel with a plaintext ring, a cipher ring and a hidden key"
    >
      {/* centrelines, as on a real drawing */}
      <g className="draw-late" stroke={B} strokeOpacity="0.6" strokeWidth="1" strokeDasharray="18 5 3 5">
        <line x1="10" y1={CY} x2="514" y2={CY} />
        <line x1={CX} y1="4" x2={CX} y2="520" />
      </g>

      {/* fixed outer edge */}
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="232" fill="none" stroke={B} strokeWidth="2" />
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="205" fill="none" stroke={B} strokeWidth="1" />

      {/* plaintext ring */}
      <g className="draw-late">
        <g className="svg-spin-slow">
          <Ring chars={ALPHA} radius={218.5} size={15} dividers={[205, 232]} />
        </g>
      </g>

      {/* cipher ring (shifted alphabet) */}
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="178" fill="none" stroke={B} strokeWidth="1.4" />
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="148" fill="none" stroke={B} strokeWidth="1" />
      <g className="draw-late">
        <g className="svg-spin-rev">
          <Ring chars={[...ALPHA.slice(13), ...ALPHA.slice(0, 13)]} radius={163} size={13} opacity={0.85} dividers={[148, 178]} />
        </g>
      </g>

      {/* hex ring */}
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="118" fill="none" stroke={B} strokeWidth="1" />
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="88" fill="none" stroke={B} strokeWidth="1" />
      <g className="draw-late">
        <g className="svg-spin">
          <Ring chars={HEX} radius={103} size={11} opacity={0.7} />
        </g>
      </g>

      {/* hub */}
      <circle className="draw" pathLength={1} cx={CX} cy={CY} r="52" fill="#080c33" stroke={B} strokeWidth="2" />
      <text x={CX} y={CY + 15} textAnchor="middle" fontSize="44" fill={B}
        className="draw-late"
        style={{ fontFamily: "var(--f-stencil), var(--f-display), sans-serif", fontWeight: 900 }}>
        MM
      </text>

      {/* alignment pointer */}
      <path className="draw-late" d={`M${CX} 30 L${CX - 11} 6 L${CX + 11} 6 Z`} fill={Y} />

      {/* callouts */}
      <Callout from={[p1.x, p1.y]} to={[510, 100]} end={690} title="plaintext ring" sub="26 letters" />
      <Callout from={[p2.x, p2.y]} to={[510, 283]} end={690} title="cipher ring" sub="shifted by a hidden key" />
      <Callout from={[298, 297]} to={[510, 430]} end={690} title="key" sub="the part you recover" />

      {/* dimension line */}
      <g className="draw-late" stroke={B} strokeWidth="1" fill="none">
        <line x1="28" y1="272" x2="28" y2="552" strokeOpacity="0.45" />
        <line x1="492" y1="272" x2="492" y2="552" strokeOpacity="0.45" />
        <line x1="28" y1="544" x2="492" y2="544" />
        <path d="M28 544 l12 -4 v8 z M492 544 l-12 -4 v8 z" fill={B} />
      </g>
      <text x={CX} y="534" textAnchor="middle" fontSize="12" fill={B} className="draw-late"
        style={{ fontFamily: "var(--f-label), monospace" }}>
        one wheel, one shift
      </text>
    </svg>
  )
}

/** Stepped podium, drawn as a section view. */
export function PodiumDrawing({ className = "" }: { className?: string }) {
  const num = (x: number, y: number, t: string, dark = false) => (
    <text x={x} y={y} textAnchor="middle" fontSize="44" fontWeight="800"
      fill={dark ? "#080c33" : B}
      style={{ fontFamily: "var(--f-display), sans-serif" }}>{t}</text>
  )
  return (
    <svg viewBox="0 0 300 190" className={className} role="img" aria-label="Podium showing first, second and third place">
      <g stroke={B} strokeWidth="1.5" fill="none">
        <rect x="12" y="100" width="84" height="70" />
        <rect x="108" y="56" width="84" height="114" fill={Y} stroke={Y} />
        <rect x="204" y="128" width="84" height="42" />
        <line x1="0" y1="170" x2="300" y2="170" />
      </g>
      {num(54, 150, "2")}
      {num(150, 118, "1", true)}
      {num(246, 160, "3")}
    </svg>
  )
}

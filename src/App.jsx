import { useEffect, useState } from 'react'
import './index.css'
import {
  normalizeHex,
  hexToRgb,
  toRgbString,
  hexToHsl,
  hexToCmyk,
  hslToHex,
  contrastYIQ,
} from './utils/colorUtils'
import generateShades from './utils/palette'
import Button from './components/ui/Button'
import Card from './components/ui/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCheck, faShuffle } from '@fortawesome/free-solid-svg-icons'

function sampleHex() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return (
    '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
  )
}

function App() {
  const [input, setInput] = useState('#34a1eb')
  const [hex, setHex] = useState(normalizeHex(input))
  const [copied, setCopied] = useState('')

  useEffect(() => {
    setHex(normalizeHex(input))
  }, [input])

  const rgb = hex ? hexToRgb(hex) : null
  const hsl = hex ? hexToHsl(hex) : null
  const cmyk = hex ? hexToCmyk(hex) : null
  const textColor = hex ? contrastYIQ(hex) : '#000'
  const shadesResult = hex ? generateShades(hex) : null
  const shades = shadesResult ? shadesResult.shades : null
  const selectedShade = shadesResult ? shadesResult.selected : null

  function copy(text, label) {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(''), 1200)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="w-full max-w-3xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-2xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">HexLab: Color converter</h1>
          <p className="text-sm text-zinc-500">Enter a hex code to see RGB, HSL, CMYK</p>
        </header>

        <div className="flex flex-col gap-6">
          <div className="w-full flex-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">Hex code</label>
            <div className="flex gap-2 items-center">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="#34a1eb"
                className="flex-1 h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <button
                type="button"
                onClick={() => setInput(sampleHex())}
                className="h-10 rounded-md bg-zinc-100 dark:bg-zinc-700 px-3 text-sm text-zinc-800 dark:text-zinc-100 flex items-center gap-2"
                title="Random"
              >
                <FontAwesomeIcon icon={faShuffle} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div role="button" tabIndex={0} onClick={() => hex && copy(hex, 'hex')} onKeyDown={(e) => { if (e.key === 'Enter') hex && copy(hex, 'hex') }} className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/60 dark:to-zinc-700/60 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500">HEX</div>
                    <div className="mt-1 text-lg font-medium text-zinc-900 dark:text-white">{hex ?? 'invalid'}</div>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <FontAwesomeIcon icon={copied === 'hex' ? faCheck : faCopy} />
                  </div>
                </div>
              </div>

              <div role="button" tabIndex={0} onClick={() => rgb && copy(toRgbString(rgb), 'rgb')} onKeyDown={(e) => { if (e.key === 'Enter') rgb && copy(toRgbString(rgb), 'rgb') }} className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/60 dark:to-zinc-700/60 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500">RGB</div>
                    <div className="mt-1 text-lg font-medium text-zinc-900 dark:text-white">{rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '—'}</div>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <FontAwesomeIcon icon={copied === 'rgb' ? faCheck : faCopy} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div role="button" tabIndex={0} onClick={() => hsl && copy(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`, 'hsl')} onKeyDown={(e) => { if (e.key === 'Enter') hsl && copy(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`, 'hsl') }} className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/60 dark:to-zinc-700/60 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500">HSL</div>
                      <div className="mt-1 text-sm text-zinc-800 dark:text-zinc-100">{hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '—'}</div>
                    </div>
                    <div className="text-sm text-zinc-500">
                      <FontAwesomeIcon icon={copied === 'hsl' ? faCheck : faCopy} />
                    </div>
                  </div>
                </div>

                <div role="button" tabIndex={0} onClick={() => cmyk && copy(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`, 'cmyk')} onKeyDown={(e) => { if (e.key === 'Enter') cmyk && copy(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`, 'cmyk') }} className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/60 dark:to-zinc-700/60 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500">CMYK</div>
                      <div className="mt-1 text-sm text-zinc-800 dark:text-zinc-100">{cmyk ? `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` : '—'}</div>
                    </div>
                    <div className="text-sm text-zinc-500">
                      <FontAwesomeIcon icon={copied === 'cmyk' ? faCheck : faCopy} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Shades</div>
                  <div className="text-xs text-zinc-500">Click a swatch to copy</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {shades ? Object.entries(shades).map(([key, color]) => {
                    const isSelected = String(key) === String(selectedShade)
                    const textCol = contrastYIQ(color)
                    return (
                      <button
                        key={key}
                        onClick={() => copy(color, `shade-${key}`)}
                        className={`relative h-14 rounded flex items-center justify-center group focus:outline-none ${isSelected ? 'ring-4 ring-indigo-300 dark:ring-indigo-700' : ''}`}
                        style={{ background: color }}
                        title={`${color}`}
                      >
                        <span className="text-xs font-semibold" style={{ color: textCol }}>{key}</span>
                      </button>
                    )
                  }) : <div className="text-sm text-zinc-500">Enter a valid hex to see shades</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

  <footer className="mt-6 text-xs text-zinc-500">Developed by <a href="https://mrkndrei.vercel.app" className="underline decoration-dashed decoration-1 underline-offset-2 hover:decoration-zinc-400 hover:text-zinc-400" target="_blank" rel="noopener noreferrer">Mark Andrei Bance</a> © 2025</footer>
      </div>
    </div>
  )
}

export default App

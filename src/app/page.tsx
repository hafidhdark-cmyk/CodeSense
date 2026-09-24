'use client'

import { useState } from 'react'

interface Explanation {
  id: string
  code: string
  mode: 'beginner' | 'technical'
  explanation: string
  timestamp: Date
}

export default function Home() {
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'beginner' | 'technical'>('beginner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Explanation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  async function handleExplain() {
    if (!code.trim()) {
      setError('error: no code provided. paste something first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(`error: ${data.error}`)
        return
      }

      const newExplanation: Explanation = {
        id: Date.now().toString(),
        code,
        mode,
        explanation: data.explanation,
        timestamp: new Date(),
      }

      setHistory(prev => [newExplanation, ...prev])
      setActiveId(newExplanation.id)

    } catch {
      setError('error: network failure. check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const activeExplanation = history.find(h => h.id === activeId)

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
    }}>

      {/* Terminal Title Bar */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderBottom: 'none',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '6px 6px 0 0',
      }}>
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
        <span style={{ color: 'var(--muted)', fontSize: '12px', marginLeft: '8px' }}>
          codesense — explain.sh
        </span>
      </div>

      {/* Main Terminal Window */}
      <div style={{
        border: '1px solid var(--border)',
        background: 'var(--bg2)',
        borderRadius: '0 0 6px 6px',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        minHeight: '600px',
      }}>

        {/* LEFT — Input */}
        <div>
          {/* Prompt line */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--accent)' }}>user@codesense</span>
            <span style={{ color: 'var(--muted)' }}>:</span>
            <span style={{ color: '#4A9EFF' }}>~</span>
            <span style={{ color: 'var(--muted)' }}>$ </span>
            <span style={{ color: 'var(--text)' }}>mode=</span>
            <span style={{ color: 'var(--accent)' }}>{mode}</span>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {(['beginner', 'technical'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '6px 14px',
                  background: 'transparent',
                  border: '1px solid',
                  borderColor: mode === m ? 'var(--accent)' : 'var(--border)',
                  color: mode === m ? 'var(--accent)' : 'var(--muted)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-code)',
                  cursor: 'pointer',
                  borderRadius: '3px',
                }}
              >
                {mode === m ? '▶ ' : '  '}{m}
              </button>
            ))}
          </div>

          {/* Code Input */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              color: 'var(--accent)',
              fontSize: '12px',
              pointerEvents: 'none',
            }}>
              {'>'}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="paste your code here..."
              style={{
                width: '100%',
                height: '300px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '12px 12px 12px 28px',
                color: 'var(--text)',
                fontFamily: 'var(--font-code)',
                fontSize: '13px',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{
              color: 'var(--error)',
              fontSize: '12px',
              marginTop: '8px',
              fontFamily: 'var(--font-code)',
            }}>
              ✗ {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleExplain}
            disabled={loading}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '12px',
              background: loading ? 'transparent' : 'var(--accent)',
              color: loading ? 'var(--accent)' : '#000000',
              border: '1px solid var(--accent)',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-code)',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {loading ? '▶ running explain.sh...' : '▶ run explain.sh'}
          </button>

          {/* History */}
          {history.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
                // session history ({history.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {history.map((h, i) => (
                  <button
                    key={h.id}
                    onClick={() => setActiveId(h.id)}
                    style={{
                      padding: '8px 12px',
                      background: activeId === h.id ? 'var(--bg3)' : 'transparent',
                      border: '1px solid',
                      borderColor: activeId === h.id ? 'var(--accent-dim)' : 'var(--border)',
                      color: activeId === h.id ? 'var(--accent)' : 'var(--muted)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-code)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      borderRadius: '3px',
                    }}
                  >
                    [{i + 1}] {h.code.slice(0, 45).replace(/\n/g, ' ')}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Output */}
        <div style={{
          borderLeft: '1px solid var(--border)',
          paddingLeft: '24px',
        }}>
          {!activeExplanation ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'var(--muted)',
              fontSize: '12px',
              gap: '8px',
            }}>
              <p style={{ color: 'var(--accent-dim)' }}>// output</p>
              <p>waiting for input...</p>
              <p>paste code on the left</p>
              <p>select a mode</p>
              <p>run explain.sh</p>
              <p style={{ marginTop: '16px', color: 'var(--border)' }}>
                ████████████████████<br />
                ██ ready ██████████<br />
                ████████████████████
              </p>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ color: 'var(--accent)', fontSize: '12px' }}>
                  // {activeExplanation.mode} mode output
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '11px' }}>
                  {activeExplanation.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div style={{
                fontSize: '13px',
                lineHeight: '1.8',
                color: 'var(--text)',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                maxHeight: '500px',
              }}>
                {activeExplanation.explanation}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
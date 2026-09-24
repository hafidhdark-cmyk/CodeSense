import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeSense — AI Code Explainer',
  description: 'Paste any code in any language and get a clear explanation powered by Gemini AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header style={{
          borderBottom: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '16px' }}>
              ▶ CodeSense
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>v1.0.0</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
              powered by gemini-3.8-flash
            </span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
              boxShadow: '0 0 6px var(--accent)',
            }} />
          </div>
        </header>
        <main>{children}</main>
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--muted)',
          fontSize: '11px',
          marginTop: '48px',
        }}>
          <span>built by abdulmumeen adeyeri</span>
          <span>any language · any complexity</span>
        </footer>
      </body>
    </html>
  )
}
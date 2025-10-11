import Head from 'next/head'
import { useRouter } from 'next/navigation'

export default function Custom404() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>页面未找到 - MYAIGC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        position: 'fixed',
        top: 0,
        left: 0
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '64px',
            color: '#1e40af',
            margin: '0 0 20px 0',
            fontWeight: 'bold'
          }}>404</h1>

          <div style={{
            marginBottom: '32px'
          }}>
            <p style={{
              fontSize: '20px',
              color: '#475569',
              marginBottom: '12px'
            }}>抱歉，该页面暂时不可用</p>
            <p style={{
              fontSize: '16px',
              color: '#64748b'
            }}>AIGC加速人类文明</p>
          </div>

          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1e3a8a'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1e40af'}
          >
            返回首页
          </button>
        </div>
      </main>
    </>
  )
}

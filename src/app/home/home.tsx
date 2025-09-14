'use client';
import { useRouter } from 'next/navigation';
// import styles from "./page.module.css";
import './home.css';

export default function Home() {
  const router = useRouter();
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <section style={{ marginBottom: 16 }}>
        <h1>welcome to <span className='highlight'>wachiii</span></h1>
        <h4>“My app for the <a href="https://wachiii-dev0.web.app">Watchiii</a> 🛺 my personal website is currently in the prototype stage.”</h4>
      </section>
      <div
        style={{
          padding: 16,
          border: '1px solid var(--foreground)',
          margin: 8,
          borderRadius: 8,
          cursor: 'pointer',
          width: 200,
          textAlign: 'center',
        }}
        onClick={() => router.push('/builder')}
      >
        GOTO BUILDER
      </div>
      <div
        style={{
          padding: 16,
          border: '1px solid var(--foreground)',
          margin: 8,
          borderRadius: 8,
          cursor: 'pointer',
          width: 200,
          textAlign: 'center',
        }}
        onClick={() => router.push('/view/iframe-builder')}
      >
        GOTO VIEW
      </div>
      <div
        style={{
          padding: 16,
          border: '1px solid var(--foreground)',
          margin: 8,
          borderRadius: 8,
          cursor: 'pointer',
          width: 200,
          textAlign: 'center',
        }}
        onClick={() => router.push('/view/preview')}
      >
        GOTO PREVIEW
      </div>
      <h6 className='follow'>follow me</h6>
      <div className='social'>
        <div className='facebook' onClick={() => window.open('https://www.facebook.com/wachiii.livis', '_blank')}/>
        <div className='instagram' onClick={() => window.open('https://www.instagram.com/shunlll999', '_blank')}/>
        <div className='x' onClick={() => window.open('https://x.com/wach', '_blank')}/>
        <div className='github' onClick={() => window.open('https://github.com/shunlll999', '_blank')}/>
        <div className='linkedin' onClick={() => window.open('https://www.linkedin.com/in/wachara-nilsonti-b6529779/', '_blank')}/>
        <div className='web' onClick={() => window.open('https://wachiii-dev0.web.app/', '_blank')}/>
      </div>
    </div>
  );
}

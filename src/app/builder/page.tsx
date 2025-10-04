import styles from './layout.module.css'

export default async function Builder() {
  return (
    <div style={{ padding: 16 }}>
      <div className={styles['frame-content']}>
        <iframe src="/view/iframe-builder" style={{ padding: 0 }}></iframe>
      </div>
    </div>
  )
}

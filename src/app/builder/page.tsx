import styles from "./layout.module.css";


export default function Builder() {
  return (
    <div>Builder Me
      <div className={styles['frame-content']}>
        <iframe src="/view"></iframe>
      </div>
    </div>
  )
}

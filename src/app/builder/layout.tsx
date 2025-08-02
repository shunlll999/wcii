import { Navigation } from "@Components/builder/nav/navigation";
import styles from "./layout.module.css";
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>Builder Header</header>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <Navigation />
        </nav>
        <section className={styles.section}>{children}</section>
      </main>
    </div>
  )
}

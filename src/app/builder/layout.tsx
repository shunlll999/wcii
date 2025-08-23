import styles from './layout.module.css';
import { Navigation } from '@Components/builder/base/Navigation';
import { ThemeRegistry } from '@Components/builder/base/ThemeRegistry';
import { ClientProviders } from '@Components/builder/base/ClientProvider';
import { getPresets } from '@Shared/libs/present';

type BuilderLayoutProps = {
  children: React.ReactNode;
};

export default async function BuilderLayout({ children }: BuilderLayoutProps) {
  const presets = await getPresets();
  return (
    <ThemeRegistry>
      <ClientProviders>
        <div className={styles.layout}>
          <header className={styles.header}>Builder Header</header>
          <main className={styles.main}>
            <nav className={styles.nav}>
              <Navigation presets={presets} />
            </nav>
            <section className={styles.section}>{children}</section>
            <nav>
              Inspector Panel
            </nav>
          </main>
        </div>
      </ClientProviders>
    </ThemeRegistry>
  );
}

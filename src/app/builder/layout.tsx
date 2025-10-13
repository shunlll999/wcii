/* eslint-disable @next/next/no-img-element */
import styles from './layout.module.css';
import { Navigation } from '@Components/builder/base/Navigation';
import { ThemeRegistry } from '@Components/builder/base/ThemeRegistry';
import { ClientProviders } from '@Components/builder/base/ClientProvider';
import { Inspector } from '@Shared/components/ui/inspector';
import { getPresets } from '@Shared/services/presets';

type BuilderLayoutProps = {
  children: React.ReactNode;
};

export default async function BuilderLayout({ children }: BuilderLayoutProps) {
  const presets = await getPresets();
  return (
    <ThemeRegistry>
      <ClientProviders>
        <div className={styles.layout}>
          <header className={styles.header}>
            <img src="/assets/images/logo/wcilogo.png" className={styles.logo} alt="wcii-logo" />
            <div className={styles.title}>builder</div>
          </header>
          <main className={styles.main}>
            <nav className={styles.nav}>
              <Navigation presets={presets} />
            </nav>
            <section className={styles.section}>{children}</section>
            <nav>
              <Inspector instance={{ test: '123' }} />
            </nav>
          </main>
        </div>
      </ClientProviders>
    </ThemeRegistry>
  );
}

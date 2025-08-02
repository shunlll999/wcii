export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Main Layout Header</header>
      <main>{children}</main>
      <footer>Main Layout Footer</footer>
    </div>
  )
}

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Shared Layout Header</header>
      <main>{children}</main>
      <footer>Shared Layout Footer</footer>
    </div>
  )
}

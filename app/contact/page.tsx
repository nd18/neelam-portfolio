import SiteHeader from "../components/SiteHeader";

export default function ContactPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#E8E4DC', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontFamily: 'sans-serif', fontSize: '2rem' }}>Contact page coming soon.</h1>
      </div>
    </main>
  );
}

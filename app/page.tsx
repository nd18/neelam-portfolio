import styles from "./hero.module.css";
import SiteHeader from "./components/SiteHeader";
import SpotlightBeam from "./components/SpotlightBeam";
import ProjectCard from "./components/ProjectCard";

export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={styles.bg}>
        <SpotlightBeam />
      </div>
      <div className={styles.bigText} aria-hidden="true">Neelam Malaviya</div>
      <div className={styles.bigTextLit} data-big-text-lit aria-hidden="true">Neelam Malaviya</div>

      <SiteHeader />

      <section className={styles.content}>
        <div className={styles.leftText}>
          <h1>
            Shopify Stores &amp;<br />
            B2B Websites<br />
            That Drive Revenue
          </h1>
        </div>

        <ProjectCard />

        <p className={styles.rightText}>
          Senior e-commerce developer with 7+ years delivering custom Shopify
          Plus themes, Liquid development and WordPress CMS builds.
          <br />
          Clients like Cerascreen saw 30% revenue growth.
          <br />
          <span className={styles.highlight}>Available remote, worldwide.</span>
        </p>
      </section>
    </main>
  );
}

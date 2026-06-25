import styles from "./hero.module.css";
import SiteHeader from "./components/SiteHeader";
import SpotlightBeam from "./components/SpotlightBeam";
import ProjectCard from "./components/ProjectCard";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ProcessSection from "./components/ProcessSection";
import ReviewsSection from "./components/ReviewsSection";
import HeroIntro from "./components/HeroIntro";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.bg}>
          <SpotlightBeam />
        </div>
        <div className={styles.bigText} aria-hidden="true">Neelam Malaviya</div>
        <div className={styles.bigTextLit} data-big-text-lit aria-hidden="true">Neelam Malaviya</div>

        <SiteHeader />

        <ProjectCard />

        <HeroIntro />
      </section>

      <AboutSection />
      <ProjectsSection />
      <ProcessSection />
      <ReviewsSection />
      <SiteFooter />
    </main>
  );
}

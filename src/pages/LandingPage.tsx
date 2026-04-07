import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import FeatureCards from "../components/FeatureCards";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import LocationsSection from "../components/LocationsSection";
import SideNav from "../components/SideNav";

function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const isHeroActive = activeSection === "hero";

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);
  const closeSideNav = () => setIsSideNavOpen(false);

  useEffect(() => {
    const main = mainRef.current;
    if (!(main instanceof HTMLElement)) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>("section[id]"));
    if (sections.length === 0) return;

    const updateActiveSection = () => {
      const anchor = main.scrollTop + main.clientHeight * 0.35;
      const current = sections.find((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        return anchor >= top && anchor < bottom;
      });

      setActiveSection(current?.id ?? sections[0].id);
    };

    updateActiveSection();
    main.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      main.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <div className="page-shell h-screen overflow-hidden">
      <Header isHeroActive={isHeroActive} onMenuClick={toggleSideNav} />
      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      <main ref={mainRef} className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory overscroll-contain">
        <HeroSection active={activeSection === "hero"} />
        <FeatureCards active={activeSection === "features"} />
        <LocationsSection active={activeSection === "locations"} />
        <Footer active={activeSection === "footer"} />
      </main>
    </div>
  );
}

export default LandingPage;

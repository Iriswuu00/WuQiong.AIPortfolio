import Hud from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/Hud";
import CustomCursor from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/CustomCursor";
import SplitWords from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/SplitWords";
import SmoothScroll from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/SmoothScroll";
import Orb from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/Orb";
import Preloader from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/Preloader";
import HeroSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/HeroSection";
import ManifestoSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/ManifestoSection";
import ClientsSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/ClientsSection";
import FeaturedWorkSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/FeaturedWorkSection";
import ElevatingSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/ElevatingSection";
import AwardsSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/AwardsSection";
import ClosingSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/ClosingSection";
import FooterSection from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/FooterSection";

/**
 * OFF+BRAND. homepage — pixel-perfect desktop clone of
 * https://www.itsoffbrand.com/ (site itsoffbrand-com-9e173219 /
 * page root-8a5edab2). Route: /
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <Preloader />
      <SplitWords />
      <Hud />
      <main className="page-w">
        <Orb />
        <HeroSection />
        <ManifestoSection />
        <ClientsSection />
        <FeaturedWorkSection />
        <ElevatingSection />
        <AwardsSection />
        <ClosingSection />
        <FooterSection />
      </main>
    </>
  );
}

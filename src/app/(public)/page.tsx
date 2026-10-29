import { EventPromoBanner } from "@/features/(public)/events/components/eventPromoBanner";
import { CategorySection } from "@/features/(public)/landing/components/CategorySection";
import { FeaturedEvents } from "@/features/(public)/landing/components/FeaturedEvents";
import { LandingBenefits, PromoCallout } from "@/features/(public)/landing/components/LandingBenefits";
import { HeroSection } from "@/features/(public)/landing/components/heroSection";
import { UpcomingEvents } from "@/features/(public)/landing/components/UpcomingEvents";

// urutan section mengikuti Figma landing (frame 33:2)
export default function LandingPage() {
  return (
    <div className="bg-page">
      <HeroSection />
      <CategorySection />
      <FeaturedEvents />
      <PromoCallout />
      <UpcomingEvents />
      <LandingBenefits />
      {/* CTA organizer, sama dengan banner di halaman list event */}
      <div className="pt-16">
        <EventPromoBanner />
      </div>
    </div>
  );
}

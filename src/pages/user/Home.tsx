import HeroSection from "@/components/user/HeroSection/HeroSection";
import CategorySection from "@/components/user/Home_Category/CategorySection";
import CollectionSection from "@/components/user/Home_Collection/CollectionSection";
import FeaturedSection from "@/components/user/Home_Collection/FeaturedSection";
import OutFitSection from "@/components/user/Home_OutfitOfTheDay/OutFitSection";
import SaleSection from "@/components/user/Home_Sale/SaleSection";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroSection />
      <CategorySection />
      <SaleSection />
      <FeaturedSection />
      <OutFitSection />
      <CollectionSection />
    </>
  );
};

export default Home;

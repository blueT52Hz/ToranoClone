import HeroSection from "@/components/HeroSection/HeroSection";
import CategorySection from "@/components/Home_Category/CategorySection";
import CollectionSection from "@/components/Home_Collection/CollectionSection";
import FeaturedSection from "@/components/Home_Collection/FeaturedSection";
import SaleSection from "@/components/Home_Sale/SaleSection";
import { Flex } from "antd";
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
      <CollectionSection />
    </>
  );
};

export default Home;

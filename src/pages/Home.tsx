import HeroSection from "@/components/HeroSection/HeroSection";
import CategorySection from "@/components/Home_Category/CategorySection";
import { Flex } from "antd";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroSection />
      <CategorySection />
    </>
  );
};

export default Home;

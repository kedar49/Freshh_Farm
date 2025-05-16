import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import Categories from '../components/ProductCategories';
import BestSellers from '../components/BestSellers';
import BottomBaner from '../components/BottomBaner';


const Home = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { type: "spring", stiffness: 100, damping: 25 },
        },
        exit: { opacity: 0 },
      }}
    >
      <div>
        <HeroSection />
        <motion.div
          className="mt-16"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { staggerChildren: 0.3, delayChildren: 0.3 },
            },
          }}
        >
          <Categories />
          <BestSellers />
          <BottomBaner />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;

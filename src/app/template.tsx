'use client';

import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(10px)', scale: 0.98 },
  enter: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 20,
        mass: 1,
      }}
      className="flex-grow flex flex-col h-full"
    >
      {children}
    </motion.div>
  );
}

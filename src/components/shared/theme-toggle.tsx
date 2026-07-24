'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative rounded-full bg-muted/50 hover:bg-muted border border-border/40 cursor-pointer overflow-hidden transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 30 : 0,
          rotate: isDark ? 45 : 0,
          scale: isDark ? 0.3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute text-amber-500"
      >
        <Sun className="h-5 w-5 fill-amber-500/10" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 0 : -30,
          rotate: isDark ? 0 : -45,
          scale: isDark ? 1 : 0.3,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute text-indigo-400"
      >
        <Moon className="h-5 w-5 fill-indigo-400/10" />
      </motion.div>
    </Button>
  );
}

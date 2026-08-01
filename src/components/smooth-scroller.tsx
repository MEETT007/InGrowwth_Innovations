'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

export function SmoothScroller({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}

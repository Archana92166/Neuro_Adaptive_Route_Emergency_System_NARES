
"use client";

import { useEffect, useCallback } from 'react';

const SHAKE_THRESHOLD = 15; // m/s^2

export function useShake(onShake: () => void) {
  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    if (x === null || y === null || z === null) return;
    
    const acc = Math.sqrt(x*x + y*y + z*z);

    const last_acc = window.last_acc || acc;
    window.last_acc = acc;
    
    const delta = Math.abs(acc - last_acc);

    if (delta > SHAKE_THRESHOLD) {
       onShake();
    }
  }, [onShake]);

  useEffect(() => {
    let isAttached = false;
    
    const requestAndAttach = () => {
      // Check if the permission needs to be requested
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          (DeviceMotionEvent as any).requestPermission()
              .then((permissionState: 'granted' | 'denied') => {
                  if (permissionState === 'granted') {
                      window.addEventListener('devicemotion', handleMotion);
                      isAttached = true;
                  }
              })
              .catch(console.error);
      } else {
          // Handle non-iOS 13+ devices
          window.addEventListener('devicemotion', handleMotion);
          isAttached = true;
      }
    }
    
    // Some browsers require a user interaction to request motion permissions.
    // We'll add a one-time click listener to the window.
    const interactionListener = () => {
        if (!isAttached) {
            requestAndAttach();
        }
        window.removeEventListener('click', interactionListener);
    };

    window.addEventListener('click', interactionListener, { once: true });


    return () => {
      if (isAttached) {
        window.removeEventListener('devicemotion', handleMotion);
      }
      window.removeEventListener('click', interactionListener);
    };
  }, [handleMotion]);
}

declare global {
    interface Window {
        last_acc: number;
    }
}

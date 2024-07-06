import React, { useEffect, useRef } from 'react';
import styles from './SplineViewer.module.css';

function SplineViewer({ url }) {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let spline: any; // Declare spline variable here

    const initializeSpline = async () => {
      const { SplineViewer } = await import('@splinetool/viewer'); // Dynamic import for better performance
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        spline = new SplineViewer({ canvas, url });
      }
    };

    initializeSpline();
    
    return () => {
      if (spline) {
        spline.destroy(); // Clean up on unmount
      }
    };
  }, [url]);

  return <div ref={canvasRef} className={styles.splineContainer}></div>;
}

export default SplineViewer;

"use client";

import React from "react";
import { useEffect } from "react";
import Image from "next/image";

import styles from "./Chart.module.css";

interface ChatProps {
  isChartVisible: boolean;
  setIsChartVisible: (isVisible: boolean) => void;
}

const Chart: React.FC<ChatProps> = ({ isChartVisible, setIsChartVisible }) => {
  // Disable scrolling when the popup is visible
  useEffect(() => {
    if (isChartVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isChartVisible]);

  if (!isChartVisible) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsChartVisible(false)}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h1>IQ Key</h1>
        <div className={styles.chartContainer}>

          <div className={styles.chartRow}>
            <div className={styles.chartScore}>&gt; 130</div>
            <div className={styles.chartItem}>Giga Genius</div>
            <div className={styles.chartImage}>
              <Image src="/images/pfp/4.jpg" width={50} height={50} alt="0" />
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartScore}>120-129</div>
            <div className={styles.chartItem}>Genius</div>
            <div className={styles.chartImage}>
              <Image src="/images/pfp/3.jpg" width={50} height={50} alt="0" />
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartScore}>90-119</div>
            <div className={styles.chartItem}>Midwit</div>
            <div className={styles.chartImage}>
              <Image src="/images/pfp/2.jpg" width={50} height={50} alt="0" />
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartScore}>80-89</div>
            <div className={styles.chartItem}>Retard</div>
            <div className={styles.chartImage}>
              <Image src="/images/pfp/1.jpg" width={50} height={50} alt="0" />
            </div>
          </div>

          <div className={styles.chartRow}>
            <div className={styles.chartScore}>&lt; 79</div>
            <div className={styles.chartItem}>Severely Retarded</div>
            <div className={styles.chartImage}>
              <Image src="/images/pfp/0.jpg" width={50} height={50} alt="0" />
            </div>
          </div>

          






        </div>
        <button className={styles.closeButton} onClick={() => setIsChartVisible(false)}>
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default Chart;

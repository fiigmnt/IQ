"use client";

import React from "react";
import { useState, useEffect } from "react";

import styles from "./Info.module.css";

const Info = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Handle closing the popup when clicking outside the box
  const handleClose = () => {
    setIsVisible(false);
  };

  // Disable scrolling when the popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.info}>
          <div className={styles.box}>
            <h2>How It Works:</h2>
            <div className={styles.content}>
              <p>1. Paste your 𝕏 profile to calculate your IQ 🔍</p>
              <p>2. Our AI 🤖 analyzes 𝕏 to generate your score</p>
            </div>
            <div className={styles.content}>
              <p>
              Get 1 🆓 IQ Check 🧠 + 2 Bonus IQ Checks 🧠 🧠  when you share on 𝕏 !
              </p>
            </div>
          </div>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          LET&apos;S GO!
        </button>
      </div>
    </div>
  );
};

export default Info;

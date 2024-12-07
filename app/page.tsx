"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "./page.module.css";
import Header from "@/components/Header";
import { createTwitterPostUrl } from "@/utils";

type Result = {
  score: string;
  reasoning: string;
  image: string;
  username: string;
};

const elon = {
  score: "110",
  reasoning:
    "After an in-depth analysis of Elon Musk's tweets, it's evident that 161 might be the only IQ score that can keep up with his eccentric, yet genius, spontaneous outbursts about colonizing Mars, electric cars, and obscure cryptocurrency jokes. His tweets are a roller coaster ride, from genius insights to alien conspiracy theories, which is, frankly, a wild intellectual workout for any reader. It's like attending a TED Talk hosted by both Einstein and a stand-up comedian at the same time",
  image: "https://pbs.twimg.com/profile_images/1858316737780781056/kPL61o0F_400x400.jpg",
  username: "elonmusk",
};

export default function Home() {
  const [username, setUsername] = useState("elonmusk");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [checks, setChecks] = useState(0);
  const [hasShared, setHasShared] = useState(false);

  useEffect(() => {
    const checks = localStorage.getItem("checks");
    // if user has no checks, give them one - else set from cookies
    if (!checks) {
      localStorage.setItem("checks", "1");
      setChecks(1);
    } else {
      setChecks(parseInt(checks));
    }

    // if user has shared, set state
    const hasShared = localStorage.getItem("hasShared");
    if (hasShared) {
      setHasShared(true);
    }
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);

    // decrement checks
    localStorage.setItem("checks", (checks - 1).toString());
    setChecks(checks - 1);

    // TODO: call analyze endpoint

    // for testing
    setTimeout(() => {
      setResult(elon);
      setAnalyzing(false);
    }, 3000);
  };

  const handleShare = () => {
    // call share to twitter function
    if (result) {
      const url = createTwitterPostUrl(result.username, result.score, getCategory(parseInt(result.score)));
      window.open(url, "_blank");
    } else {
      // TODO: handle this error properly
      console.error("No result to share");
    }

    // if first time user shared on twitter, give them a free check
    if (!hasShared) {
      const newChecks = checks + 1;
      localStorage.setItem("checks", newChecks.toString());
      localStorage.setItem("hasShared", "true");
      setChecks(newChecks); // Update state
      setHasShared(true); // Update state
    }
  };

  // const handleBuy = () => {
  //   console.log(`Buying checks`);
  //   setResult(null);
  // }

  const getCategory = (score: number) => {
    if (score < 70) {
      return "SEVERLY RETARDED";
    }
    if (score < 84) {
      return "RETARDED";
    }
    if (score < 114) {
      return "MID";
    }
    if (score < 129) {
      return "AVERAGE";
    }
    if (score < 144) {
      return "GIFTED";
    }
    if (score < 159) {
      return "A GENIUS";
    }
    return "A GIGA GENIUS";
  };

  const calculateImage = (score: number) => {
    if (score < 85) {
      return "/images/results/1.png";
    }
    if (score < 120) {
      return "/images/results/2.png";
    }
    return "/images/results/3.png";
  };

  const mainContent = () => {
    if (analyzing) {
      return (
        <div className={styles.container}>
          <div className={styles.analyzingContainer}>
            <Image src="/images/analyzing.gif" unoptimized alt="Analyzing" layout="fill" objectFit="contain" />
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <div className={styles.reasoningContainer}>
          <h1>IQ Score: {result.score}</h1>
          <p className={styles.resultUsername}>
            @{result.username} is {getCategory(parseInt(result.score))}
          </p>
          <div className={styles.reasoningImageContainer}>
            <Image src={calculateImage(parseInt(result.score))} alt="User" layout="fill" objectFit="contain" />
          </div>
          <div className={styles.textContainer}>
            <p>{result.reasoning}</p>
          </div>
          <button className={styles.shareButton} onClick={handleShare}>
            Share On 𝕏{hasShared ? "" : " for free Check"}
          </button>
        </div>
      );
    }

    return (
      <>
        <div className={styles.container}>
          <div className={styles.infoContainer}>
            <h1 className={styles.title}>Check your IQ</h1>
            <p className={styles.description}>Are you retarded?</p>
          </div>
          <div className={styles.imageContainer}>
            <Image src="/images/chart.png" alt="chart" layout="fill" objectFit="contain" />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Header checks={checks} />

      <div className={styles.page}>
        {mainContent()}
        <div className={styles.inputContainer}>
          <input
            className={styles.inputBox}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="𝕏 username"
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleAnalyze}>
            Analyze
          </button>
          {/* <button className={styles.button} onClick={handleBuy}>Buy Checks</button> */}
        </div>
      </div>
    </>
  );
}

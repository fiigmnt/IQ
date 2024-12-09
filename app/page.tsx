"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

import useSolana from "@/hooks/useSolana";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "./page.module.css";
import Header from "@/components/Header";
import ConnectWallet from "@/components/ConnectWallet";
import Notification from "@/components/Notification";

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
  const [username, setUsername] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showBuyChecks, setShowBuyChecks] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [checks, setChecks] = useState(0);
  const [hasShared, setHasShared] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const { buyChecks } = useSolana();
  const { publicKey } = useWallet();

  useEffect(() => {
    const checks = localStorage.getItem("checks");
    // if user has no checks, give them one - else set from cookies
    if (!checks) {
      localStorage.setItem("checks", "3");
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

  const handleAnalyze = async () => {
    if (!username) {
      setShowError("Please enter a username");
      return;
    }

    setAnalyzing(true);

    // decrement checks
    localStorage.setItem("checks", (checks - 1).toString());
    setChecks(checks - 1);

    try {
      // sanatize username
      const cleanUsername = username.replace("@", "");

      const response = await fetch(`/api/iq/${cleanUsername}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setResult(result.data);
      } else {
        setShowError(result.message || "Analysis failed");
      }
      setAnalyzing(false);
    } catch (error) {
      setShowError("An error occurred during analysis");
      console.error("Analysis error:", error);
      setAnalyzing(false);
    }
  };

  const handleShare = () => {
    // call share to twitter function
    if (result) {
      const url = createTwitterPost(result.username, result.score, getCategory(parseInt(result.score)));
      window.open(url, "_blank");
    } else {
      setShowError("No result to share");
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

  const handleBuy = async (checksAmount: number) => {
    if (!publicKey) {
      setShowError("Wallet not connected");
      return;
    }

    try {
      const result = await buyChecks(checksAmount);
      if (result?.success) {
        setShowNotification(`${checksAmount} checks bought successfully`);
        localStorage.setItem("checks", (checks + checksAmount).toString());
        setChecks(checks + checksAmount);
        setResult(null);
        setShowBuyChecks(false);
      } else {
        setShowError(result?.message || "Unable to buy checks");
      }
    } catch (error: any) {
      setShowError("Unable to buy checks");
      console.error("Unable to buy checks", error);
    }
  };

  const createTwitterPost = (username: string, score: string, category: string) => {
    const tweetText = `.@${username} has an IQ of ${score}. They are ${category} 🧠
    
Think you can beat them? Test your IQ now at @iqcheckdotfun #IQ"`;

    const encodedTweetText = encodeURIComponent(tweetText);
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

    return twitterIntentUrl;
  };

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

  const handleNotificationClose = () => {
    setShowError(null);
    setShowNotification(null);
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

    if (showBuyChecks) {
      return (
        <div className={styles.container}>
          <div className={styles.buyChecksHeader}>
            <h1>Buy more checks</h1>
            <ConnectWallet />
          </div>
          <div className={styles.buyChecksContent}>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(1)}>
              <h2>1 Check</h2>
              <p>0.08 SOL</p>
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(2)}>
              <h2>2 Checks</h2>
              <p>1.4 SOL</p>
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(3)}>
              <h2>3 Checks</h2>
              <p>1.9 SOL</p>
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(4)}>
              <h2>4 Checks</h2>
              <p>2.4 SOL</p>
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(5)}>
              <h2>5 Checks</h2>
              <p>2.8 SOL</p>
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(6)}>
              <h2>6 Checks</h2>
              <p>3.2 SOL</p>
            </button>
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <div className={styles.reasoningContainer}>
          <h1>IQ Score: {result.score}</h1>
          <div className={styles.resultUsername}>
            <div className={styles.pfpContainer}>
              <Image
                src={result.image}
                alt="User"
                width={40} // Set width explicitly
                height={40} // Set height explicitly
                objectFit="cover" // Ensure the image fills the circle
              />
            </div>
            <p className={styles.username}>
              {result.username} is {getCategory(parseInt(result.score))}
            </p>
          </div>
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
      {showError && <Notification message={showError} type="error" onClose={handleNotificationClose} />}
      {showNotification && <Notification message={showNotification} type="info" onClose={handleNotificationClose} />}
      <div className={styles.page}>
        {mainContent()}
        <div className={styles.inputContainer}>
          <input
            className={styles.inputBox}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUsername("")}
            placeholder="𝕏 username"
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleAnalyze} disabled={!checks}>
            Analyze
          </button>
          {!checks && (
            <button className={styles.button} onClick={() => setShowBuyChecks(true)}>
              Buy Checks
            </button>
          )}
        </div>
      </div>
    </>
  );
}

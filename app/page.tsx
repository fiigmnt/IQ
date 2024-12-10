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
import Music from "@/components/Music";
import Confetti from "react-confetti-boom";

type Result = {
  score: string;
  reasoning: string;
  image: string;
  username: string;
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
        setResult(null);
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
      const newChecks = checks + 2;
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
    } catch (error) {
      setShowError("Unable to buy checks");
      console.error("Unable to buy checks", error);
    }
  };

  const createTwitterPost = (username: string, score: string, category: string) => {
    const tweetText = `.@${username} has an #IQ of ${score}. They are ${category} 🧠
    
What's your #IQ? Check now at @iqcheckdotfun`;

    const encodedTweetText = encodeURIComponent(tweetText);
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

    return twitterIntentUrl;
  };

  const getCategory = (score: number) => {
    if (score < 80) {
      return "SEVERLY RETARDED";
    }
    if (score < 90) {
      return "RETARDED";
    }
    if (score < 100) {
      return "MID";
    }
    if (score < 130) {
      return "AVERAGE";
    }
    if (score < 140) {
      return "GIFTED";
    }
    if (score < 150) {
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
    if (score < 139) {
      return "/images/results/3.png";
    }
    return "/images/results/4.png";
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
              <p>0.1 SOL</p>
              <Image src="/images/brain.png" alt="Checks" width={75} height={75} />
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(2)}>
              <h2>2 Checks</h2>
              <p>0.15 SOL</p>
              <Image src="/images/buy/2.png" alt="Checks" width={75} height={75} />
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(5)}>
              <h2>5 Checks</h2>
              <p>0.2 SOL</p>
              <Image src="/images/buy/5.png" alt="Checks" width={75} height={75} />
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(10)}>
              <h2>10 Checks</h2>
              <p>0.3 SOL</p>
              <Image src="/images/buy/10.png" alt="Checks" width={75} height={75} />
            </button>
            <button className={styles.buyChecksBox} onClick={() => handleBuy(20)}>
              <h2>20 Checks</h2>
              <p>0.5 SOL</p>
              <Image src="/images/buy/20.png" alt="Checks" width={75} height={75} />
            </button>
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <>
          <Confetti mode="boom" particleCount={1000} spreadDeg={180} />
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
              Share On 𝕏
              <br />
              {hasShared ? "" : " to get more checks"}
            </button>
          </div>
        </>
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
          {!analyzing && (
            <button className={styles.button} onClick={handleAnalyze} disabled={!checks}>
              {!checks ? "No more" : "Analyze"}
              <Image src="/images/brain.png" alt="Checks" width={40} height={40} />
            </button>
          )}
          {/* TODO: SET SHOW BUY CHECKS IF NEEDED */}
          {/* {!checks && (
            <button className={styles.button} onClick={() => setShowBuyChecks(!showBuyChecks)}>
              Buy
              <Image src="/images/brain.png" alt="Checks" width={40} height={40} />
            </button>
          )} */}
        </div>
        <Music />
      </div>
    </>
  );
}

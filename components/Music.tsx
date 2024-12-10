"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import styles from "./Music.module.css";
import Link from "next/link";

const Music: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play();
        document.removeEventListener("click", playAudio);
      }
    };

    document.addEventListener("click", playAudio);

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  return (
    <div className={styles.main}>
      <audio ref={audioRef} src={"/assets/succession.mp3"} autoPlay muted={isMuted} />
      <div className={styles.button} onClick={toggleMute}>
        <Image
          src={isMuted ? "/icons/sound-off.svg" : "/icons/sound-on.svg"}
          alt="mute button"
          width={32}
          height={32}
        />
      </div>
      <Link href="https://x.com/iqcheck.fun" target="new">
        <Image src="/images/x.png" alt="Logo" width={40} height={40} />
      </Link>
    </div>
  );
};

export default Music;

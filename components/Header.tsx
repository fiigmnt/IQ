import React from "react";
import Image from "next/image";

import styles from "./Header.module.css";

interface HeaderProps {
  checks: number;
}

const Header: React.FC<HeaderProps> = ({ checks }) => {

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
      </div>
      <div className={styles.container}>
        <div className={styles.checksContainer}>
          {checks}
          <Image src="/images/brain.png" alt="Logo" width={75} height={75} />
        </div>
      </div>
    </header>
  );
};

export default Header;

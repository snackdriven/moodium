import Image from 'next/image';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Mood Creature Companion System
        </p>
        <div>
          <a href="/check-in" className={styles.card}>
            Start Check-in →
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <div style={{ fontSize: '4rem' }}>🌙</div>
        <h1 style={{ marginTop: '1rem' }}>Mood Creature</h1>
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=typescript-nextjs-starter"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=typescript-nextjs-starter"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=typescript-nextjs-starter"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=typescript-nextjs-starter"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>Instantly deploy your Next.js site to a shareable URL with Vercel.</p>
        </a>
      </div>
    </main>
  );
}

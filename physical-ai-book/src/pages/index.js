import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// Step 1: ChatWidget import (Ensure file exists at src/components/ChatWidget/index.js)
import ChatWidget from '@site/src/components/ChatWidget'; 
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {/* Path fixed to /docs/intro to match your file structure */}
         <Link
  className="button button--secondary button--lg"
  to="/docs/intro"> 
  Read the Textbook →
</Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Interactive Physical AI AI-native textbook">
      <HomepageHeader />
      <main>
        {/* Is main section mein ab sirf chatbot aur padding dikhegi */}
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
           <ChatWidget />
        </div>
      </main>
    </Layout>
  );
}
import React from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import ChatWidget from '@site/src/components/ChatWidget'; 

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className="text--center">Ask Physical AI</Heading>
            {/* Ab yahan sirf Chat Widget nazar aayega, purane boxes gayab */}
            <ChatWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
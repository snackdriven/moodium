'use client';

import { motion } from 'framer-motion';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import styles from './mood-creature-enhanced.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mood Creature error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          className={styles.errorContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.errorContent}>
            <span className={styles.errorEmoji}>😔</span>
            <h2>Oops, something went fuzzy</h2>
            <p>The creature needs a moment to gather itself.</p>
            <button onClick={this.handleReset} className={styles.primaryButton}>
              Try again
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

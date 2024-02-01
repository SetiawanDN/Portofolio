import React from 'react';
import FeatureStyle from './FeatureStyle'; 

const Feature = () => {
  const styles = FeatureStyle(); 

  return (
    <>
      <div style={styles.container}>
        <div style={styles.box}>
          <h1 style={styles.title}>200+</h1>
          <p style={styles.description}>Various cuisines available in professional class</p>
        </div>
        <div style={styles.box}>
          <h1 style={styles.title}>50+</h1>
          <p style={styles.description}>A chef who is reliable and has his own characteristics in cooking</p>
        </div>
        <div style={styles.box}>
          <h1 style={styles.title}>30+</h1>
          <p style={styles.description}>Cooperate with trusted and upscale restaurants</p>
        </div>
      </div>
    </>
  );
};

export default Feature;

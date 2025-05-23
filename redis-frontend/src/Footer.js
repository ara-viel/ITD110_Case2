import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Brgy. Hindang Profiling. All Rights Reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '15px',
    background: '',
    color: '#162a5b',
    fontSize: '14px',
    fontWeight: '500',
    position: 'static',
    bottom: '0',
    width: '100%',
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
  }
};

export default Footer;

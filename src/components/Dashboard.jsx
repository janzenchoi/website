import React from 'react';
import { getValue, resetValue } from '../helper/storage';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';

export const Dashboard = () => {
  // Style
  const primaryTextStyle = {
    fontSize: '2em',
    color: 'blue',
    textAlign: 'center'
  };
  const secondaryTextStyle = {
    fontSize: '20px',
    textAlign: 'center'
  };
  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '20px'
  };

  // Widths
  const [bodyWidth, setBodyWidth] = React.useState('100vw');
  const setWidthValues = () => {
    if (window.innerWidth > 1400) {
      setBodyWidth('calc(100vw - 100px)');
    } else if (window.innerWidth > 800 && window.innerWidth <= 1400) {
      setBodyWidth('calc(100vw - 60px)');
    } else if (window.innerWidth <= 800) {
      setBodyWidth('calc(100vw - 30px)');
    }
  };
  window.addEventListener('resize', () => setWidthValues());
  React.useEffect(() => setWidthValues(), []);

  // Displaying the score
  const [storedValue, setStoredValue] = React.useState(0);
  const initialiseStoredValue = async () => {
    const initialValue = await getValue();
    setStoredValue(initialValue);
  };

  // Congratulating
  const checkGamesWon = async () => {
    const value = await getValue();
    if (value === '0') {
      alert('Congratulations!');
      await resetValue();
      await initialiseStoredValue();
    }
  }

  // On load
  React.useEffect(() => {
    initialiseStoredValue();
    checkGamesWon();
  }, []);

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...rowContainerStyle, width: (bodyWidth) }}>
      <div style={{ ...columnContainerStyle }}>
        <div style={{ ...primaryTextStyle }}>
          Please choose an option from the sidebar.
        </div>
        <div style={{ ...secondaryTextStyle }}>
          Games left to win: {storedValue +' '}
          <button style={{ ...buttonStyle }} onClick={async () => {
            const newValue = await resetValue();
            setStoredValue(newValue);
          }}>
            (reset)
          </button>
        </div>
      </div>
    </div>
  );
}
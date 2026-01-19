import React from 'react';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle } from '../helper/styles';
import { getRandomInteger } from '../helper/random';
import { decrementValue } from '../helper/storage';

export const Memory = () => {
  // Style
  const cardContainer = {
    width: '100%',
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  };
  const cardStyle = {
    width: '25%',
    height: '100%',
    fontSize: '30px',
    cursor: 'pointer'
  };
  const instructionStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: '#cccccc',
    textAlign: 'center',
    fontSize: '15px'
  };

  // Widths
  const [bodyWidth, setBodyWidth] = React.useState(0);
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

  // Stores state of game
  const [showing, setShowing] = React.useState(true);
  const [currentInstruction, setCurrentInstruction] = React.useState('');
  const [instructions, setInstructions] = React.useState([]);
  const [roundIndex, setRoundIndex] = React.useState(0);
  const [answerIndex, setAnswerIndex] = React.useState(0);

  const showInstructions1 = () => {
    const letters = ['A', 'B', 'C', 'D'];
    const instructionList = [];
    for (let i = 0; i < 1; i++) {
      const randomIndex = getRandomInteger(4);
      const randomLetter = letters[randomIndex];
      instructionList.push(randomLetter);
    }
    setShowing(true);
    setCurrentInstruction(instructionList[0]);
    setTimeout(() => {
      setCurrentInstruction('');
      setInstructions(instructionList);
      setShowing(false);
    }, 1000);    
  }

  const showInstructions2 = () => {
    const letters = ['A', 'B', 'C', 'D'];
    const instructionList = [];
    for (let i = 0; i < 2; i++) {
      const randomIndex = getRandomInteger(4);
      const randomLetter = letters[randomIndex];
      instructionList.push(randomLetter);
    }
    setShowing(true);
    setCurrentInstruction(instructionList[0]);
    setTimeout(() => {
      setTimeout(() => {
        setCurrentInstruction(instructionList[1]);
        setTimeout(() => {
          setCurrentInstruction('');
          setInstructions(instructionList);
          setShowing(false);
        }, 1000);
      }, 1000);    
      setCurrentInstruction('');
    }, 1000);    
  }

  const showInstructions3 = () => {
    const letters = ['A', 'B', 'C', 'D'];
    const instructionList = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = getRandomInteger(4);
      const randomLetter = letters[randomIndex];
      instructionList.push(randomLetter);
    }
    setShowing(true);
    setCurrentInstruction(instructionList[0]);
    setTimeout(() => {
      setTimeout(() => {
        setCurrentInstruction(instructionList[1]);
        setTimeout(() => {
          setCurrentInstruction('');

          setTimeout(() => {
            setCurrentInstruction(instructionList[2]);
            setTimeout(() => {
              setCurrentInstruction('');
              setInstructions(instructionList);
              setShowing(false);
            }, 1000);
          }, 1000);

        }, 1000);
      }, 1000);    
      setCurrentInstruction('');
    }, 1000);    
  }

  const showInstructions4 = () => {
    const letters = ['A', 'B', 'C', 'D'];
    const instructionList = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = getRandomInteger(4);
      const randomLetter = letters[randomIndex];
      instructionList.push(randomLetter);
    }
    setShowing(true);
    setCurrentInstruction(instructionList[0]);
    setTimeout(() => {
      setTimeout(() => {
        setCurrentInstruction(instructionList[1]);
        setTimeout(() => {
          setCurrentInstruction('');
          setTimeout(() => {
            setCurrentInstruction(instructionList[2]);
            setTimeout(() => {
              setCurrentInstruction('');

              setTimeout(() => {
                setCurrentInstruction(instructionList[3]);
                setTimeout(() => {
                  setCurrentInstruction('');
                  setInstructions(instructionList);
                  setShowing(false);
                }, 1000);
              }, 1000);

            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);    
      setCurrentInstruction('');
    }, 1000);    
  }

  const showInstructions5 = () => {
    const letters = ['A', 'B', 'C', 'D'];
    const instructionList = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = getRandomInteger(4);
      const randomLetter = letters[randomIndex];
      instructionList.push(randomLetter);
    }
    setShowing(true);
    setCurrentInstruction(instructionList[0]);
    setTimeout(() => {
      setTimeout(() => {
        setCurrentInstruction(instructionList[1]);
        setTimeout(() => {
          setCurrentInstruction('');
          setTimeout(() => {
            setCurrentInstruction(instructionList[2]);
            setTimeout(() => {
              setCurrentInstruction('');
              setTimeout(() => {
                setCurrentInstruction(instructionList[3]);
                setTimeout(() => {
                  setCurrentInstruction('');

                  setTimeout(() => {
                    setCurrentInstruction(instructionList[4]);
                    setTimeout(() => {
                      setCurrentInstruction('');
                      setInstructions(instructionList);
                      setShowing(false);
                    }, 1000);
                  }, 1000);

                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);    
      setCurrentInstruction('');
    }, 1000);    
  }

  // On load
  React.useEffect(() => {
    showInstructions1();
  }, []);

  // Click handler
  const clickHandler = (value) => {
    if (value !== instructions[answerIndex]) {
      alert('Incorrect!');
      showInstructions1();
      setRoundIndex(0);
      setAnswerIndex(0);
    } else if (answerIndex === roundIndex) {
      if (roundIndex !== 4) {
        if (roundIndex === 0) {
          showInstructions2();
        } else if (roundIndex === 1) {
          showInstructions3();
        } else if (roundIndex === 2) {
          showInstructions4();
        } else {
          showInstructions5();
        }
        setRoundIndex(roundIndex + 1);
        setAnswerIndex(0);
      } else {
        alert('You have won!');
        decrementValue();
        showInstructions1();
        setRoundIndex(0);
        setAnswerIndex(0);
      }
    } else {
      setAnswerIndex(answerIndex + 1);
    };
  };

  // Return
  return (
    <div style={{ ...outerContainerStyle, width: (bodyWidth) }}>
      <div style={{ ...cardContainer, ...rowContainerStyle }}>
        {showing && <>
          <button style={{ ...cardStyle, ...columnContainerStyle }} disabled><div style={{ ...rowContainerStyle, width: '100%' }}>A</div></button>
          <button style={{ ...cardStyle, ...columnContainerStyle }} disabled><div style={{ ...rowContainerStyle, width: '100%' }}>B</div></button>
          <button style={{ ...cardStyle, ...columnContainerStyle }} disabled><div style={{ ...rowContainerStyle, width: '100%' }}>C</div></button>
          <button style={{ ...cardStyle, ...columnContainerStyle }} disabled><div style={{ ...rowContainerStyle, width: '100%' }}>D</div></button>
        </>}
        {!showing && <>
          <button style={{ ...cardStyle, ...columnContainerStyle }} onClick={() => clickHandler('A')}><div style={{ ...rowContainerStyle, width: '100%' }}>A</div></button>
          <button style={{ ...cardStyle, ...columnContainerStyle }} onClick={() => clickHandler('B')}><div style={{ ...rowContainerStyle, width: '100%' }}>B</div></button>
          <button style={{ ...cardStyle, ...columnContainerStyle }} onClick={() => clickHandler('C')}><div style={{ ...rowContainerStyle, width: '100%' }}>C</div></button>
          <button style={{ ...cardStyle, ...columnContainerStyle }} onClick={() => clickHandler('D')}><div style={{ ...rowContainerStyle, width: '100%' }}>D</div></button>
        </>}
      </div>
      <div style={{ ...columnContainerStyle, height: '50%' }}>
        <div style={{ ...rowContainerStyle }}>
          <div style={{ ...instructionStyle }}>
            {currentInstruction}
          </div>
        </div>
      </div>
    </div>
  );
}
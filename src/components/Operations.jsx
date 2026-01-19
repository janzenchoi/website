import React from 'react';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle, buttonStyle } from '../helper/styles';
import { getRandomInteger } from '../helper/random';
import { decrementValue } from '../helper/storage';

export const Operations = () => {
  // Style
  const primaryBoxStyle = {
    height: '100px',
    width: '20%',
    backgroundColor: 'rgb(200,255,255)'
  };

  // Input numbers
  const [input1, setInput1] = React.useState(0);
  const [input2, setInput2] = React.useState(0);
  const [output, setOutput] = React.useState('');

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

  // Initialise
  const resetPage = () => {
    // Set inputs
    const temp1 = getRandomInteger(11) + 1;
    const temp2 = getRandomInteger(11) + 1;
    setInput1(temp1);
    setInput2(temp2);
    // Set outputs
    const operationIndex = getRandomInteger(4);
    if (operationIndex === 0) {
      setOutput(temp1 + temp2);
    } else if (operationIndex === 1) {
      setOutput(temp1 - temp2);
    } else if (operationIndex === 2) {
      setOutput(temp1 * temp2);
    } else {
      setOutput(Math.round(temp1 / temp2 * 10) / 10);
    }
  };
  React.useEffect(() => resetPage(), []);

  // Click handler
  const clickHandler = (operationIndex) => {
    let givenOutput = 0;
    if (operationIndex === 0) {
      givenOutput = input1 + input2;
    } else if (operationIndex === 1) {
      givenOutput = input1 - input2;
    } else if (operationIndex === 2) {
      givenOutput = input1 * input2;
    } else {
      givenOutput = Math.round(input1 / input2 * 10) / 10;
    }
    if (givenOutput === output) {
      alert('Correct!');
      decrementValue();
      resetPage();
    } else {
      alert('Incorrect!');
    }
  };

  // Return
  return (
    <div style={{ ...outerContainerStyle, ...columnContainerStyle, width: (bodyWidth) }}>
      <div style={{ ...rowContainerStyle, width: '100%' }}>
        <div style={{ ...primaryBoxStyle, ...columnContainerStyle }}>
          <div style={{ ...rowContainerStyle, fontSize: '20px' }}>
            {input1}
          </div>
        </div>
        <div style={{ ...primaryBoxStyle, ...columnContainerStyle }}>
          <div style={{ ...rowContainerStyle }}>
            <button style={{ ...buttonStyle, fontSize: '16px', width: '25px' }} onClick={() => {
              clickHandler(0);
            }}>+</button>
            <button style={{ ...buttonStyle, fontSize: '16px', width: '25px' }} onClick={() => {
              clickHandler(1);
            }}>-</button>
            <button style={{ ...buttonStyle, fontSize: '16px', width: '25px' }} onClick={() => {
              clickHandler(2);
            }}>x</button>
            <button style={{ ...buttonStyle, fontSize: '16px', width: '25px' }} onClick={() => {
              clickHandler(3);
            }}>÷</button>
          </div>
        </div>
        <div style={{ ...primaryBoxStyle, ...columnContainerStyle }}>
          <div style={{ ...rowContainerStyle, fontSize: '20px' }}>
            {input2}
          </div>
        </div>
        <div style={{ ...primaryBoxStyle, ...columnContainerStyle }}>
          <div style={{ ...rowContainerStyle, fontSize: '20px' }}>=</div>
        </div>
        <div style={{ ...primaryBoxStyle, ...columnContainerStyle }}>
          <div style={{ ...rowContainerStyle, fontSize: '20px' }}>
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export const Header = () => {
  // Styles
  const headerStyle = {
    height: '80px',
    width: '100vw',
    backgroundColor: '#eeeeee',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  };
  const stickyHeader = {
    position: 'fixed'
  };
  const logoStyle = {
    width: '50px',
    height: '50px',
    margin: '15px'
  };
  const navigationStyle = {
    fontSize: '20px',
    margin: '20px'
  };

  // Viewport variable
  const [isWide, setIsWide] = React.useState(false);
  window.addEventListener('resize', () => {
    setIsWide(window.innerWidth > 800);
  });
  React.useEffect(() => {
    setIsWide(window.innerWidth > 800);
  }, []);
  
  // Return
  return (
    <div style={{ ...headerStyle, ...stickyHeader }}>
      <img style={{ ...logoStyle }} src={logo} alt={'logo'}/>
      <div style={{ ...navigationStyle }}>
        {isWide && <>
          <Link to='/'>Home</Link>&nbsp;|&nbsp;
          <Link to='/default'>Default</Link>&nbsp;|&nbsp;
          <Link to='/array'>Array</Link>&nbsp;|&nbsp;
          <Link to='/grid'>Grid</Link>&nbsp;|&nbsp;
          <Link to='/puzzle'>Puzzle</Link>&nbsp;|&nbsp;
          <Link to='/blanko'>Blanko</Link>&nbsp;|&nbsp;
          <Link to='/snake'>Snake</Link>&nbsp;|&nbsp;
          <Link to='/typeracer'>TypeRacer</Link>
        </>}
        {!isWide && <>
          <Link to='/'>H</Link>&nbsp;|&nbsp;
          <Link to='/default'>D</Link>&nbsp;|&nbsp;
          <Link to='/array'>A</Link>&nbsp;|&nbsp;
          <Link to='/grid'>G</Link>&nbsp;|&nbsp;
          <Link to='/puzzle'>P</Link>&nbsp;|&nbsp;
          <Link to='/blanko'>B</Link>&nbsp;|&nbsp;
          <Link to='/snake'>S</Link>&nbsp;|&nbsp;
          <Link to='/typeracer'>T</Link>
        </>}
      </div>
    </div>
  );
}
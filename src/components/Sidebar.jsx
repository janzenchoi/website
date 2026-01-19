import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

export const Sidebar = () => {
  // Styles
  const sidebarStyle = {
    height: '100vh',
    width: '100px',
    backgroundColor: '#eee',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  };
  const stickySidebar = {
    position: 'fixed',
    right: '0px'
  };
  const logoContainer = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  };
  const logoStyle = {
    width: '50px',
    height: '50px',
    marginTop: '15px',
    marginBottom: '15px'
  };
  const navigationStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: '15px',
    margin: '10px'
  };

  // Viewport variable
  const [width, setWidth] = React.useState(0);
  const [sidebarWidth, setSidebarWidth] = React.useState(0);
  const setWidthValues = () => {
    setWidth(window.innerWidth);
    if (window.innerWidth > 1400) {
      setSidebarWidth('100px');
    } else if (window.innerWidth > 800 && window.innerWidth <= 1400) {
      setSidebarWidth('60px');
    } else if (window.innerWidth <= 800) {
      setSidebarWidth('30px');
    }
  };
  window.addEventListener('resize', () => setWidthValues());
  React.useEffect(() => setWidthValues(), []);
  
  // Return
  return (
    <div style={{ ...sidebarStyle, ...stickySidebar, width: (sidebarWidth) }}>
      {width >= 800 && <div style={{ ...logoContainer, width: (sidebarWidth) }}>
        <img style={{ ...logoStyle }} src={logo} alt={'logo'}/>
      </div>}
      {width > 1400 && <>
        <Link style={{ ...navigationStyle }} to='/home'>Home</Link>
        <Link style={{ ...navigationStyle }} to='/operations'>Operations</Link>
        <Link style={{ ...navigationStyle }} to='/memory'>Memory</Link>
        <Link style={{ ...navigationStyle }} to='/space'>Space</Link>
      </>}
      {width <= 1400 && <>
        <Link style={{ ...navigationStyle }} to='/home'>H</Link>
        <Link style={{ ...navigationStyle }} to='/operations'>Op</Link>
        <Link style={{ ...navigationStyle }} to='/memory'>Me</Link>
        <Link style={{ ...navigationStyle }} to='/space'>S</Link>
      </>}
    </div>
  );
}
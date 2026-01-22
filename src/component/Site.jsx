import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { useViewport } from "../helper/Viewport";
import { Template } from './page/Template';
import { Settings } from './page/Settings';

/**
 * Site
 * @returns site object
 */
export const Site = () => {
  
  // Deals with mobile / desktop state
  const { isMobile } = useViewport();
  const [ mobileMode, setMobileMode ] = useState(isMobile);
  const [ forceMobile, setForceMobile ] = useState(false);
  useEffect(() => {
    setMobileMode(isMobile || forceMobile);
  }, [isMobile, forceMobile]);

  // Define style for site
  const siteStyle = {
    backgroundColor: "var(--colour-1)",
    transition: "background-color 0.3s",
    minWidth: "400px",
  };

  // Returns the site
  return <div style={siteStyle}>
    <HashRouter>
      <Header mobileMode={mobileMode} forceMobile={forceMobile} setForceMobile={setForceMobile}/>
      <Routes>
        <Route path='/' element={<Template/>}/>
        <Route path='/settings' element={<Settings/>}/>
      </Routes>
    </HashRouter>
  </div>
}
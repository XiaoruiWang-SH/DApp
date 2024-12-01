import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './LayoutStyle.css';
import home_icon from '../res/home_icon.png';
import user_icon from '../res/user_icon.png';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';


const Layout = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(false);

    const homeIconClick = () => {
        navigate("/");
    };

    const loginClick = () => {
        setLogin(true);
    };
    const logoutClick = () => {
        setLogin(false);
    };

    const onProcessClick = () => {
        navigate("/onprocess");
    };

    const publishClick = () => {
        navigate("/publish");
    };

    const HeaderLogin = () => {
        return (
            <div>
                {login ?  (
                    // <button className='button' onClick={logoutClick}> 
                    // Logout
                    // </button>
                    <div className='header-usericon '>
                        <img src={user_icon} alt="Icon" />
                    </div>
                    ) : (
                        <button className='button' onClick={loginClick}>
                        Login
                        </button>
                        )}
            </div>
        );
    };

    const Header = () => {
        return (
          <div className='header'>
            <div className='header-left'  onClick={homeIconClick}>
                <div className='header-homeicon'>
                    <img src={home_icon} alt="Icon" />
                </div>
                <div className='header-title'>
                    <text>{"D-Auction System"}</text>
                </div>
                
            </div>
            <div className='header-right'>
                <button className='button' hidden={!login} onClick={publishClick}>
                    Publish
                </button>

                <button className='button' hidden={!login} onClick={onProcessClick}>
                    onProcess
                </button>
                
                <HeaderLogin />
            </div>
          </div>
        );
      };  
      
    const Content = () => {
        return (
          <main className='main-section'>
            <Outlet /> {/* Dynamically replaced by route-specific content */}
          </main>
        );
      };

      const NavList = () => {
        return (
        //     <div>
        //     <text>层层递进页面</text>
        //     {step === 1 && (
        //       <text> / 这是第一步的内容</text>
        //     )}
        //   </div>

        <header>
            <h1>My Website</h1>
            <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            </nav>
        </header>
        );
    };
      
      
    const Footer = () => {
        return (
          <footer >
            <p>© 2024 D-Auction System</p>
          </footer>
        );
      };


  return (
    <div className='layout'>
      <Header />
      {/* <NavList /> */}
      <div className='container'>
          <Content />
      </div>
      <Footer />
  </div>
  );
};

export default Layout;

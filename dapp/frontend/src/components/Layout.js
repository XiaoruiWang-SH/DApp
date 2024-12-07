import React, { useContext }  from 'react';
import { Outlet, Link } from 'react-router-dom';
import './LayoutStyle.css';
import home_icon from '../res/home_icon.png';
import user_icon from '../res/user_icon.png';
import favourite_icon from '../res/favourite_icon.png';
import sold_icon from '../res/sold_icon.png';
import balance_icon from '../res/balance_icon.png';
import buy_icon from '../res/buy_icon.png';
import logout_icon from '../res/logout_icon.png';

import { useNavigate, useLocation} from "react-router-dom";
import { useState, useRef, useEffect } from 'react';

import {connectWallet, connection, registerUser, listenForUserRegistration} from '../contracts/interaction';
import { AppContext,  AppProvider} from './Context';



const Layout = () => {
    const navigate = useNavigate();
    // const [login, setLogin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Reference to the menu container
    const location = useLocation();

    const { login, setLogin, address, setAddress} = useContext(AppContext);


    useEffect(() => {
        console.log("Login:", login);
        console.log("Address:", address);

        const storedLoginStatus = localStorage.getItem("isLoggedIn");
        const storedAddress = localStorage.getItem("address");
        if (storedLoginStatus === "true") {
            setLogin(true);
            setAddress(storedAddress);
        }

        const handleClickOutside = (event) => {
          // Check if the clicked element is outside the menu
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeMenu();
          }
        };
        // Attach event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        
        
    }, []);

    const homeIconClick = () => {
        navigate("/");
    };

    const loginClick = async () => {
        
        const address = await connectWallet();
        console.log("Contract Address:", address);
        if (!address) {
            return;
        }
        const auctionContract = await connection();
        await listenForUserRegistration(auctionContract);
        await registerUser(auctionContract);

        alert("Login successful!, address: " + address);
        setLogin(true);
        setAddress(address);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("address", address);

    };
    const logoutClick = () => {
        setLogin(false);
        setAddress("");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("address");
    };

    const onProcessClick = () => {
        navigate("/onprocess");
    };

    const publishClick = () => {
        // navigate("/publish");
        navigate("/publishfake");
    };

    const userIconClick = () => {
        console.log("UserIconClick");
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        console.log("closeMenu");
    };

    const myfavouriteClick = () => {
        navigate("/myFavorites");
        closeMenu();
        console.log("myfavouriteClick");
    };

    const buyClick = () => {
        navigate("/myBought");
        closeMenu();
        console.log("buyClick");
    };
    const myPublishClick = () => {
        navigate("/mySold");
        closeMenu();
        console.log("soldClick");
    };
    const balanceClick = () => {
        closeMenu();
        console.log("balanceClick");
    };

    const Popup = () => {
        return (
            <div className='user-menu-container' ref={menuRef}>
            <div className='popup-menu' >
                <ul>
                    <li onClick={myPublishClick}>
                        <div className='popup-menu-item'>
                            <img src={sold_icon} alt="Icon"/>
                            <text>My Publish</text>
                        </div>
                    </li>
                    <li onClick={buyClick}>
                        <div className='popup-menu-item'>
                            <img src={buy_icon} alt="Icon"/>
                            <text>My bought</text>
                        </div>
                    </li>
                    {/* <li onClick={soldClick}>
                        <div className='popup-menu-item'>
                            <img src={sold_icon} alt="Icon"/>
                            <text>{"Sold"}</text>
                        </div>
                    </li> */}
                    <li onClick={balanceClick}>
                        <div  className='popup-menu-item'>
                            <img src={balance_icon} alt="Icon"/>
                            <text>My Balance</text>
                        </div>
                    </li>
                </ul>
                <hr className='hr'/>
                <ul>
                    <li onClick={closeMenu}>
                        <div className='popup-menu-item' onClick={logoutClick}>
                            <img src={logout_icon} alt="Icon"/>
                            <text>Logout</text>
                        </div>
                    </li>
                </ul>

            </div>
            </div>
        );
    };

    const HeaderLogin = () => {
        return (
            <div>
                {login ?  (
                    // <button className='button' onClick={logoutClick}> 
                    // Logout
                    // </button>
                    <div className='header-usericon'>
                        <img src={user_icon} alt="Icon"  onClick={userIconClick}/>
                    {isMenuOpen && (<Popup />)}
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
                <div className='header-homeicon' >
                    <img src={home_icon} alt="Icon" />
                </div>
                <div className='header-title'>
                    <text>D-Auction System</text>
                </div>
                
            </div>
            <div className='header-right'>
                <button className='button' hidden={!login} onClick={publishClick}>
                    Publish
                </button>

                {/* <button className='button' hidden={!login} onClick={onProcessClick}>
                    onProcess
                </button> */}
                
                <HeaderLogin />
            </div>
          </div>
        );
      };  
      
    const Content = () => {
        return (
        <>
        {/* <div>
            <h5>{location.pathname}</h5>
            <hr />
        </div> */}
          <main className='main-section'>
            <Outlet /> {/* Dynamically replaced by route-specific content */}
          </main>
          </>
        );
      };

      const NavList = () => {
        return (
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
          <div className='footer' >
            <p>© 2024 D-Auction System</p>
          </div>
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

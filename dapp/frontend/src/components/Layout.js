import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './LayoutStyle.css';


const Layout = () => {
    const Header = () => {
        return (
          <header >
            <h1>{"Auction System"}</h1>
          </header>
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
            <p>© 2024 My Website</p>
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

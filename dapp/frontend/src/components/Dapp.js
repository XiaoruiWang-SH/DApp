import React from 'react';
import "./HomepageStyle.css";
import GoodsItem from './GoodsItem';
import { useState, useEffect } from 'react';
import art from '../res/art.jpg';
import jewellery from '../res/jewellery.jpg';
import motorbike from '../res/motorbike.jpg';
import watch from '../res/watch.jpg';

export default function Dapp() {

const [goodsItems, setGoodsItems] = useState([]);

useEffect(() => {
    const goodsItems = [
        {
          title: "Beautiful Sunset",
          image: art,
          description: "Enjoy the beautiful sunset from the beach."
        },
        {
          title: "Mountain Adventure",
          image: jewellery,
          description: "Explore the majestic mountains with us."
        },
        {
          title: "City Lights",
          image: motorbike,
          description: "Experience the vibrant city nightlife."
        },
        {
          title: "hahah Lights",
          image: watch,
          description: "Experience the vibrant city nightlife."
        },
        {
            title: "Beautiful Sunset",
            image: art,
            description: "Enjoy the beautiful sunset from the beach."
          },
          {
            title: "Mountain Adventure",
            image: jewellery,
            description: "Explore the majestic mountains with us."
          },
          {
            title: "City Lights",
            image: motorbike,
            description: "Experience the vibrant city nightlife."
          },
          {
            title: "hahah Lights",
            image: watch,
            description: "Experience the vibrant city nightlife."
          },
          {
            title: "Beautiful Sunset",
            image: art,
            description: "Enjoy the beautiful sunset from the beach."
          },
          {
            title: "Mountain Adventure",
            image: jewellery,
            description: "Explore the majestic mountains with us."
          },
          {
            title: "City Lights",
            image: motorbike,
            description: "Experience the vibrant city nightlife."
          },
          {
            title: "hahah Lights",
            image: watch,
            description: "Experience the vibrant city nightlife."
          }
      ];
      setGoodsItems(goodsItems);
  }, [setGoodsItems]);


const Header = () => {
    return (
      <header >
        <h1>{"Auction System"}</h1>
      </header>
    );
  };  
  
  const Content = () => {
    return (
      <main>
        <div className='card-container'>
            {
                goodsItems.map((goodsItem, index) => (
                    <GoodsItem
                        key={index}
                        title={goodsItem.title}
                        image={goodsItem.image}
                        description={goodsItem.description}
                    />
                ))
            }
        </div>
      </main>
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
    <div className='container'>
      <Header />
      <div className='main-section'>
        {/* <Sidebar /> */}
        <Content />
      </div>
      <Footer />
    </div>
  );

};

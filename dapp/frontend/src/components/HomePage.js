import React from "react";
import "./HomepageStyle.css";
import GoodsItem from './GoodsItem';
import { useState, useEffect } from 'react';
import art from '../res/art.jpg';
import jewellery from '../res/jewellery.jpg';
import motorbike from '../res/motorbike.jpg';
import watch from '../res/watch.jpg';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function HomePage() {
    const [goodsItems, setGoodsItems] = useState([]);

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            console.log("Request Headers:", config.headers);
            return config;
        });

        axios.get('/api', {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
                console.log(response.data);
                setGoodsItems(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Headers:", error.config.headers);
                    console.log("Error Response Data:", error.response.data);
                  } else {
                    console.log("Error:", error.message);
                  }
            });
    }, [setGoodsItems]);

    const [step, setStep] = useState(1);
    const nextStep = () => setStep(step + 1);
    const reset = () => setStep(1);
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        navigate("/itemDes", { state: { id: item.id } });
        console.log("Item clicked:", item.id);
    };

    return (
        <div className='card-container'>
            {
                goodsItems.map((goodsItem, index) => (
                    <GoodsItem
                        key={index}
                        title={goodsItem.title}
                        image={goodsItem.image}
                        startBid={goodsItem.startBid}
                        highestBid={goodsItem.highestBid}
                        totalBids={goodsItem.totalBids}
                        endTime={goodsItem.endTime}
                        onClick={() => handleItemClick(goodsItem)}
                    />
                ))
            }
        </div>
    );

}
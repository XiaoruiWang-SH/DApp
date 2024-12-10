import React from "react";
import "./HomepageStyle.css";
import GoodsItem from './GoodsItem';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AppContext,  AppProvider} from './Context';


export default function HomePage() {
    const [goodsItems, setGoodsItems] = useState([]);
    const { login, setLogin, address, setAddress, pagetitle, setPagetitle} = useContext(AppContext);
    setPagetitle("Home Page");

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            // console.log("Request Headers:", config.headers);
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
        const timeEnd = new Date(item.EndTime) > new Date() ? false : true
        navigate("/itemDes", { state: { id: item.id, isTimeEnd: timeEnd } });
        console.log("Item clicked:", item.id);
    };

    const itemIsEnd = (item) => {
        if (item.Status == 1) {
            return true;
        }
        const timeEnd = new Date(item.EndTime) > new Date() ? false : true
        return timeEnd;
    };

    return (
        <div className='card-container'>
            {
                goodsItems.map((goodsItem, index) => (
                    <GoodsItem
                        key={index}
                        title={goodsItem.Title}
                        image={goodsItem.Imgurl}
                        startBid={goodsItem.StartBid}
                        highestBid={goodsItem.CurrentHighest}
                        totalBids={goodsItem.Total}
                        endTime={goodsItem.EndTime}
                        timeEnd={itemIsEnd(goodsItem)}
                        onClick={() => handleItemClick(goodsItem)}
                    />
                ))
            }
        </div>
    );

}
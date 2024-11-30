import React from "react";
import "./HomepageStyle.css";
import GoodsItem from './GoodsItem';
import { useState, useEffect } from 'react';
import art from '../res/art.jpg';
import jewellery from '../res/jewellery.jpg';
import motorbike from '../res/motorbike.jpg';
import watch from '../res/watch.jpg';
import { useNavigate } from "react-router-dom";


export default function HomePage() {
    const [goodsItems, setGoodsItems] = useState([]);

    useEffect(() => {
        const goodsItems = [
            {
                id: 1,
                title: "Beautiful Sunset enjoy the beautiful sunset from the beach",
                image: art,
                description: "Enjoy the beautiful sunset from the beach.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 2,
                title: "Mountain Adventure",
                image: jewellery,
                description: "Explore the majestic mountains with us.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 3,
                title: "City Lights",
                image: motorbike,
                description: "Experience the vibrant city nightlife.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 4,
                title: "hahah Lights",
                image: watch,
                description: "Experience the vibrant city nightlife.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 5,
                title: "Beautiful Sunset",
                image: art,
                description: "Enjoy the beautiful sunset from the beach.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 6,
                title: "Mountain Adventure",
                image: jewellery,
                description: "Explore the majestic mountains with us.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 7,
                title: "City Lights",
                image: motorbike,
                description: "Experience the vibrant city nightlife.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 8,
                title: "hahah Lights",
                image: watch,
                description: "Experience the vibrant city nightlife.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 9,
                title: "Beautiful Sunset",
                image: art,
                description: "Enjoy the beautiful sunset from the beach.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 10,
                title: "Mountain Adventure",
                image: jewellery,
                description: "Explore the majestic mountains with us.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 11,
                title: "City Lights",
                image: motorbike,
                description: "Experience the vibrant city nightlife.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            },
            {
                id: 12,
                title: "hahah Lights",
                image: watch,
                description: "Experience the vibrant city nightlife.",
                startBid: 100,
                highestBid: 200,
                totalBids: 10,
                endTime: "2024-01-01 12:00:00"
            }
        ];
        setGoodsItems(goodsItems);
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
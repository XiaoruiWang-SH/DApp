import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import ItemDes from './ItemDes';
import Layout from './Layout';
import PublishPage from './PublishPage.js';
import Onprocess from './Onprocess.js';
import MyFavorites from './MyFavorites.js';
import MyBought from './MyBought.js';
import MySold from './MySold.js';
import PublishPageFake from './PublishPageFake.js';



export default function Dapp() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<HomePage />} />
                <Route path="itemDes" element={<ItemDes />} />
                <Route path="publish" element={<PublishPage />} />
                <Route path="onprocess" element={<Onprocess />} />
                <Route path="myFavorites" element={<MyFavorites />} />
                <Route path="myBought" element={<MyBought />} />
                <Route path="mySold" element={<MySold />} />
                <Route path="publishfake" element={<PublishPageFake />} />
            </Route>
          </Routes>
        </Router>
      );

};

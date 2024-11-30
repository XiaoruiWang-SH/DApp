import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import ItemDes from './ItemDes';
import Layout from './Layout';
import PublishPage from './PublishPage.js';



export default function Dapp() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<HomePage />} />
                <Route path="itemDes" element={<ItemDes />} />
                <Route path="publish" element={<PublishPage />} />
            </Route>
          </Routes>
        </Router>
      );

};

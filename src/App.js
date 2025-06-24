import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import LoginPage from './pages/login/Login';
import RegisterPage from './pages/Register/register';
import Profile from './pages/profile/profile';
import Stays from './pages/stays/stays';
import Flights from './pages/flights/flights';
import MoneyExchange from './pages/money-exchange/money-exchange';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/stays' element={<Stays />} />
        <Route path='/flights' element={<Flights />} />
        <Route path='/money-exchange' element={<MoneyExchange />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

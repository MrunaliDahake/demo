import React, { useState, useEffect } from 'react';
import {
    FaAngleRight,
    FaAngleLeft,
    FaChartBar,
    FaThLarge,
    FaShoppingCart,
    FaCog,
    FaSignOutAlt,
    FaBars
} from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import "../../src/Navbar1.css";

import logo from '../assets/images/logo.png';


const ICON_SIZE = 20;

function Navbar({ visible, show, selectedCategory, setSelectedCategory, setSelectedCharacters }) {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const response = await fetch('https://rickandmortyapi.com/api/episode');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEpisodes(data.results);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, []);

    const handleCategoryClick = async (episode) => {
        if (selectedCategory && selectedCategory.id === episode.id) {
            setSelectedCategory(null); 
            setSelectedCharacters([]); 
        } else {
            setSelectedCategory(episode);
        }
    };

  

    return (
        <>
            <div className="mobile-nav">
                <button className="mobile-nav-btn" onClick={() => show(!visible)}>
                    <FaBars size={24} />
                </button>
            </div>
            <nav className={!visible ? 'navbar' : ''}>
            <h3 className='nav-topname'>Episodes</h3>
                <div className="nav-content">
                   
                    <div className="links">
                      
                        {episodes.length > 0 && episodes.map(episode => (
                            <NavLink
                                key={episode.id}
                                to="/dashboard"
                                onClick={() => handleCategoryClick(episode)}
                                className={`nav-link ${selectedCategory && selectedCategory.id === episode.id ? 'highlighted' : ''}`}
                            >
                                <FaThLarge size={ICON_SIZE} />
                                <span>{episode.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

            </nav>
        </>
    );
}

export default Navbar;
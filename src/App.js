import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import "../src/index.css";/
// import './App.css';
// import '../src/App.css';
import "../src/Navbar1.css";
import Navbar from './Component/Navbar';

const CHARACTERS_PER_PAGE = 10;
const PAGES_TO_SHOW = 4; 

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [navVisible, setNavVisible] = useState(true);
  const [allCharacters, setAllCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const showNavbar = (visible) => setNavVisible(visible);

  useEffect(() => {
    const fetchAllCharacters = async (page = 1, characters = []) => {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        characters = characters.concat(data.results);
        if (data.info.next) {
          await fetchAllCharacters(page + 1, characters);
        } else {
          setAllCharacters(characters);
          setSelectedCharacters(characters);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAllCharacters();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory.characters) {
      const fetchCharactersForEpisode = async () => {
        try {
          const characterDataPromises = selectedCategory.characters.map(url => fetch(url).then(res => res.json()));
          const characterData = await Promise.all(characterDataPromises);
          setSelectedCharacters(characterData);
          setCurrentPage(1); 
        } catch (err) {
          setError(err);
        }
      };

      fetchCharactersForEpisode();
    } else {
      setSelectedCharacters(allCharacters); 
      setCurrentPage(1); 
    }
  }, [selectedCategory, allCharacters]);

  const totalPages = Math.ceil(selectedCharacters.length / CHARACTERS_PER_PAGE);

  const currentCharacters = selectedCharacters.slice(
    (currentPage - 1) * CHARACTERS_PER_PAGE,
    currentPage * CHARACTERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate the range of pages to display
  const startPage = Math.max(1, currentPage - Math.floor(PAGES_TO_SHOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGES_TO_SHOW - 1);
  const pages = [];
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

 

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          visible={navVisible}
          show={showNavbar}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedCharacters={setSelectedCharacters}
        />
        <div className={!navVisible ? "page" : "page page-with-navbar"}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={
              <div className='main-container'>
                <h1 className='firstname'>{selectedCategory ? selectedCategory.name : 'All Characters'}</h1>
                <div className="grid-container">
                  {currentCharacters.map(character => (
                    <div key={character.id} className="grid-item">
                      <img src={character.image} alt={character.name} />
                      <p>{character.name}</p>
                    </div>
                  ))}
                </div>
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {pages.map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? 'active' : ''}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            } />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}



export default App;

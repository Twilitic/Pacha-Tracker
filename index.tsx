import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// === HELPER HOOK for LOCALSTORAGE ===
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


const App = () => {
  // === DATA ===
  const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
  const DAYS_IN_SEASON = 28;

  const ANIMAL_SPECIES = ['Aurochs', 'Bison', 'Guanaco', 'Horse', 'Ibex', 'Junglefowl', 'Ostrich', 'Wild Boar'];
  
  const ANIMAL_DATA = [
      { name: 'Golden Aurochs', species: 'Aurochs', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [7, 21], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/e/eb/Aurochs_Golden.png/revision/latest?cb=20231210040816', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Snow Aurochs', species: 'Aurochs', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [14, 28], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/e/eb/Aurochs_Snow.png/revision/latest?cb=20231210040044', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Flame Aurochs', species: 'Aurochs', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [10], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/a/a6/Aurochs_Flame.png/revision/latest?cb=20231210040744', spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Bison', species: 'Bison', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [3, 17], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/2/25/Golden_Bison.png/revision/latest?cb=20230506182836', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Chicle Bison', species: 'Bison', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [10, 24], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/1/19/Chicle_Bison.png/revision/latest?cb=20230519013735', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Sky Cloud Bison', species: 'Bison', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [22], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/d/d3/Sky_Cloud_Bison.png/revision/latest?cb=20230523121819', spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Guanaco', species: 'Guanaco', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [5, 19], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/8/84/Golden_Guanaco.png/revision/latest?cb=20230524035717', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Fiery Guanaco', species: 'Guanaco', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [12, 26], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/b/b0/Fiery_Guanaco.png/revision/latest?cb=20230524035234', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Icy Guanaco', species: 'Guanaco', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [2], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/c/cf/Icy_Guanaco.png/revision/latest?cb=20230524035718', spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Steppe Horse', species: 'Horse', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [7, 21], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/2/27/Golden_Steppe_Horse.png/revision/latest?cb=20230508201208', spawnLocation: 'Caves', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Cloudy Day Steppe Horse', species: 'Horse', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [14, 28], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/2/2c/Cloudy_Day_Steppe_Horse.png/revision/latest?cb=20230508192728', spawnLocation: 'Caves', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Starry Night Steppe Horse', species: 'Horse', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [18], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/8/84/Starry_Night_Steppe_Horse.png/revision/latest?cb=20230508192512', spawnLocation: 'Caves', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Ibex', species: 'Ibex', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [2, 16], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/a/aa/Golden_Ibex.png/revision/latest?cb=20230507093544', spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Shallow Waters Ibex', species: 'Ibex', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [9, 23], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/8/83/Shallow_Waters_Ibex.png/revision/latest?cb=20230507093544', spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Spider Ibex', species: 'Ibex', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [26], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/3/31/Spider_Ibex.png/revision/latest?cb=20230507093544', spawnLocation: 'Forest', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Junglefowl', species: 'Junglefowl', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [6, 20], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/e/ea/Golden_Junglefowl.png/revision/latest?cb=20230524100048', spawnLocation: 'Jungle', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Amethyst Junglefowl', species: 'Junglefowl', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [13, 27], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/a/aa/Amethyst_Junglefowl.png/revision/latest?cb=20230524095653', spawnLocation: 'Jungle', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Grand Turquoise Junglefowl', species: 'Junglefowl', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [10], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/0/09/Grand_Turquoise_Junglefowl.png/revision/latest?cb=20230524100048', spawnLocation: 'Jungle', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Ostrich', species: 'Ostrich', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [4, 18], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/1/19/Golden_Ostrich.png/revision/latest?cb=20230507200701', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Sapphire Ostrich', species: 'Ostrich', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [11, 25], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/d/d6/Sapphire_Ostrich.png/revision/latest?cb=20230506205846', spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Rainbow Ostrich', species: 'Ostrich', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [14], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/8/8c/Rainbow_Ostrich.png/revision/latest?cb=20230508191157', spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
      { name: 'Golden Wild Boar', species: 'Wild Boar', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [1, 15], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/7/77/Golden_Wild_Boar.png/revision/latest?cb=20230507134347', spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Fiber Wild Boar', species: 'Wild Boar', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [8, 22], minYear: 1, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/c/ca/Fiber_Wild_Boar.png/revision/latest?cb=20230524062759', spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
      { name: 'Fire Wild Boar', species: 'Wild Boar', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [6], minYear: 2, imageUrl: 'https://static.wikia.nocookie.net/roots_of_pacha/images/c/ca/Fire_Wild_Boar.png/revision/latest?cb=20230524062759', spawnLocation: 'Forest', unlockReqs: { colors: 6, total: 12 } },
  ];
  
  const initialProgress = ANIMAL_SPECIES.reduce((acc, species) => {
    acc[species] = { colors: 0, total: 0 };
    return acc;
  }, {});

  // === STATE ===
  const [currentDate, setCurrentDate] = useLocalStorage('pacha_currentDate', { year: 1, seasonIndex: 0, day: 1 });
  const [tamingProgress, setTamingProgress] = useLocalStorage('pacha_tamingProgress', initialProgress);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [filters, setFilters] = useState({
    rarity: 'all',
    species: 'all',
    unlockedOnly: false,
    year: 'all'
  });

  // === LOGIC ===
  const isUnlocked = (animal) => {
    const progress = tamingProgress[animal.species];
    if (!progress) return false;
    return progress.colors >= animal.unlockReqs.colors && progress.total >= animal.unlockReqs.total;
  };

  const spawnsByDay = useMemo(() => {
    const spawns = {};
    for (let i = 1; i <= DAYS_IN_SEASON; i++) {
      spawns[i] = [];
    }

    ANIMAL_DATA.forEach(animal => {
      const currentSeasonName = SEASONS[currentDate.seasonIndex];
      if (animal.seasons.includes(currentSeasonName)) {
        animal.days.forEach(day => {
          if (spawns[day]) {
            spawns[day].push(animal);
          }
        });
      }
    });
    return spawns;
  }, [currentDate.seasonIndex]);
  
  const handleDateChange = (dayDelta) => {
    setCurrentDate(prev => {
        let newDay = prev.day + dayDelta;
        let newSeasonIndex = prev.seasonIndex;
        let newYear = prev.year;

        if (newDay > DAYS_IN_SEASON) {
            newDay = 1;
            newSeasonIndex++;
        } else if (newDay < 1) {
            newDay = DAYS_IN_SEASON;
            newSeasonIndex--;
        }

        if (newSeasonIndex >= SEASONS.length) {
            newSeasonIndex = 0;
            newYear++;
        } else if (newSeasonIndex < 0) {
            newSeasonIndex = SEASONS.length - 1;
            newYear--;
        }
        
        if (newYear < 1) {
          newYear = 1;
          newSeasonIndex = 0;
          newDay = 1;
        }

        return { year: newYear, seasonIndex: newSeasonIndex, day: newDay };
    });
  };

  const handleSeasonChange = (seasonDelta) => {
      setCurrentDate(prev => {
          let newSeasonIndex = prev.seasonIndex + seasonDelta;
          let newYear = prev.year;

          if (newSeasonIndex >= SEASONS.length) {
              newSeasonIndex = 0;
              newYear++;
          } else if (newSeasonIndex < 0) {
              newSeasonIndex = SEASONS.length - 1;
              newYear--;
          }
          if (newYear < 1) {
            newYear = 1;
            newSeasonIndex = 0;
          }
          return { ...prev, year: newYear, seasonIndex: newSeasonIndex };
      });
  };


  const upcomingSpawns = useMemo(() => {
    const upcoming = [];
    let searchYear = currentDate.year;
    let searchSeasonIndex = currentDate.seasonIndex;
    let searchDay = currentDate.day;

    while (upcoming.length < 5 && searchYear < 10) { // Limit search to 10 years to prevent infinite loops
        const seasonName = SEASONS[searchSeasonIndex];
        const spawnsOnDay = ANIMAL_DATA.filter(animal => 
            animal.seasons.includes(seasonName) && 
            animal.days.includes(searchDay) &&
            isUnlocked(animal) &&
            searchYear >= animal.minYear
        );

        if (spawnsOnDay.length > 0) {
            spawnsOnDay.forEach(spawn => {
                if(upcoming.length < 5) {
                    upcoming.push({ ...spawn, date: { year: searchYear, season: seasonName, day: searchDay } });
                }
            });
        }

        searchDay++;
        if (searchDay > DAYS_IN_SEASON) {
            searchDay = 1;
            searchSeasonIndex++;
            if (searchSeasonIndex >= SEASONS.length) {
                searchSeasonIndex = 0;
                searchYear++;
            }
        }
    }
    return upcoming;
  }, [tamingProgress, currentDate]);

  const filteredSpawns = (day) => {
    let daySpawns = spawnsByDay[day] || [];

    return daySpawns.filter(animal => {
      const yearFilter = filters.year === 'all' || (filters.year === '1' && animal.minYear <= 1) || (filters.year === '2+' && currentDate.year >= animal.minYear);
      const rarityFilter = filters.rarity === 'all' || animal.rarity === filters.rarity || (filters.rarity === 'Golden' && animal.rarity === 'Golden');
      const speciesFilter = filters.species === 'all' || animal.species === filters.species;
      const unlockedFilter = !filters.unlockedOnly || isUnlocked(animal);
      const minYearFilter = currentDate.year >= animal.minYear;
      
      return rarityFilter && speciesFilter && unlockedFilter && yearFilter && minYearFilter;
    });
  }

  // === RENDER ===
  return (
    <>
      <style>{`
        :root {
          --bg-color: #1a1a1a;
          --bg-secondary: #2c2c2c;
          --bg-tertiary: #444;
          --text-color: #e0e0e0;
          --text-muted: #888;
          --accent-color: #ffc500;
          --rare-color: #66d9ef;
          --legendary-color: #f92672;
          --golden-color: #e6db74;
          --border-color: #555;
          --font-family: 'Kumbh Sans', sans-serif;
          --shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        body {
          font-family: var(--font-family);
          background-color: var(--bg-color);
          color: var(--text-color);
          margin: 0;
          padding: 1rem;
        }
        #root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1400px;
          margin: auto;
        }
        .main-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .main-layout {
            grid-template-columns: 3fr 1fr;
          }
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }
        .header h1 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--accent-color);
        }
        .controls-container {
          background-color: var(--bg-secondary);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: var(--shadow);
        }
        .date-controls, .filter-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }
        .date-controls { margin-bottom: 1rem; }
        .date-display {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          min-width: 200px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }
        .day-cell {
          background-color: var(--bg-secondary);
          border-radius: 6px;
          padding: 8px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: 1px solid var(--border-color);
        }
        .day-number {
          font-weight: 700;
          color: var(--text-muted);
          text-align: right;
          margin-bottom: 4px;
        }
        .current-day {
          border: 2px solid var(--accent-color);
          box-shadow: 0 0 10px var(--accent-color);
        }
        .animal-spawn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .animal-spawn:hover { transform: scale(1.05); }
        .animal-spawn.locked { opacity: 0.4; filter: grayscale(80%); }
        .animal-spawn img { width: 24px; height: 24px; object-fit: contain; }
        .Rare { background-color: rgba(102, 217, 239, 0.2); }
        .Legendary { background-color: rgba(249, 38, 114, 0.2); }
        .Golden { background-color: rgba(230, 219, 116, 0.2); }

        .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        .upcoming-spawns, .settings-box {
          background-color: var(--bg-secondary);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: var(--shadow);
        }
        .upcoming-spawns h3 { margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
        .upcoming-list { list-style: none; padding: 0; margin: 0; }
        .upcoming-item { display: flex; align-items: center; gap: 10px; padding: 0.5rem 0; border-bottom: 1px solid var(--bg-tertiary); }
        .upcoming-item:last-child { border-bottom: none; }
        .upcoming-item img { width: 32px; height: 32px; object-fit: contain; }
        
        button, select {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
          color: var(--text-color);
          font-family: var(--font-family);
          cursor: pointer;
          font-size: 0.9rem;
        }
        button:hover { background-color: #555; }
        
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: var(--bg-secondary);
          padding: 2rem;
          border-radius: 8px;
          box-shadow: var(--shadow);
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none; border: none; font-size: 1.5rem;
          color: var(--text-muted); cursor: pointer;
        }
        .settings-grid { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; align-items: center; }
        .settings-grid label { font-weight: bold; }
        input[type="number"] {
          width: 60px;
          padding: 0.5rem;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          border-radius: 4px;
        }
        
        .animal-detail-modal { max-width: 400px; text-align: center; }
        .animal-detail-modal img { max-width: 150px; margin: 1rem auto; display: block; }
        .animal-detail-modal h2 { margin: 0; }
        .animal-rarity.Rare { color: var(--rare-color); }
        .animal-rarity.Legendary { color: var(--legendary-color); }
        .animal-rarity.Golden { color: var(--golden-color); }
        .req-list { list-style: none; padding: 0; margin-top: 1.5rem; text-align: left; }
        .req-item { margin-bottom: 0.5rem; }
        .req-item.met { color: #8aff8a; }
        .req-item.not-met { color: #ff8a8a; }
      `}</style>
      
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsSettingsOpen(false)}>&times;</button>
            <h2>Taming Progress</h2>
            <div className="settings-grid">
              <span></span>
              <label>Colors</label>
              <label>Total</label>
              {ANIMAL_SPECIES.map(species => (
                <React.Fragment key={species}>
                  <label>{species}</label>
                  <input 
                    type="number"
                    min="0"
                    value={tamingProgress[species]?.colors || 0}
                    onChange={(e) => setTamingProgress(p => ({...p, [species]: {...p[species], colors: parseInt(e.target.value) || 0}}))}
                  />
                  <input 
                    type="number" 
                    min="0"
                    value={tamingProgress[species]?.total || 0}
                    onChange={(e) => setTamingProgress(p => ({...p, [species]: {...p[species], total: parseInt(e.target.value) || 0}}))}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedAnimal && (
        <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
          <div className="modal-content animal-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAnimal(null)}>&times;</button>
            <img src={selectedAnimal.imageUrl} alt={selectedAnimal.name} />
            <h2>{selectedAnimal.name}</h2>
            <p className={`animal-rarity ${selectedAnimal.rarity}`}>{selectedAnimal.rarity}</p>
            <p><strong>Location:</strong> {selectedAnimal.spawnLocation}</p>
            
            <h3>Unlock Requirements</h3>
            <ul className="req-list">
              <li className={tamingProgress[selectedAnimal.species]?.colors >= selectedAnimal.unlockReqs.colors ? 'met' : 'not-met'}>
                {tamingProgress[selectedAnimal.species]?.colors >= selectedAnimal.unlockReqs.colors ? '✓' : '✗'} Tamed {selectedAnimal.unlockReqs.colors} different colors ({tamingProgress[selectedAnimal.species]?.colors || 0} / {selectedAnimal.unlockReqs.colors})
              </li>
              <li className={tamingProgress[selectedAnimal.species]?.total >= selectedAnimal.unlockReqs.total ? 'met' : 'not-met'}>
                {tamingProgress[selectedAnimal.species]?.total >= selectedAnimal.unlockReqs.total ? '✓' : '✗'} Tamed {selectedAnimal.unlockReqs.total} total ({tamingProgress[selectedAnimal.species]?.total || 0} / {selectedAnimal.unlockReqs.total})
              </li>
               {selectedAnimal.minYear > 1 && (
                 <li className={currentDate.year >= selectedAnimal.minYear ? 'met' : 'not-met'}>
                  {currentDate.year >= selectedAnimal.minYear ? '✓' : '✗'} Must be Year {selectedAnimal.minYear} or later (Current: Year {currentDate.year})
                </li>
               )}
            </ul>
          </div>
        </div>
      )}

      <header className="header">
        <h1>🐾 Pacha Tracker</h1>
        <button onClick={() => setIsSettingsOpen(true)}>Settings</button>
      </header>

      <div className="main-layout">
        <div className="calendar-container">
          <div className="controls-container">
            <div className="date-controls">
              <button onClick={() => handleSeasonChange(-1)}>{"<<"} Season</button>
              <button onClick={() => handleDateChange(-1)}>{"<"} Day</button>
              <div className="date-display">{SEASONS[currentDate.seasonIndex]} Day {currentDate.day}, Year {currentDate.year}</div>
              <button onClick={() => handleDateChange(1)}>Day {">"}</button>
              <button onClick={() => handleSeasonChange(1)}>Season {">>"}</button>
            </div>
            <div className="filter-controls">
              <select value={filters.species} onChange={e => setFilters(f => ({...f, species: e.target.value}))}>
                <option value="all">All Species</option>
                {ANIMAL_SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.rarity} onChange={e => setFilters(f => ({...f, rarity: e.target.value}))}>
                <option value="all">All Rarities</option>
                <option value="Rare">Rare</option>
                <option value="Golden">Golden</option>
                <option value="Legendary">Legendary</option>
              </select>
              <select value={filters.year} onChange={e => setFilters(f => ({...f, year: e.target.value}))}>
                <option value="all">All Years</option>
                <option value="1">Year 1</option>
                <option value="2+">Year 2+</option>
              </select>
              <label>
                <input type="checkbox" checked={filters.unlockedOnly} onChange={e => setFilters(f => ({...f, unlockedOnly: e.target.checked}))} />
                Unlocked Only
              </label>
            </div>
          </div>
          <div className="calendar-grid">
            {Array.from({ length: DAYS_IN_SEASON }, (_, i) => i + 1).map(day => (
              <div key={day} className={`day-cell ${day === currentDate.day ? 'current-day' : ''}`}>
                <div className="day-number">{day}</div>
                {filteredSpawns(day).map(animal => (
                  <div 
                    key={animal.name} 
                    className={`animal-spawn ${animal.rarity} ${isUnlocked(animal) ? 'unlocked' : 'locked'}`}
                    onClick={() => setSelectedAnimal(animal)}
                    role="button"
                    tabIndex="0"
                    aria-label={`View details for ${animal.name}`}
                  >
                    <img src={animal.imageUrl} alt={animal.name} />
                    <span>{animal.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <div className="upcoming-spawns">
            <h3>Upcoming Spawns</h3>
            <ul className="upcoming-list">
              {upcomingSpawns.length > 0 ? upcomingSpawns.map((spawn, index) => (
                <li key={index} className="upcoming-item">
                   <img src={spawn.imageUrl} alt={spawn.name} />
                   <div>
                    <strong>{spawn.name}</strong>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{spawn.date.season}, Day {spawn.date.day}, Year {spawn.date.year}</div>
                   </div>
                </li>
              )) : <li>No upcoming unlocked spawns found.</li>}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

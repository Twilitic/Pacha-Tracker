import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// === HELPER HOOK for LOCALSTORAGE ===
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error)
      {console.error(error);
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

// === NEW HELPER COMPONENTS & FUNCTIONS ===

const getAnimalStyle = (animalName) => {
    const styles = {
      // Aurochs
      'Golden Aurochs': { background: 'linear-gradient(135deg, #FFD700, #F0C400)' },
      'Snow Aurochs': { background: 'linear-gradient(135deg, #E6F7FF, #B0E0E6)' },
      'Flame Aurochs': { background: 'linear-gradient(135deg, #FF4500, #FF8C00, #FFD700)' },
      // Bison
      'Golden Bison': { background: 'linear-gradient(135deg, #FFD700, #DAA520)' },
      'Chicle Bison': { background: 'linear-gradient(135deg, #E6739F, #3D2B56)' },
      'Sky Cloud Bison': { background: 'linear-gradient(135deg, #87CEEB, #FFFFFF)' },
      // Dodo
      'Modern Dodo': { background: 'linear-gradient(135deg, #FFD700, #F0C400)' },
      'Surreal Dodo': { background: 'linear-gradient(135deg, #87CEEB, #FF69B4)' },
      'Pop Dodo': { background: 'linear-gradient(45deg, #F92672, #FD971F, #E6DB74, #A6E22E)' },
      // Guanaco
      'Golden Guanaco': { background: 'linear-gradient(135deg, #FFD700, #B8860B)' },
      'Fiery Guanaco': { background: 'linear-gradient(135deg, #B22222, #FF4500)' },
      'Icy Guanaco': { background: 'linear-gradient(135deg, #ADD8E6, #F0FFFF)' },
      // Horse
      'Golden Steppe Horse': { background: 'linear-gradient(135deg, #FFD700, #CD853F)' },
      'Cloudy Day Steppe Horse': { background: 'linear-gradient(135deg, #D3D3D3, #A9A9A9)' },
      'Starry Night Steppe Horse': {
         background: `
            radial-gradient(circle, #99d9f9 1px, rgba(0,0,0,0) 1px),
            radial-gradient(circle, #99d9f9 1px, rgba(0,0,0,0) 1px),
            linear-gradient(135deg, #0a0a23 0%, #1c3a6b 100%)
          `,
          backgroundSize: '20px 20px, 20px 20px, 100% 100%',
          backgroundPosition: '0 0, 10px 10px, 0 0'
      },
      // Ibex
      'Golden Ibex': { background: 'linear-gradient(135deg, #FFD700, #EEAD0E)' },
      'Shallow Waters Ibex': { background: 'linear-gradient(135deg, #20B2AA, #5F9EA0)' },
      'Spider Ibex': { background: 'radial-gradient(circle, #B22222 30%, #000000 100%)' },
      // Junglefowl
      'Golden Junglefowl': { background: 'linear-gradient(135deg, #FFD700, #FFBF00)' },
      'Amethyst Junglefowl': { background: 'linear-gradient(135deg, #9966CC, #8A2BE2)' },
      'Grand Turquoise Junglefowl': { background: 'linear-gradient(135deg, #40E0D0, #00CED1)' },
      // Mouflon
      'Zither Mouflon': { background: 'linear-gradient(135deg, #FFD700, #B8860B)' },
      'Ukulele Mouflon': { background: 'linear-gradient(135deg, #FF7F50, #FF6347, #FF4500)' },
      'Bass Mouflon': { background: 'linear-gradient(135deg, #483D8B, #000080)' },
      // Ostrich
      'Golden Ostrich': { background: 'linear-gradient(135deg, #FFD700, #F0E68C)' },
      'Sapphire Ostrich': { background: 'linear-gradient(135deg, #20B2AA, #48D1CC)' },
      'Rainbow Ostrich': { background: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)' },
      // Wild Boar
      'Golden Wild Boar': { background: 'linear-gradient(135deg, #FFD700, #D2B48C)' },
      'Fiber Wild Boar': { background: 'repeating-linear-gradient(45deg, #556B2F, #556B2F 10px, #6B8E23 10px, #6B8E23 20px)' },
      'Fire Wild Boar': { background: 'linear-gradient(135deg, #DC143C, #FF4500, #000000)' },
    };
    return styles[animalName] || { background: 'var(--bg-tertiary)' };
};

const AnimalColorSwatch = ({ animal }) => {
  const style = getAnimalStyle(animal.name);
  return <div className="animal-color-swatch" style={style} title={animal.name}></div>;
};

const NumberStepper = ({ value, onChange, min = 0 }) => {
  const handleIncrement = () => onChange(value + 1);
  const handleDecrement = () => onChange(Math.max(min, value - 1));
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, newValue));
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <div className="number-stepper">
      <button onClick={handleDecrement} className="stepper-btn" aria-label="Decrement">-</button>
      <input 
        type="number" 
        min={min}
        value={value}
        onChange={handleChange}
      />
      <button onClick={handleIncrement} className="stepper-btn" aria-label="Increment">+</button>
    </div>
  );
};

// === DATA (moved outside component for performance) ===
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const DAYS_IN_SEASON = 28;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ANIMAL_SPECIES = ['Aurochs', 'Bison', 'Dodo', 'Guanaco', 'Horse', 'Ibex', 'Junglefowl', 'Mouflon', 'Ostrich', 'Wild Boar'].sort();

const ANIMAL_DATA = [
    { name: 'Golden Aurochs', species: 'Aurochs', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [7, 21], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Snow Aurochs', species: 'Aurochs', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [14, 28], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Flame Aurochs', species: 'Aurochs', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [10], minYear: 2, spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Bison', species: 'Bison', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [3, 17], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Chicle Bison', species: 'Bison', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [10, 24], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Sky Cloud Bison', species: 'Bison', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [22], minYear: 2, spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Modern Dodo', species: 'Dodo', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [6, 20], minYear: 1, spawnLocation: 'Mangrove Island', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Surreal Dodo', species: 'Dodo', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [13, 27], minYear: 1, spawnLocation: 'Mangrove Island', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Pop Dodo', species: 'Dodo', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [10], minYear: 2, spawnLocation: 'Mangrove Island', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Guanaco', species: 'Guanaco', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [5, 19], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Fiery Guanaco', species: 'Guanaco', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [12, 26], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Icy Guanaco', species: 'Guanaco', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [2], minYear: 2, spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Steppe Horse', species: 'Horse', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [7, 21], minYear: 1, spawnLocation: 'Caves', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Cloudy Day Steppe Horse', species: 'Horse', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [14, 28], minYear: 1, spawnLocation: 'Caves', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Starry Night Steppe Horse', species: 'Horse', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [18], minYear: 2, spawnLocation: 'Caves', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Ibex', species: 'Ibex', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [2, 16], minYear: 1, spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Shallow Waters Ibex', species: 'Ibex', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [9, 23], minYear: 1, spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Spider Ibex', species: 'Ibex', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [26], minYear: 2, spawnLocation: 'Forest', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Junglefowl', species: 'Junglefowl', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [6, 20], minYear: 1, spawnLocation: 'Jungle', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Amethyst Junglefowl', species: 'Junglefowl', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [13, 27], minYear: 1, spawnLocation: 'Jungle', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Grand Turquoise Junglefowl', species: 'Junglefowl', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [10], minYear: 2, spawnLocation: 'Jungle', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Zither Mouflon', species: 'Mouflon', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [2, 16], minYear: 1, spawnLocation: 'Mograni Tundra', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Ukulele Mouflon', species: 'Mouflon', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [9, 23], minYear: 1, spawnLocation: 'Mograni Tundra', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Bass Mouflon', species: 'Mouflon', rarity: 'Legendary', seasons: ['Spring', 'Fall'], days: [26], minYear: 2, spawnLocation: 'Mograni Tundra', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Ostrich', species: 'Ostrich', rarity: 'Golden', seasons: ['Spring', 'Fall'], days: [4, 18], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Sapphire Ostrich', species: 'Ostrich', rarity: 'Rare', seasons: ['Summer', 'Winter'], days: [11, 25], minYear: 1, spawnLocation: 'Savanna', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Rainbow Ostrich', species: 'Ostrich', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [14], minYear: 2, spawnLocation: 'Savanna', unlockReqs: { colors: 6, total: 12 } },
    { name: 'Golden Wild Boar', species: 'Wild Boar', rarity: 'Golden', seasons: ['Summer', 'Winter'], days: [1, 15], minYear: 1, spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Fiber Wild Boar', species: 'Wild Boar', rarity: 'Rare', seasons: ['Spring', 'Fall'], days: [8, 22], minYear: 1, spawnLocation: 'Forest', unlockReqs: { colors: 4, total: 8 } },
    { name: 'Fire Wild Boar', species: 'Wild Boar', rarity: 'Legendary', seasons: ['Summer', 'Winter'], days: [6], minYear: 2, spawnLocation: 'Forest', unlockReqs: { colors: 6, total: 12 } },
].sort((a, b) => a.species.localeCompare(b.species) || a.name.localeCompare(b.name));
  
const initialProgress = ANIMAL_SPECIES.reduce((acc, species) => {
  acc[species] = { colors: 0, total: 0 };
  return acc;
}, {});

const App = () => {
  // === STATE ===
  const [currentDate, setCurrentDate] = useLocalStorage('pacha_currentDate', { year: 1, seasonIndex: 0, day: 1 });
  const [tamingProgress, setTamingProgress] = useLocalStorage('pacha_tamingProgress', initialProgress);
  const [obtainedAnimals, setObtainedAnimals] = useLocalStorage('pacha_obtainedAnimals', []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [filters, setFilters] = useState({
    rarity: 'all',
    species: 'all',
    unlockedOnly: false,
    year: 'all'
  });
  const importInputRef = useRef(null);

  // === LOGIC ===
  // Effect to ensure save compatibility with new animal species
  useEffect(() => {
    const allSpeciesPresent = ANIMAL_SPECIES.every(species => tamingProgress.hasOwnProperty(species));
    if (!allSpeciesPresent) {
      setTamingProgress(prev => ({ ...initialProgress, ...prev }));
    }
  }, []);

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

    while (upcoming.length < 5 && searchYear < 10) { 
        const seasonName = SEASONS[searchSeasonIndex];
        const spawnsOnDay = ANIMAL_DATA.filter(animal => 
            animal.seasons.includes(seasonName) && 
            animal.days.includes(searchDay) &&
            isUnlocked(animal) &&
            searchYear >= animal.minYear &&
            !obtainedAnimals.includes(animal.name) // Check against all obtained animals
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
  }, [tamingProgress, currentDate, obtainedAnimals]);

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

  const handleExport = () => {
    const dataToExport = { currentDate, tamingProgress, obtainedAnimals };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pacha_tracker_data_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            if (typeof e.target.result !== 'string') {
              throw new Error('File content is not a string');
            }
            const importedData = JSON.parse(e.target.result);
            if (importedData.currentDate && importedData.tamingProgress && Array.isArray(importedData.obtainedAnimals)) {
                setCurrentDate(importedData.currentDate);
                // Merge with initial progress to handle newly added species
                setTamingProgress(prev => ({...initialProgress, ...importedData.tamingProgress}));
                setObtainedAnimals(importedData.obtainedAnimals);
                alert('Data imported successfully!');
                setIsSettingsOpen(false);
            } else {
                alert('Invalid data file. Make sure it is a valid export from the Pacha Tracker.');
            }
        } catch (error) {
            console.error('Failed to parse imported file:', error);
            alert('Error importing file. It might be corrupted or not in the correct format.');
        }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

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
          --success-color: #8aff8a;
          --font-family: 'Kumbh Sans', sans-serif;
          --shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
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
        .weekday-header {
            font-weight: 700;
            text-align: center;
            color: var(--text-muted);
            padding-bottom: 0.5rem;
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
          transition: transform 0.2s, background-color 0.2s;
        }
        .animal-spawn:hover { transform: scale(1.05); }
        .animal-spawn.locked { opacity: 0.4; filter: grayscale(80%); }

        .animal-spawn.obtained {
          background-color: rgba(60, 140, 60, 0.2);
        }
        .animal-spawn.obtained span {
          text-decoration: line-through;
          text-decoration-color: #c58af9;
          text-decoration-thickness: 2px;
        }

        .animal-color-swatch {
          border-radius: 50%;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .animal-spawn .animal-color-swatch { width: 24px; height: 24px; }
        
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
        .upcoming-item .animal-color-swatch { width: 32px; height: 32px; }
        
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
          animation: fadeIn 0.3s ease-out forwards;
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
          animation: scaleUp 0.3s ease-out forwards;
        }
        .modal-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none; border: none; font-size: 1.5rem;
          color: var(--text-muted); cursor: pointer;
        }
        .settings-grid { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; align-items: center; }
        .settings-grid label { font-weight: bold; }
        .data-management-controls { display: flex; gap: 1rem; margin-bottom: 1rem; margin-top: 1rem;}
        
        .number-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .number-stepper input[type="number"] {
          width: 50px;
          padding: 0.5rem 0;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          text-align: center;
          border-left: none;
          border-right: none;
          border-radius: 0;
          -moz-appearance: textfield;
        }
        .number-stepper input[type="number"]::-webkit-outer-spin-button,
        .number-stepper input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .stepper-btn {
          width: 30px;
          padding: 0.5rem 0;
          font-size: 1rem;
          line-height: 1;
        }
        .number-stepper .stepper-btn:first-of-type {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .number-stepper .stepper-btn:last-of-type {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .animal-detail-modal { max-width: 400px; text-align: center; }
        .animal-detail-modal .animal-color-swatch { 
            width: 150px;
            height: 150px;
            margin: 1rem auto;
            display: block;
            border-width: 2px;
        }
        .animal-detail-modal h2 { margin: 0; }
        .animal-detail-modal .obtained-btn { width: 100%; margin-top: 1.5rem; background-color: var(--bg-tertiary); }
        .animal-detail-modal .obtained-btn.is-obtained { background-color: #3c8d3c; border-color: #2b6b2b; }
        .animal-rarity.Rare { color: var(--rare-color); }
        .animal-rarity.Legendary { color: var(--legendary-color); }
        .animal-rarity.Golden { color: var(--golden-color); }
        .req-list { list-style: none; padding: 0; margin-top: 1.5rem; text-align: left; }
        .req-item { margin-bottom: 0.5rem; }
        .req-item.met { color: var(--success-color); }
        .req-item.not-met { color: #ff8a8a; }
      `}</style>
      
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsSettingsOpen(false)}>&times;</button>
            <h2>Settings</h2>
            <hr/>
            <h3>Data Management</h3>
            <div className="data-management-controls">
                <button onClick={handleExport}>Export Data</button>
                <button onClick={() => importInputRef.current?.click()}>Import Data</button>
                <input
                    type="file"
                    ref={importInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleImport}
                />
            </div>
            <hr/>
            <h3>Taming Progress</h3>
            <div className="settings-grid">
              <span></span>
              <label>Colors</label>
              <label>Total</label>
              {ANIMAL_SPECIES.map(species => (
                <React.Fragment key={species}>
                  <label>{species}</label>
                  <NumberStepper 
                    value={tamingProgress[species]?.colors || 0}
                    onChange={(newValue) => setTamingProgress(p => ({...p, [species]: {...p[species], colors: newValue}}))}
                  />
                  <NumberStepper
                    value={tamingProgress[species]?.total || 0}
                    onChange={(newValue) => setTamingProgress(p => ({...p, [species]: {...p[species], total: newValue}}))}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedAnimal && (() => {
        const isObtained = obtainedAnimals.includes(selectedAnimal.name);

        const handleToggleObtained = () => {
          setObtainedAnimals(prev => {
            if (isObtained) {
              return prev.filter(name => name !== selectedAnimal.name);
            } else {
              return [...prev, selectedAnimal.name];
            }
          });
        };

        return (
          <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
            <div className="modal-content animal-detail-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedAnimal(null)}>&times;</button>
              <AnimalColorSwatch animal={selectedAnimal} />
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
              <button 
                className={`obtained-btn ${isObtained ? 'is-obtained' : ''}`}
                onClick={handleToggleObtained}
              >
                {isObtained ? '✓ Obtained' : 'Mark as Obtained'}
              </button>
            </div>
          </div>
        )
      })()}

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
            {WEEKDAYS.map(day => <div key={day} className="weekday-header">{day}</div>)}
            {Array.from({ length: DAYS_IN_SEASON }, (_, i) => i + 1).map(day => (
              <div key={day} className={`day-cell ${day === currentDate.day ? 'current-day' : ''}`}>
                <div className="day-number">{day}</div>
                {filteredSpawns(day).map(animal => {
                  const isObtained = obtainedAnimals.includes(animal.name);
                  return (
                    <div 
                      key={animal.name} 
                      className={`animal-spawn ${animal.rarity} ${isUnlocked(animal) ? 'unlocked' : 'locked'} ${isObtained ? 'obtained' : ''}`}
                      onClick={() => setSelectedAnimal({ ...animal, spawnDay: day })}
                      role="button"
                      tabIndex="0"
                      aria-label={`View details for ${animal.name}`}
                    >
                      <AnimalColorSwatch animal={animal} />
                      <span>{animal.name}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <div className="upcoming-spawns">
            <h3>Upcoming Spawns</h3>
            <ul className="upcoming-list">
              {upcomingSpawns.length > 0 ? upcomingSpawns.map((spawn, index) => (
                <li key={index} className="upcoming-item" onClick={() => setSelectedAnimal(spawn)} style={{cursor:'pointer'}}>
                   <AnimalColorSwatch animal={spawn} />
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
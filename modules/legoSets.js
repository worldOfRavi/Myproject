const setData = require('../data/setData');
const themeData = require('../data/themeData');

// Create sets array
let sets = [];

// Initialize function
function initialize() {
    return new Promise((resolve, reject) => {
        // Check if setData or themeData is missing
        if (!setData || !themeData) {
            reject("Data loading error."); // If missing, reject with an error
            return;
        }

        // Populate sets array by iterating setData to include themes
        setData.forEach(set => {
            const theme = themeData.find(theme => theme.id === set.theme_id)?.name || "unknown";
            sets.push({ ...set, theme });
        });

        resolve(); // Resolving the promise once sets array is populated
    });
}

// Function to get all sets
function getAllSets() {
    return new Promise((resolve) => {
        resolve(sets);
    });
}

// Function to get set by number
function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find(s => s.set_num === setNum);

        if (set) {
            resolve(set); // Resolving with the found set
        } else {
            reject("Set not found."); // Rejecting if set not found
        }
    });
}

// Function to get sets by theme (case-insensitive)
function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const matchSets = sets.filter(s => s.theme.toLowerCase().includes(theme.toLowerCase()));
        if (matchSets.length > 0) {
            resolve(matchSets);
        } else {
            reject("no sets found with that theme");
        }
    });
}


// Exporting all functions so they can be used in other files
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

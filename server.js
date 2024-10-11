/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Dipesh Shah Baniya  
*  Student ID: 147936223  
*  Date: October, 2024
*
********************************************************************************/

const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');

const app = express();
const PORT = process.env.PORT || 3010;

// Serve static files from the 'public' folder
app.use(express.static('public'));

legoData.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.log(`Failed to start server: ${err}`);
});

// Route to home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Route to about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Route to fetch all Lego sets or by theme
app.get("/lego/sets", (req, res) => {
    const theme = req.query.theme;
    if (theme) {
        legoData.getSetsByTheme(theme).then(data => {
            res.json(data);
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        legoData.getAllSets().then(data => {
            res.json(data);
        }).catch(err => {
            res.status(404).send(err);
        });
    }
});

// Route to fetch set by set number
app.get("/lego/sets/:set_num", (req, res) => {
    const setNum = req.params.set_num;
    legoData.getSetByNum(setNum).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(404).send("Set not found.");
    });
});

// Custom 404 page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

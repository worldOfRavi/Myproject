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
const fs = require('fs');

const legoData = require('./modules/legoSets');

const app = express();
const PORT = process.env.PORT || 3010;

// let __dirname  = path.resolve();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");



app.use(express.static(path.join(__dirname, 'public')));


legoData.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.log(`Failed to start server: ${err}`);
});

// Route to home page
app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname, "/views/home.html"));
    res.render("home",{ page: '/'});
});

// Route to about page
app.get("/about", (req, res) => {
    //res.render(path.join(__dirname, "/views/about.html"));
    res.render("about",{ page: '/'});
});


app.get("/lego/sets", (req, res) => {
    const theme = req.query.theme;
    if (theme) {
        legoData.getSetsByTheme(theme).then(data => {
            res.render("sets", { sets: data, page: "/lego/sets" });
        }).catch(err => {
            res.status(404).render("404", { message: `No sets found for theme: ${theme}` });
        });
    } else {
        legoData.getAllSets().then(data => {
            res.render("sets", { sets: data, page: "/lego/sets" });
        }).catch(err => {
            res.status(404).render("404", { message: "No sets available" });
        });
    }
});

app.get("/lego/sets/:set_num", (req, res) => {
    const setNum = req.params.set_num;
    legoData.getSetByNum(setNum).then(data => {
        res.render("set", { set: data });
    }).catch(err => {
        res.status(404).render("404", { message: `Set with number ${setNum} not found.` });
    });
});




//app.use((req, res) => {
//    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
//});
app.get("*", (req, res) => {
    res.status(404).render("404", { message: "The page are not available right now." });
  });

app.get("/files", (req, res) => {
    const directoryPath = path.join(__dirname, "data"); 

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(404).render( "Unable to scan directory: " + err );
        }

        // Pass the list of files to the 'files.ejs' template
        res.render("files", { files: files, page: "/files" });
    });
});
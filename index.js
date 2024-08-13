const express = require("express");
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render("index", { files: files });
    });
});


app.get("/files/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('show', { content: data, filename: req.params.filename });
    });
});


app.post("/create", (req, res) => {
    // Extract file name and content from the request body
    const { title, description } = req.body;

    // Validate inputs
    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }

    // Sanitize file name to prevent invalid characters
    const sanitizedTitle = title.split(" ").join("");

    // Create the file with the provided description
    fs.writeFile(`./files/${sanitizedTitle}.txt`, description, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Optionally, you can redirect or send a success response
        
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

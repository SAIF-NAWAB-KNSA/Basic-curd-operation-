const express = require('express');
const port = 8080;
const app =express();
const mongoose = require('mongoose');
const Chat = require('./model/chat');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/whatsaap")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });



app.listen(port,()=>{
    console.log(`Server is running on port ${port} `);

});

app.get("/", async (req, res) => {

    const chats = await Chat.find();

    res.render("index", { chats });
});


app.get("/chats",async (req,res)=>{
    const chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs",{chats});
});


app.get("/chats/new",async (req,res)=>{
    res.render("new.ejs");
});

app.post('/chats', async (req, res) => {
    const { from, message, to } = req.body;
    const newChat = new Chat({
        from,
        message,
        to,
        createdAt: new Date()
    });

    try {
        await newChat.save();
        console.log("Chat added successfully", newChat);
        res.redirect("/chats");
    } catch (err) {
        console.log("Error adding chat", err);
        res.status(500).send("Chat save nahi ho saki");
    }
});


app.get('/chats/:id/edit', async (req, res) => {
    const { id } = req.params;
    const chat = await Chat.findById(id);

    if (!chat) {
        return res.status(404).send('Chat nahi mili');
    }

    res.render('edit.ejs', { chat });
});

app.post('/chats/:id', async (req, res) => {
    const { id } = req.params;
    const { from, message, to } = req.body;

    await Chat.findByIdAndUpdate(id, { from, message, to });
    res.redirect('/chats');
});
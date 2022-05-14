require('dotenv').config();
const audioFileUrl = "https://static.deepgram.com/examples/deep-learning-podcast-clip.wav"
const express = require('express');
const {Deepgram} = require('@deepgram/sdk');
const app = express();

const deepgram = new Deepgram(process.env.dg_key)
deepgram.transcription.preRecorded(
    {url: audioFileUrl}).then(data =>{
})


app.use(express.static("public"));

app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html')
})
app.listen(3000,() =>{
    console.log("server at port 3000");
})
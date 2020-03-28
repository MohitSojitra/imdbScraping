const express = require("express");
const bodyPaser = require("body-parser");

const index = require("./findNodule/titles");
const AllInfoMovie = require("./findNodule/AllInfoMovie");
const popular = require("./findNodule/popular");

const app = express();
app.use(bodyPaser.json());

app.get("/" , async (req,res,next)=>{
    console.log("grt run")
    let data = await popular();

    res.status("200").contentType("application/json").json(data);
})

app.get("/:movieName" , async (req,res,next)=>{
    let data = await index(req.params.movieName)

    res.status("200").contentType("application/json").json(data);
})

app.post("/movie" , async (req,res,next)=>{
    let url = req.body.url;
    let data = await AllInfoMovie(url);
    res.status("200").contentType("application/json").json(data);
})

app.listen("3000" ,()=>{
    console.log("server is running");
})
const request = require("request-promise");
const regularRequest = require("request");
const cheerio = require("cheerio");

const fs = require("fs");

let json = {
    title: "super 30",
    year: "2020",
    rating: 6.7,
    url: "https://www.imdb.com/title/tt8946378/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=ea4e08e1-c8a3-47b5-ac3a-75026647c16e&pf_rd_r=71BDRC0B1YRFS21Y8RA1&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=moviemeter&ref_=chtmvm_tt_3",
    imageUrl: "https://www.imdb.com/title/tt8946378/mediaviewer/rm2569376769",
    genres: "comedy | crime | Mystry",
    languages: "English | Hindi",
    budget: "$40,000,000",
    earn: "$312,904,455",
    runTime: "131 min"
}


let movies = [];

async function headInfo() {
    try {
        console.log("head run")

        let mainUrl = "https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm";
        let html = await request.get(mainUrl);
        let $ = await cheerio.load(html);

        $(".lister-list").children("tr").each((index, ele) => {
            let movie = {}
            if(index == 10)
            {
                return false
            }
            let x = $(ele).find(".titleColumn").find("a");
            movie.title = x ? $(x).text() : "NA";

            x =$($(ele).find(".titleColumn").find(".secondaryInfo")[0]);
            movie.year = x ? $(x).text(): "NA";

            x = $(ele).find("strong");
            movie.rating = x ? $(x).text() : "NA";

            x =  $(ele).find(".titleColumn").find("a");
            movie.url =  x ? "https://www.imdb.com" + $(x).attr("href") : "NA";
            movies.push(movie);
        })
        console.log("head end")

        return movies

    } catch (e) {
        console.error("error in headInfo \n", e);
    }

}

async function midInfo(movies) {

    try {
        console.log("mid run")
            for (let i = 0; i < movies.length; i++) {
                
                
                let html = await request.get(movies[i].url);
                // console.log(html);
                let $ = await cheerio.load(html);
                let x = $("#titleStoryLine > div:nth-child(10)").text().split(":")[1];
                movies[i].genres = x ? x.replace(/[\r\n]+/gm, "").trim() : "NA";
                
    
                x = $("#titleDetails > div:nth-child(5)").text().split(":")[1];
                movies[i].languages = x ? x.replace(/[\r\n]+/gm, "").trim() : "NA";
    
                x = $("#titleDetails > div:nth-child(12)").text().split(":")[1];
    
                movies[i].budget = x ? x.replace(/[\r\n]+/gm, "").split(" ")[0] : "NA";

                x = $("#titleDetails > div:nth-child(15)").text();
    
                movies[i].earn = x ? x.split(":")[1].trim() : "NA";
    
                 x = $("time").text().trim().split("  ")[0]
    
                 movies[i].runTime  = x ?  x.replace(/[\r\n]+/gm, "") : "NA";
    
                movies[i].imageUrl  = "https://www.imdb.com" + $(".poster").find("a").attr("href")
            }
            console.log("mid end")
            return movies;


    } catch (error) {
        console.error("error \n ", error);
    }
}

async function main() {
    try {
        console.log("main run")
        let movies = await headInfo();
        movies = await midInfo(movies);
        console.log(movies)
        console.log("Successfully completed");
        return movies;

    } catch (e) {
        console.log("error \n", e);
    }
}

module.exports = async ()=>{
    return await main();
}
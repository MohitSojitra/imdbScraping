const request = require("request-promise");
const regularRequest = require("request");
const cheerio = require("cheerio");


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


let movie = {}

async function headInfo(mainUrl) {
    try {
        let html = await request.get(mainUrl);
        let $ = await cheerio.load(html);
        movie.title = $(".title_wrapper").find("h1").text().split("(")[0];


        movie.year ="(" + $(".title_wrapper").find("h1").text().split("(")[1].split(" ")[0];

        x = $(`[itemprop="ratingValue"]`);
        movie.rating = x ? $(x).text() : "NA";
        movie.url = mainUrl

        console.log("\n\n\n headInfo url = " , movie.url);

        return movie

    } catch (e) {
        console.error("error in headInfo \n", e);
    }

}

async function midInfo(movie) {

    try {

        console.log("\n\n\n midinfo url = ", movie.url);
        let html = await request.get(movie.url);
        // console.log(html);
        let $ = await cheerio.load(html);
        let x = $("#titleStoryLine > div:nth-child(10)").text().split(":")[1];
        movie.genres = x ? x.replace(/[\r\n]+/gm, "").trim() : "NA";


        x = $("#titleDetails > div:nth-child(5)").text().split(":")[1];
        movie.languages = x ? x.replace(/[\r\n]+/gm, "").trim() : "NA";

        x = $("#titleDetails > div:nth-child(12)").text().split(":")[1];

        movie.budget = x ? x.replace(/[\r\n]+/gm, "").split(" ")[0] : "NA";

        x = $("#titleDetails > div:nth-child(15)").text();

        movie.earn = x ? x.split(":")[1].trim() : "NA";

        x = $("time").text().trim().split("  ")[0]

        movie.runTime = x ? x.replace(/[\r\n]+/gm, "") : "NA";

        movie.imageUrl = "https://www.imdb.com" + $(".poster").find("a").attr("href")

        return movie;


    } catch (error) {
        console.error("error \n ", error);
    }
}





module.exports = async (url) => {
    try {
        console.log("\n\n\n module url == ", url);
        movie = await headInfo(url);
        movie = await midInfo(movie);
        console.log(movie)
        console.log("Successfully completed");

        return movie

    } catch (e) {
        console.log("error \n", e);
    }
}

const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");


const allInfoMovie = require("./AllInfoMovie");



async function getOriginalMovie(movieName)
{
    
    let ops = {
        waitUntil : "load",
        timeout : 0
    }
    try {

        let browser = await puppeteer.launch();
        let page = await browser.newPage();

        await page.goto("https://www.google.com" ,ops);
        await page.type("input.gLFyf" , movieName)
        page.keyboard.press("Enter");
        try{
            await page.waitForSelector("a.gL9Hy");
            let content1 = await page.content();
            let $ = await cheerio.load(content1);
            movieName =  $("a.gL9Hy").text()
        }
        catch(e)
        {
            console.log("its orrirginal name yeh!!!!!!")
        }
        await browser.close();
        return movieName

    } catch (error) {
        console.log("error in getoriginalMovie , \n " , error);
    }
}







let json = {
    imageUrl : "https://m.media-amazon.com/images/M/MV5BMTY3MDk5MDc3OV5BMl5BanBnXkFtZTcwNzAyNTg0Ng@@._V1_UX32_CR0,0,32,44_AL_.jpg",
    movieTitle : "catalion",
    year : "(2021)",
    pageUrl : "/title/tt1598778/?ref_=fn_al_tt_1"
}


let Movietitles = [];

async function movieTitle(movieName){

    try {
        let html = await request.get(`https://www.imdb.com/find?q=${movieName}`);
        let $ = await cheerio.load(html);

        
        $(".findSection").first().find("tr").each((i , ele) =>{
            let movie = {};
           movie.pageUrl =  "https://www.imdb.com" + $(ele).find("a").attr("href");

           movie.movieTitle = $(ele).find("a").text();

           movie.year = "(" + $(ele).find(".result_text").text().split("(")[1];

           movie.imageUrl =  $(ele).find(".primary_photo").find("img").attr("src");

           

           Movietitles.push(movie);
        })

        return Movietitles
    } catch (error) {
        console.log("error , titlkw \n", error)
        // return new Promise(null , error);
    }

}






async function main(movieName)
{
    
    try {
        movieName = await getOriginalMovie(movieName);
        let moviesTl = await movieTitle(movieName);
        console.log("puru" , moviesTl);
        console.log("\n\n\n\n\n\n");

        return moviesTl;

    }
    catch (e) {
        console.log("error in main \n" , e);
    }
}




module.exports = async (movieName)=>{
    console.log("ha ha aha" , movieName)
    return await main(movieName);

}



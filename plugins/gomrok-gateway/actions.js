// @ts-check
import axios from "axios";
import * as cheerio from "cheerio";
import { writeFile, readFile, stat as statFile } from "fs";

const jsonFilePath = "./public_media/customer/rates.json";

function getTimeDifference(a, b) {
  return Math.abs(b - a) / 36e5;
}

export function update_prices(req, res, next, x = false) {
  console.log("update_prices ====>");
  // URL of the page we want to scrape
  const url =
    "https://www.irica.ir/web_directory/54345-%D9%86%D8%B1%D8%AE-%D8%A7%D8%B1%D8%B2.html";

  // Async function which scrapes the data
  async function scrapeTheData() {
    try {
      // Fetch HTML of the page we want to scrape
      const { data } = await axios.get(url);

      const $ = cheerio.load(data);
      const listItems = $("table.list tbody tr");

      const items = [];
      // Use .each method to loop through the li we selected
      listItems.each((idx, el) => {
        const temp = {
          currency: $(el).children("td:first-child").text(),
          price: $(el).children("td:nth-child(2)").text(),
        };

        items.push(temp);
      });

      writeFile(jsonFilePath, JSON.stringify(items, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
        if (x) res.json({ success: true });
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Invoke the above function
  scrapeTheData();
}

export function getExchangeRate(req, res, next) {
  async function scrapeData() {
    try {
      readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
          update_prices(req, res, next);
          console.error(err);
          return;
        }
        statFile(jsonFilePath, function (err, stats) {
          const difference = getTimeDifference(stats.mtime, new Date());

          if (difference > 1) update_prices(req, res, next);

          console.log("Successfully read data from file");
          res.send(data);
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Invoke the above function
  scrapeData();
}
export function getTscForm(req, res, next) {
  // URL of the page we want to scrape
  const url = "https://epl.irica.ir/TscViewPage?0";

  // Async function which scrapes the data
  async function scrapeData() {
    try {
      // Fetch HTML of the page we want to scrape
      const { data, headers } = await axios({
        method: "get",
        url,
        headers: {},
      });
      // Load HTML we fetched in the previous line
      const $ = cheerio.load(data);
      // Select all the list items in plainlist class
      console.log("here");
      const listItems = $(".card.tsccard");
      // Stores data for all countries
      // const countries = [];
      // // Use .each method to loop through the li we selected
      // listItems.each((idx, el) => {
      //     // Object holding data for each country/jurisdiction
      //     const country = {currency: "", price: ""};
      //     // Select the text content of a and span elements
      //     // Store the textcontent in the above object
      //     country.currency = $(el).children("td:first-child").text();
      //     country.price = $(el).children("td:nth-child(2)").text();
      //     // Populate countries array with country data
      //     countries.push(country);
      // });
      // Logs countries array to the console
      // console.dir(countries);
      res.send(listItems.html());
      // Write countries array in countries.json file
      // writeFile("./public_media/rates.json", JSON.stringify(countries, null, 2), (err) => {
      //     if (err) {
      //         console.error(err);
      //         return;
      //     }
      //     console.log("Successfully written data to file");
      //     res.json({
      //         success: true
      //     })
      // });
    } catch (err) {
      console.error("err");
      // success:false
      res.json({
        err,
      });
    }
  }

  // Invoke the above function
  scrapeData();
}

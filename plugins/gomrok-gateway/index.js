// import _ from 'lodash'
// Tip! Initialize this property in your payment service constructor method!
// import PasargadApi from '@pepco/nodejs-rest-sdk';
// import fs from "fs"
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

let json = {};
export { json };
export default (props) => {
  function getTimeDifference(a, b) {
    return Math.abs(b - a) / 36e5;
  }

  function update_prices(req, res, next, x = false) {
    console.log("update_prices====>");
    // URL of the page we want to scrape
    const url = "https://bot.gomrok24.com/prices.php";

    // Async function which scrapes the data
    async function scrapeTheData() {
      try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        console.log("scrapeTheData===>", data);

        const $ = cheerio.load(data);
        // Select all the list items in plainlist class
        const listItems = $("table.list tbody tr");
        // Stores data for all countries
        const countries = [];
        // Use .each method to loop through the li we selected
        listItems.each((idx, el) => {
          // Object holding data for each country/jurisdiction
          const country = { currency: "", price: "" };
          // Select the text content of a and span elements
          // Store the textcontent in the above object
          country.currency = $(el).children("td:first-child").text();
          country.price = $(el).children("td:nth-child(2)").text();
          // Populate countries array with country data
          countries.push(country);
        });
        // Logs countries array to the console
        console.dir(countries);
        // Write countries array in countries.json file
        fs.writeFile(
          "./public_media/customer/rates.json",
          JSON.stringify(countries, null, 2),
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Successfully written data to file");
            if (x)
              res.json({
                success: true,
              });
          }
        );
      } catch (err) {
        console.error(err);
      }
    }

    // Invoke the above function
    scrapeTheData();
  }

  console.log("run gomrok");

  // _.forEach()
  if (props && props.entity)
    props.entity.map((item, i) => {
      if (item.name === "settings") {
        console.log("settings.........................................");
        if (item.routes) {
          // item.routes.push({
          //     "path": "/get-exchange-rate/",
          //     "method": "get",
          //     "access": "customer_all",
          //     "controller": (req, res, next) => {
          //     }
          // })
          item.routes.push({
            path: "/update-exchange-rate/",
            method: "post",
            access: "customer_all",
            controller: (req, res, next) => {
              update_prices(req, res, next, true);
            },
          });
          item.routes.push({
            path: "/get-exchange-rate/",
            method: "get",
            access: "customer_all",
            controller: (req, res, next) => {
              async function scrapeData() {
                try {
                  fs.readFile(
                    "./public_media/customer/rates.json",
                    "utf8",
                    (err, data) => {
                      if (err) {
                        update_prices(req, res, next);

                        console.error(err);
                        return;
                      }
                      fs.stat(
                        "./public_media/customer/rates.json",
                        function (err, stats) {
                          var mtime = stats.mtime;
                          console.log("mtime", mtime);
                          const difference = getTimeDifference(
                            mtime,
                            new Date()
                          );
                          console.log(difference);
                          if (difference > 1) {
                            update_prices(req, res, next);
                          }
                          console.log("Successfully read data from file");
                          res.send(data);
                        }
                      );
                    }
                  );
                } catch (err) {
                  console.error(err);
                }
              }

              // Invoke the above function
              scrapeData();
            },
          });
          item.routes.push({
            path: "/get-tsc-form/",
            method: "post",
            access: "customer_all",
            controller: (req, res, next) => {
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
                  // fs.writeFile("./public_media/rates.json", JSON.stringify(countries, null, 2), (err) => {
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
            },
          });
        }
      }
    });
  return props;
};

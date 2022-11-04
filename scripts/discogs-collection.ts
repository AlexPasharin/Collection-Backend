import * as puppeteer from "puppeteer";

import { dbConnection } from "../src/db";

const connection = new dbConnection();

const delay = (milliseconds) => new Promise((r) => setTimeout(r, milliseconds));

const batch = 2;

connection.getAllReleases({ skip: 10 * batch }).then((releases) => {
  puppeteer
    .launch({ headless: false, defaultViewport: null })
    .then(async (browser) => {
      const [page] = await browser.pages();
      await page.goto("https://discogs.com");

      const cookiesBtnSelector = "#onetrust-accept-btn-handler";

      await page.waitForSelector(cookiesBtnSelector);
      await page.click(cookiesBtnSelector);

      await Promise.all([
        page.evaluate(() => {
          document.querySelector<HTMLButtonElement>("#log_in_link").click();
        }),
        page.waitForNavigation(),
      ]);

      await page.waitForSelector(cookiesBtnSelector);
      await page.click(cookiesBtnSelector);

      const userNameSelector = "input#username";
      const passwordSelector = "input#password";

      await page.waitForSelector(userNameSelector);
      await page.waitForSelector(passwordSelector);

      await page.type(userNameSelector, "alex.pasharin@gmail.com");
      await page.type(passwordSelector, "pre1!ure");

      await Promise.all([
        page.evaluate(() => {
          document.querySelector<HTMLButtonElement>("button.btn").click();
        }),
        page.waitForNavigation(),
      ]);

      const newPage = await browser.newPage();

      for (const release of releases) {
        const { discogs_url } = release;

        if (discogs_url) {
          await newPage.goto(release.discogs_url);
          await delay(1000);

          await newPage.evaluate(() => {
            const notInCollection =
              Array.from(document.querySelectorAll("div")).filter((d) =>
                d.className.includes("collection")
              ).length === 0;

            if (notInCollection) {
              const btns = document.querySelectorAll("button");

              const addToCollectionBtn = Array.prototype.find.call(
                btns,
                (b: HTMLButtonElement) =>
                  b.innerText.toLowerCase().includes("add to collection")
              );

              addToCollectionBtn.click();
            }
          });

          await delay(1000);
        }
      }
    });
});

const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs").promises;
puppeteer.use(stealthPlugin());

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

puppeteer
  .launch({
    headless: false,
    executablePath: "/opt/google/chrome/google-chrome",
    userDataDir: "/home/shidono/.config/google-chrome/Default",
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  .then(async (browser) => {
    const pages = await browser.pages();
    const page = await browser.newPage();
    await pages[0].close();
    const cookiesString = await fs.readFile("cookies/tunisair.json");
    if (cookiesString != "") {
      var cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
    }
    await page.goto(`https://www.tunisair.com.tn/site/publish/content/`);

    // await page.waitForSelector("#blocformsearch");
    // await page.exposeFunction("delay", delay);
    // page.evaluate(async () => {
    //   document.querySelector("select[name=B_LOCATION_1]").value = "YUL";
    //   await delay(1000);
    //   document.querySelector("select[name=E_LOCATION_1]").value = "TUN";
    //   await delay(1000);
    //   document.querySelector("select[name=ADTPAX]").value = "0";
    //   await delay(1000);
    //   document.querySelector("select[name=YTHPAX]").value = "1";
    //   await delay(1000);
    //   const dates = await document.querySelectorAll(".champcal");
    //   dates[0].value = "13/10/2023";
    //   await delay(1000);
    //   dates[1].value = "13/12/2023";
    // });
    const destination1 = await page.$("select[name=B_LOCATION_1]");
    await destination1.type("mont");
    await delay(1000);
    const destination2 = await page.$("select[name=E_LOCATION_1]");
    await destination2.type("TUN");
    await delay(1000);
    const ageChild = await page.$("select[name=ADTPAX]");
    await ageChild.type("0");
    await delay(1000);
    const ageAdult = await page.$("select[name=YTHPAX]");
    await ageAdult.type("1");
    await delay(1000);
    const dates = await page.$$(".champcal");
    await dates[0].type("13/10/2023");
    await delay(1000);
    await dates[1].type("13/12/2023");
    // //await delay(1000);
    await delay(1000);
    await page.click(".calendarOKButton");
    await delay(1000);
    await page.click("#lignesearch1 > input");

    await page.waitForSelector("#tpl3_calendarPerBound", { timeout: 0 });
    var cookies = await page.cookies();
    await fs.mkdir("cookies", { recursive: true });
    await fs.writeFile(
      "cookies/tunisair.json",
      JSON.stringify(cookies, null, 2)
    );

    //browser.close();
  });

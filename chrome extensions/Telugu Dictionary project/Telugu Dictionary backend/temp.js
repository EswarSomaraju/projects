const puppeteer = require('puppeteer');

(async function(){
    const engWord = 'place';
    // console.log(`input is ${engWord}`);
    const searchEngWord = `${engWord} meaning in telugu`;
    const gotoUrl = 'https://www.google.com/';
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        // const [ page ] = await browser.pages();
        page.setRequestInterception(true);
        page.on('request', (request) => {
            if(['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1){
                request.abort();
            }
            else{
                request.continue();
            }
        });
        await page.goto(gotoUrl);
        await page.type('input[name=q]', searchEngWord, {delay: 100});
        await page.keyboard.press('Enter');
        await page.waitForSelector('#tw-target-text');

        const translatedWord = await page.evaluate(() => {
            return document.querySelector('#tw-target-text').innerText.trim();
        });

        const translatedMeaning = await page.evaluate(() => {
            const elements = document.querySelectorAll('span[class="hrcAhc"]');
            let tempArr = [];
            for(let ele of elements){
                tempArr.push(ele.innerText);
            }
            return tempArr;
        });
        await browser.close();
        console.log(translatedWord, translatedMeaning);
})()
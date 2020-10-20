const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/', async (req, res) => {
    
    const engWord = req.body.word;
    // console.log(`input is ${engWord}`);
    const searchEngWord = `${engWord} meaning in telugu`;
    const gotoUrl = 'https://www.google.com/';

    try{
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
        await page.type('input[name=q]', searchEngWord);
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
        res.status(200).json({
            translatedWord,
            translatedMeaning
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

app.listen(PORT, () => {
    console.log('listening.....');
})


// console.log(`telugu translation: ${translatedWord}`);
// if(translatedMeaning.length == 0){
//     console.log('no meanings');
// }
// else{
//     for(let meaning of translatedMeaning){
//         console.log(`telugu meanings: ${meaning}`)
//     }
// }
// await page.waitFor(1000)
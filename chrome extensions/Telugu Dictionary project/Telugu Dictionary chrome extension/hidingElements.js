let spinnerElement, meaningElement, descriptionElement, spinner, translate, 
teluguWord, teluguMeaning, html, body, descriptionText;

document.addEventListener('DOMContentLoaded', () => {
    getTags();
    hideSpinner();
    hideMeaningElement();
    translate.addEventListener('click', getMeaning);
})

const getTags = () => {
    spinnerElement = document.getElementsByClassName('spinner-hide')[0];
    meaningElement = document.getElementsByClassName('meaning-hide')[0];
    descriptionElement = document.getElementById("description");
    spinner = document.getElementById('spinner');
    translate = document.getElementById('translate');
    teluguWord = document.getElementById('telugu_word');
    teluguMeaning = document.getElementById('telugu_meaning');
    englishWord = document.getElementById('english_input');
    html = document.documentElement;
    body = document.body;
    description = document.getElementById('emailHelp');
}


///////////////////        hide elements            ////////////////////////////
const hideMeaningElement = () => {
    meaningElement.style.setProperty('display', 'none');
}

const hideDescriptionElement = () => {
    descriptionElement.style.display = "none";
}

const invalidDescriptionElement = () => {
    description.innerText = "Please enter a valid string..!";
    description.style.color = "red";
    descriptionElement.style.display = "block";
}


///////////////////        show elements            ////////////////////////////
const showMeaningElement = () => {
    meaningElement.style.setProperty('display', 'block');
}


///////////////////        start & stop spinning   ////////////////////////////
const hideSpinner = () => {
    spinnerElement.style.display = 'none';
    spinner.style.visibility = 'hidden';
}

const showSpinner = () => {
    spinnerElement.style.display = 'block';
    spinner.style.visibility = 'visible';
}

const expandHeight = () => {
    html.style.height = '300px';
    body.style.height = '300px';
}


///////////////////        get meaning            ////////////////////////////
const getMeaning = () => {
    hideDescriptionElement();
    hideMeaningElement();
    showSpinner();
    const engWord = englishWord.value;
    console.log(engWord);
    if(!inputValidation(engWord)){
        // console.log('input validation');
        invalidDescriptionElement();
        hideSpinner();
    }
    else{
        const URL = 'http://localhost:3000/';
        fetch(URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({word: engWord})
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setInnerText(res.translatedWord, res.translatedMeaning);
            hideSpinner();
            showMeaningElement();
            // expandHeight();
        })
        .catch(err => {
            console.log(err);
        });
    }
    
}

const setInnerText = (telWord, telMeaning) => {
    teluguWord.innerText = telWord;
    teluguMeaning.innerText = telMeaning;
}


///////////////////        input validation            ////////////////////////////
const inputValidation = (word) => {
    if(!emptyCheck(word)) return 0;
    else if(!validString(word)) return 0;
    else return 1;
}

const emptyCheck = (word) => {
    if(word === '') return 0;
    else return 1;
}

const validString = (word) => {
    const regExp = /^[a-zA-Z]*$/;
    if(!regExp.test(word)) return 0;
    else return 1;
}
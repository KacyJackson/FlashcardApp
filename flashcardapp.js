// require inquirer to collect user input on command line
var inquirer = require('inquirer');

// require fs
var fs = require('fs');

// require basic flashcard 
var simpleFlashcard = require('./flashcard-simple.js');

// require cloze flashcard 
var clozeFlashcard = require('./flashcard-cloze.js');

inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'add-flashcard'
    }, {
        name: 'show-all-cards'
    }]
}]).then(function(answer) {
    if (answer.command === 'add-flashcard') {
        addCard();
    } else if (answer.command === 'show-all-cards') {
        showCards();
    }
});

var addCard = function() {
    // get user input
    inquirer.prompt([{
        name: 'cardType',
        message: 'What type of flashcard would you like to create?',
        type: 'list',
        choices: [{
            name: 'flashcard-simple'
        }, {
            name: 'flashcard-cloze'
        }]
    // once user input is received
    }]).then(function(answer) {
        if (answer.cardType === 'flashcard-simple') {
            inquirer.prompt([{
                name: 'front',
                message: 'What is the question?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please add a question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'What is the answer?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please provide an answer');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicFlashcard(answer.front, answer.back);
                newBasic.create();
                whatsNext();
            });
        } else if (answer.cardType === 'cloze-flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full text?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please include the full text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze portion?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please include the cloze portion');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeFlashcard(text, cloze);
                    newCloze.create();
                    nextStep();
                } else {
                    console.log('The cloze statement you provided is not found in the full text. Please try again.');
                    addCard();
                }
            });
        }
    });
};

var nextStep = function() {
    // get user input
    inquirer.prompt([{
        name: 'nextStep',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
            name: 'create-new-card'
        }, {
            name: 'show-all-cards'
        }, {
            name: 'nothing'
        }]
    // once user input is received
    }]).then(function(answer) {
        if (answer.nextAction === 'create-new-card') {
            addCard();
        } else if (answer.nextAction === 'show-all-cards') {
            showCards();
        } else if (answer.nextAction === 'nothing') {
            return;
        }
    });
};

var displayCards = function() {
    // read the log.txt file
    fs.readFile('./log.txt', 'utf8', function(error, data) {
        //if there is an error, log it
        if (error) {
            console.log('Error occurred: ' + error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

var showQuestion = function(array, index) {
    question = array[index];
    var parseQuestion = JSON.parse(question);
    var questionText;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        questionText = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        questionText = parsedQuestion.clozeDeleted;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('Correct!');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        } else {
            console.log('Wrong!');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        }
    });
};

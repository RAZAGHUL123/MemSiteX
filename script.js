let flashcards = [];
let currentFlashcardIndex = 0;
let isFlipped = false;

function addFlashcard() {
  const inputWord = document.getElementById('inputWord').value;
  const inputMeaning = document.getElementById('inputMeaning').value;

  if (inputWord && inputMeaning) {
    const flashcard = {
      word: inputWord,
      meaning: inputMeaning
    };

    flashcards.push(flashcard);
    clearInputs();
    logFlashcards();
  }
}

function generateFlashcards() {
  if (flashcards.length > 0) {
    const textContent = flashcards.map(flashcard => `${flashcard.word}:${flashcard.meaning}`).join('\n');
    const filename = 'flashcards.txt';
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Create a temporary link to download the text file
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    const flashcardLog = document.getElementById('flashcardLog');
    flashcardLog.innerHTML = '';

    flashcards.forEach((flashcard, index) => {
      const flashcardItem = document.createElement('p');
      flashcardItem.textContent = `${flashcard.word}: ${flashcard.meaning}`;
      flashcardLog.appendChild(flashcardItem);
    });
  }
}

function clearInputs() {
  document.getElementById('inputWord').value = '';
  document.getElementById('inputMeaning').value = '';
}

function startPlayback() {
  if (flashcards.length > 0) {
    const flashcardContainer = document.getElementById('flashcardContainer');
    flashcardContainer.innerHTML = '';

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const card = document.createElement('div');
    card.classList.add('flashcard');
    card.textContent = flashcards[currentFlashcardIndex].word;
    card.addEventListener('click', () => flipFlashcard());

    cardContainer.appendChild(card);

    flashcardContainer.innerHTML = '';
    flashcardContainer.appendChild(cardContainer);

    isFlipped = false;
    document.getElementById('playLabel').textContent = 'Word';

    // Remove the testContainer content
    const testContainer = document.getElementById('testContainer');
    testContainer.innerHTML = '';
  }
}


function flipFlashcard() {
  isFlipped = !isFlipped;

  if (isFlipped) {
    const card = document.querySelector('.flashcard');
    card.textContent = flashcards[currentFlashcardIndex].meaning;
    document.getElementById('playLabel').textContent = 'Definition';
  } else {
    const card = document.querySelector('.flashcard');
    card.textContent = flashcards[currentFlashcardIndex].word;
    document.getElementById('playLabel').textContent = 'Word';
  }
}

function startTest() {
  if (flashcards.length > 0) {
    const testContainer = document.getElementById('testContainer');
    testContainer.innerHTML = '';

    const question = document.createElement('p');
    question.classList.add('question');
    question.classList.add('big-text');
    question.style.backgroundColor = 'black';
    question.style.fontSize = '45px';

    question.style.color = 'violet';
    question.textContent = `What is the definition of "${flashcards[currentFlashcardIndex].word}"?`;

    const choicesContainer = document.createElement('div');
    choicesContainer.classList.add('choices-container');

    const choices = generateRandomChoices(currentFlashcardIndex);
    choices.forEach(choice => {
      const choiceButton = document.createElement('button');
      choiceButton.classList.add('choice-button');
      choiceButton.textContent = choice;
      choiceButton.addEventListener('click', () => checkAnswer(choice, flashcards[currentFlashcardIndex].meaning));

      choicesContainer.appendChild(choiceButton);
    });

    testContainer.appendChild(question);
    testContainer.appendChild(choicesContainer);
  }
}

function generateRandomChoices(correctIndex) {
  const choices = [];

  while (choices.length < 4) {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    const randomChoice = flashcards[randomIndex].meaning;

    if (!choices.includes(randomChoice) && randomChoice !== flashcards[correctIndex].meaning) {
      choices.push(randomChoice);
    }
  }

  choices.push(flashcards[correctIndex].meaning); // Add the correct answer at a random position
  return shuffleArray(choices);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function checkAnswer(selectedChoice, correctAnswer) {
  const testContainer = document.getElementById('testContainer');
  testContainer.innerHTML = '';

  const result = document.createElement('p');
  result.classList.add('result');

  if (selectedChoice === correctAnswer) {
    result.textContent = `Your answer: ${selectedChoice} | Correct answer: ${correctAnswer}`;
    const hellyea = document.createElement('p');
    hellyea.classList.add('hellyea');
    hellyea.textContent = 'hellyea';
    result.appendChild(hellyea);
  } else {
    result.textContent = `Oops, sorry. The correct answer was: ${correctAnswer} | Your answer: ${selectedChoice}`;
    result.style.color = 'red';
    result.style.fontWeight = 'bold';
    result.style.fontSize = '45px';
  }

  const nextButton = document.createElement('button');
  nextButton.classList.add('next-button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => {
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
    startTest();
  });

  testContainer.appendChild(result);
  testContainer.appendChild(nextButton);
}



function navigateToNextCard() {
  currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
  updateCard();

  // Remove the testContainer content
  const testContainer = document.getElementById('testContainer');
  testContainer.innerHTML = '';
}


function updateCard() {
  const flashcardContainer = document.getElementById('flashcardContainer');
  const card = flashcardContainer.querySelector('.flashcard');
  const playLabel = document.getElementById('playLabel');

  if (isFlipped) {
    card.textContent = flashcards[currentFlashcardIndex].meaning;
    playLabel.textContent = 'Definition';
  } else {
    card.textContent = flashcards[currentFlashcardIndex].word;
    playLabel.textContent = 'Word';
  }
}

function logFlashcards() {
  const flashcardLog = document.getElementById('flashcardLog');
  flashcardLog.innerHTML = '';

  flashcards.forEach((flashcard, index) => {
    const logEntry = document.createElement('div');
    logEntry.textContent = `${index + 1}. ${flashcard.word}: ${flashcard.meaning}`;
    flashcardLog.appendChild(logEntry);
  });
}

function handleFileUpload(event) {
  isTestMode = false;
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const contents = e.target.result;
      const lines = contents.split('\n');
      flashcards = lines.map(line => {
        const [word, meaning] = line.split(':');
        return { word, meaning };
      });
      logFlashcards();
    };
    reader.readAsText(file);
  }
}


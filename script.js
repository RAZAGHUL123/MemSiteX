let flashcards = [];
const flashcardContainer = document.getElementById('flashcardContainer');
const flashcardLog = document.getElementById('flashcardLog');
const playLabel = document.getElementById('playLabel');
let currentFlashcardIndex = 0;
let studyInterval;

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
  }
}

function clearInputs() {
  document.getElementById('inputWord').value = '';
  document.getElementById('inputMeaning').value = '';
}

function startPlayback() {
  if (flashcards.length > 0) {
    flashcardContainer.innerHTML = '';

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    flashcards.forEach((flashcard, index) => {
      const card = document.createElement('div');
      card.classList.add('flashcard');
      card.textContent = flashcard.word;
      card.style.animationDelay = `${index * 2}s`;
      card.addEventListener('click', () => flipFlashcard(card));

      cardContainer.appendChild(card);
    });

    flashcardContainer.innerHTML = '';
    flashcardContainer.appendChild(cardContainer);
    playLabel.textContent = 'Front';
    playLabel.classList.add('glow');
    setTimeout(() => {
      playLabel.classList.remove('glow');
    }, 2000);
  }
}

function flipFlashcard(card) {
  card.classList.toggle('flipped');
  if (card.classList.contains('flipped')) {
    card.textContent = flashcards[currentFlashcardIndex].meaning;
    playLabel.textContent = 'Back';
  } else {
    card.textContent = flashcards[currentFlashcardIndex].word;
    playLabel.textContent = 'Front';
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
  }
}

function startTest() {
  if (flashcards.length > 0) {
    clearInterval(studyInterval);

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    flashcards.forEach((flashcard, index) => {
      const card = document.createElement('div');
      card.classList.add('flashcard');
      card.textContent = flashcard.word;
      card.style.animationDelay = `${index * 2}s`;
      card.addEventListener('click', () => flipFlashcard(card));

      cardContainer.appendChild(card);
    });

    flashcardContainer.innerHTML = '';
    flashcardContainer.appendChild(cardContainer);
  }
}

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function logFlashcards() {
  flashcardLog.innerHTML = '';
  flashcards.forEach((flashcard, index) => {
    const logEntry = document.createElement('div');
    logEntry.textContent = `${index + 1}. ${flashcard.word}: ${flashcard.meaning}`;
    flashcardLog.appendChild(logEntry);
  });
}

function handleFileUpload(event) {
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

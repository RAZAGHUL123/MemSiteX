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
        currentFlashcardIndex = 0;
        startPlayback();
      }
    }

    function navigateToNextCard() {
      currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
      updateCard();
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
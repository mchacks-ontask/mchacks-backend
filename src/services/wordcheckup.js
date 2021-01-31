const list_of_words = ['apple', 'clouds', 'cats', 'banana', 'sean', 'horse', 'australopithicus'];

class WordCheckup {
  constructor(wordList) {
    this.words = wordList;
  }

  pickRandomWord(done) {
    const word = this.words[Math.floor(Math.random() * this.words.length)];
    logit('Words', `Selected word ${word} as random word.`, 'info');

    return done(word);
  }

  testParticipants() {
    this.pickRandomWord((word) => {
      // Send word to discord participants here...
    });
  }
}

module.exports = new WordCheckup(list_of_words);
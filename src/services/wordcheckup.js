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

  testParticipants(client, userID, textChannel) {
    this.pickRandomWord((word) => {
        client.channels.cache
        .get(textChannel)
        .send(word, { tts: true }).then(msg => {
          msg.delete({timeout : 2000});
        });

        client.users.cache.get(userID).send(`What was the secret word I just said?`);
        
    });
  }
}

module.exports = new WordCheckup(list_of_words);
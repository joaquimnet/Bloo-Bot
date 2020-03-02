const { Text } = require('chop-tools');

module.exports = class Mission {
  // eslint-disable-next-line object-curly-newline
  constructor({ mission, money, petExp, emoji, duration, difficulty }) {
    this.mission = mission;
    this.money = money;
    this.petExp = petExp;
    this.emoji = emoji;
    this.duration = duration;
    this.difficulty = difficulty;
  }

  display() {
    return `${this.emoji} **[${this.difficulty}]** ${this.mission} - __${this.duration}m__`;
  }

  displayLong() {
    return Text.lines(
      `${this.emoji} **${this.mission}**`,
      `**Difficulty:** ${this.difficulty}`,
      `**Duration:** ${this.duration} minutes.`,
      `**Bloo Ink Reward:** ${this.money}`,
      `**Pet Exp Reward:** ${this.petExp}`,
    );
  }

  get emojiId() {
    return this.emoji.substr(this.emoji.length - 19, 18);
  }
};

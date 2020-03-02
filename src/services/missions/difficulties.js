const { MISSIONS } = require('../../BLOO_GLOBALS');

const difficulties = new Map();

difficulties.set(MISSIONS.EASY.NAME, {
  name: MISSIONS.EASY.NAME,
  emoji: '<:mission_easy:683477186099151004>',
  money: MISSIONS.EASY.MONEY,
  petExp: MISSIONS.EASY.PET_EXP,
  duration: MISSIONS.EASY.DURATION,
});

difficulties.set(MISSIONS.NORMAL.NAME, {
  name: MISSIONS.NORMAL.NAME,
  emoji: '<:mission_normal:683477230973747279>',
  money: MISSIONS.NORMAL.MONEY,
  petExp: MISSIONS.NORMAL.PET_EXP,
  duration: MISSIONS.NORMAL.DURATION,
});

difficulties.set(MISSIONS.HARD.NAME, {
  name: MISSIONS.HARD.NAME,
  emoji: '<:mission_hard:683477307347697728>',
  money: MISSIONS.HARD.MONEY,
  petExp: MISSIONS.HARD.PET_EXP,
  duration: MISSIONS.HARD.DURATION,
});

difficulties.set(MISSIONS.INSANE.NAME, {
  name: MISSIONS.INSANE.NAME,
  emoji: '<:mission_insane:683477354781081666>',
  money: MISSIONS.INSANE.MONEY,
  petExp: MISSIONS.INSANE.PET_EXP,
  duration: MISSIONS.INSANE.DURATION,
});

difficulties.set(MISSIONS.MASTER.NAME, {
  name: MISSIONS.MASTER.NAME,
  emoji: '<:mission_master:683477400906235925>',
  money: MISSIONS.MASTER.MONEY,
  petExp: MISSIONS.MASTER.PET_EXP,
  duration: MISSIONS.MASTER.DURATION,
});

module.exports = difficulties;

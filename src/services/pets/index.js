const path = require('path');
const sharp = require('sharp');

const random = require('../../util/random');

const NAMES = require('./pet_names.json');

const { FIRST_NAMES, LAST_NAMES } = NAMES;

const parts = {
  base: ['base_slime', 'base_robot'],
  eyes: ['eyes_1', 'eyes_2', 'eyes_3', 'eyes_4', 'eyes_5', 'eyes_6', 'eyes_7', 'eyes_8'],
};

const getRandomModulateOptions = () => {
  return {
    hue: random([30, 60, 90, 120, 150, 180, 210, 240, 270, 330, 360]),
    brightness: random([0.9, 1, 1.1, 1.2, 1.3]),
    saturation: random([0, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]),
  };
};

const pathToPart = p => path.join(__dirname, `../../../assets/${p}.png`);

module.exports = class Pets {
  static generateRandomName() {
    return `${random(FIRST_NAMES)} ${random(LAST_NAMES)}`;
  }

  static generateImageRecipe() {
    const base = random(parts.base);
    const eyes = random(parts.eyes);

    return [
      [pathToPart(base), getRandomModulateOptions()],
      [pathToPart(eyes), getRandomModulateOptions()],
    ];
  }

  static async buildImage(recipe) {
    const base = recipe.shift();
    const img = sharp(base[0]).modulate(base[1]);
    const toComposite = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const p of recipe) {
      // eslint-disable-next-line no-await-in-loop
      const newPart = await sharp(p[0])
        .modulate(p[1])
        .toBuffer();
      toComposite.push({ input: newPart });
    }
    return img.composite(toComposite).toBuffer();
  }

  static async buildLevelUpImage(petImageBuffer) {
    const base = await sharp({
      create: {
        width: 192,
        height: 64,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    });

    const img = base
      .composite([
        {
          input: await sharp(pathToPart('level_up'))
            .modulate(getRandomModulateOptions())
            .toBuffer(),
          gravity: 'west',
        },
        { input: await sharp(petImageBuffer).toBuffer(), gravity: 'east' },
      ])
      .png()
      .toBuffer();
    return img;
  }
};

const { Pet } = require('../../../models');

module.exports = async (command, data) => {
  const { target, field, value } = data;
  if (!target || !field || !value) {
    return;
  }

  let id;
  let isPet;
  if (target.startsWith('pet:')) {
    id = target.substr(4);
    isPet = true;
  }
  if (target.startsWith('user:')) {
    id = target.substr(5);
    isPet = false;
  }

  switch (command) {
    case 'set':
      if (isPet) {
        return await Pet.updateOne({ _id: id }, { [field]: value }).exec();
      } else {
        return await Pet.updateMany({ owner: id }, { [field]: value }).exec();
      }
    case 'add':
      if (isPet) {
        return await Pet.updateOne({ _id: id }, { $inc: { [field]: value } }).exec();
      } else {
        return await Pet.updateMany({ owner: id }, { $inc: { [field]: value } }).exec();
      }
    case 'decrease':
      if (isPet) {
        return await Pet.updateOne({ _id: id }, { $inc: { [field]: -value } }).exec();
      } else {
        return await Pet.updateMany({ owner: id }, { $inc: { [field]: -value } }).exec();
      }
    default:
    // ???
  }
};

module.exports = (position, validAliases, args) => {
  return args[position] && validAliases.includes(args[position].toLowerCase());
}

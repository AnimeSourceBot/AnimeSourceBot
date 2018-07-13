function superscript(text, level = 1) {
  return `^`.repeat(level) + text.replace(/ /g, '&nbsp;');
}

module.exports = { superscript };


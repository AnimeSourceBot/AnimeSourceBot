function superscript(text, level = 1) {
  return `^`.repeat(level) + text.replace(/ /g, '&nbsp;');
}

const charactersToEscape = '\\*^~[]()<>`&!-_.|';

function escape(string) {
  let newString = '';
  for(const x of string) {
    if (charactersToEscape.indexOf(x) > -1) {
      newString += '\\';
    }
    newString += x;
  }
  return newString.replace(/^\s+|\s+$/g, '');
}

module.exports = { superscript, escape };


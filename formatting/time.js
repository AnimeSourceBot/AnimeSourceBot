function secondsToHoursMinutesSeconds(seconds) {
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  seconds = Math.round(seconds);
  if (seconds === 60) {
    seconds -= 60;
    minutes += 1;
  }
  if (minutes === 60) {
    minutes -= 60;
    hours += 1;
  }
  return { hours, minutes, seconds };
}

function secondsToHHMMSS(seconds) {
  const time = secondsToHoursMinutesSeconds(seconds);

  function f(str) {
    return str.toString().padStart(2, '0');
  }

  if (time.hours === 0) {
    return `${f(time.minutes)}:${f(time.seconds)}`;
  } else {
    return `${time.hours}:${f(time.minutes)}:${f(time.seconds)}`;
  }
}

function timestamp(secondsA, secondsB) {
  if (secondsA > secondsB) throw 'secondsA > secondsB';
  const timeA = secondsToHoursMinutesSeconds(secondsA);
  const timeB = secondsToHoursMinutesSeconds(secondsB);

  function f(str) {
    return str.toString().padStart(2, '0');
  }

  if (timeB.hours === 0) {
    return `${f(timeA.minutes)}:${f(timeA.seconds)}/${f(timeB.minutes)}:${f(timeB.seconds)}`;
  } else {
    return `${timeA.hours}:${f(timeA.minutes)}:${f(timeA.seconds)}/${timeB.hours}:${f(timeB.minutes)}:${f(timeB.seconds)}`;
  }
}

module.exports = { secondsToHHMMSS, timestamp };
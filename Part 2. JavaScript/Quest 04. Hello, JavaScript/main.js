const input = parseInt(prompt('How many lines of stars do you want to draw?'));

if (isNaN(input) || input === 0) {
  console.log('Input is not valid number');
} else {
  const maxStars = input * 2 - 1;
  const middle = input - 1;

  for (let i = 0; i < input; i++) {
    let line = '';
    for (let j = 0; j < maxStars; j++) {
      if (middle - i <= j && j <= middle + i) {
        line += '*';
      } else {
        line += ' ';
      }
    }
    console.log(line);
  }
}
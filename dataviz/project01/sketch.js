function setup() {
  createCanvas(625, 625);
  angleMode(DEGREES);
  strokeWeight(6);
}

function draw() {
  background('#D9d9d9');

  let now = new Date();
  let sec = now.getSeconds() + now.getMilliseconds() / 1000;
  let min = now.getMinutes() + sec / 60;
  let hrs = now.getHours() + min / 60;

  let oneMinute = sec / 60;                
  let oneHour   = (min * 60 + sec) / 3600;
  let oneDay    = (hrs * 3600 + min * 60) / 86400;

  let minCap = map(oneMinute, 0, 1, 0, 120);           
  let hourCap = map(oneHour,   0, 1, 120, 240);         
  let dayCap = map(oneDay, 0, 1, 240, 360);

  noStroke()
  fill('#add8e65d');
  arc(300, 300, 306, 306, 240, 360, PIE);
  
  fill('#ff634857');
  arc(300, 300, 306, 306, 0, 120, PIE);

  fill('#90ee925d');
  arc(300, 300, 306, 306, 120, 240, PIE);
  
  stroke('black')
  fill('lightblue');
  arc(300, 300, 300, 300, 240, dayCap, PIE);
  
  fill('tomato');
  arc(300, 300, 300, 300, 0, minCap, PIE);

  fill('lightgreen');
  arc(300, 300, 300, 300, 120, hourCap, PIE);

  fill('#D9d9d9')
  circle(300, 300, 180)
}
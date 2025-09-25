function setup() {
  createCanvas(625, 625);
  angleMode(DEGREES);
  strokeWeight(6);
}

function draw() {
  background('#6b6b6b');

  let now = new Date();
  let sec = now.getSeconds() + now.getMilliseconds() / 1000;
  let min = now.getMinutes() + sec / 60;
  let hrs = now.getHours() + min / 60;

  let oneMinute = sec / 60;                
  let oneHour   = min / 60;
  let oneDay    = (now.getHours()*3600 + now.getMinutes()*60 + sec) / 86400;

  let minCap = map(oneMinute, 0, 1, 0, 120);           
  let hourCap = map(oneHour,   0, 1, 120, 240);         
  let dayCap = map(oneDay, 0, 1, 240, 360);

  strokeWeight(2);
  fill('#add8e65d');
  arc(300, 300, 304, 304, 240, 360, PIE);
  
  fill('#ff634857');
  arc(300, 300, 304, 304, 0, 120, PIE);

  fill('#90ee925d');
  arc(300, 300, 304, 304, 120, 240, PIE);
  
  strokeWeight(6);
  fill('lightblue');
  arc(300, 300, 300, 300, 240, dayCap, PIE);
  
  fill('tomato');
  arc(300, 300, 300, 300, 0, minCap, PIE);

  fill('lightgreen');
  arc(300, 300, 300, 300, 120, hourCap, PIE);

  fill('#6b6b6b')
  circle(300, 300, 180)
}
function setup() {
  createCanvas(625, 625);
  angleMode(DEGREES);
  strokeWeight(6);
}

function draw() {
  background(230);

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
  
  fill('lightblue');
  arc(300, 300, 300, 300, 240, dayCap, PIE);
  
  fill('tomato');
  arc(300, 300, 300, 300, 0, minCap, PIE);

  fill('goldenrod');
  arc(300, 300, 300, 300, 120, hourCap, PIE);

  fill(230)
  circle(300, 300, 180)
}
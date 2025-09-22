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

  let minCap = map(oneMinute, 0, 1, 0, 360);           
  let hourCap = map(oneHour,   0, 1, 0, 360);         
  let dayCap = map(oneDay, 0, 1, 0, 360);
  
  noStroke()
  fill('#C5C5C5');
  arc(300, 300, 506, 506, 0, 360, PIE);
  
  stroke('black')
  fill('lightblue');
  arc(300, 300, 500, 500, 0, dayCap, PIE);


  fill('lightgreen');
  arc(300, 300, 300, 300, 0, hourCap, PIE);
  
  fill('tomato');
  arc(300, 300, 150, 150, 0, minCap, PIE);
  
  fill('#D9d9d9')
  circle(300, 300, 50)
}
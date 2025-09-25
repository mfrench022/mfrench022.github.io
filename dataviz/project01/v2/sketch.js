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

  let minCap = map(oneMinute, 0, 1, 0, 360);
  let hourCap = map(oneHour,   0, 1, 0, 360);
  let dayCap = map(oneDay, 0, 1, 0, 360);
  
  strokeWeight(2);
   fill('#def7ffff');
  arc(300, 300, 304, 304, 0, 360, PIE);

  strokeWeight(6);
  fill('lightblue');
  arc(300, 300, 300, 300, 0, dayCap, PIE);

strokeWeight(2);
  fill('#ddf6ddff');
  arc(300, 300, 184, 184, 0, 360, PIE);

strokeWeight(6);
  fill('lightgreen');
  arc(300, 300, 180, 180, 0, hourCap, PIE);

strokeWeight(2);
  fill('#f8c7beff');
  arc(300, 300, 104, 104, 0, 360, PIE);
  
strokeWeight(6);
  fill('tomato');
  arc(300, 300, 100, 100, 0, minCap, PIE);
  
  fill('#6b6b6b')
  circle(300, 300, 50)
}
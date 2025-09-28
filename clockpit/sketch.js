let makeClock1 = (opts) => (p) => {
    p.setup = () => {
        p.createCanvas(opts.w || 300, opts.h || 300).parent(opts.parent);
        p.angleMode(p.DEGREES);
      };
    p.draw = () => {

  let lengthx = p.width/2
  let lengthy = p.height/2 

  let now = new Date();
  let sec = now.getSeconds() + now.getMilliseconds() / 1000;
  let min = now.getMinutes() + sec / 60;
  let hrs = now.getHours() + min / 60;

  let oneMinute = sec / 60;                
  let oneHour   = min / 60;
  let oneDay    = (now.getHours()*3600 + now.getMinutes()*60 + sec) / 86400;

  let minCap = p.map(oneMinute, 0, 1, 0, 120);           
  let hourCap = p.map(oneHour,   0, 1, 120, 240);         
  let dayCap = p.map(oneDay, 0, 1, 240, 360);

  p.stroke('#0c0c0cff');

  p.strokeWeight(18);
  p.fill('#FFFBED')
  p.circle(lengthx, lengthy, 370)
  
  p.strokeWeight(2);
  p.fill('#E4FFFF');
  p.arc(lengthx, lengthy, 304, 304, 240, 360, p.PIE);
  
  p.fill('#FF9B80');
  p.arc(lengthx, lengthy, 304, 304, 0, 120, p.PIE);

  p.fill('#C8FFC9');
  p.arc(lengthx, lengthy, 304, 304, 120, 240, p.PIE);
  
  p.strokeWeight(6);
  p.fill('lightblue');
  p.arc(lengthx, lengthy, 300, 300, 240, dayCap, p.PIE);
  
  p.fill('tomato');
  p.arc(lengthx, lengthy, 300, 300, 0, minCap, p.PIE);

  p.fill('lightgreen');
  p.arc(lengthx, lengthy, 300, 300, 120, hourCap, p.PIE);

  p.fill('#FFFBED')
  p.circle(lengthx, lengthy, 50)
}
}

let makeClock2 = (opts) => (p) => {
    p.setup = () => {
        p.createCanvas(opts.w || 300, opts.h || 300).parent(opts.parent);
        p.angleMode(p.DEGREES);
      };
    p.draw = () => {

  let lengthx = p.width/2
  let lengthy = p.height/2 

  let now = new Date();
  let sec = now.getSeconds() + now.getMilliseconds() / 1000;
  let min = now.getMinutes() + sec / 60;

  let oneMinute = sec / 60;                
  let oneHour   = min / 60;
  let oneDay    = (now.getHours()*3600 + now.getMinutes()*60 + sec) / 86400;

  let minCap = p.map(oneMinute, 0, 1, 0, 360);
  let hourCap = p.map(oneHour,   0, 1, 0, 360);
  let dayCap = p.map(oneDay, 0, 1, 0, 360);

  p.stroke('#0c0c0cff');
   p.strokeWeight(18);
  p.fill('#FFFBED')
  p.circle(lengthx, lengthy, 370)

  p.strokeWeight(2);

  p.fill('#E4FFFF');
  p.arc(lengthx, lengthy, 304, 304, 0, 360, p.PIE);

  p.strokeWeight(6);
  p.fill('lightblue');
  p.arc(lengthx, lengthy, 300, 300, 0, dayCap, p.PIE);
  
  p.strokeWeight(2);
  p.fill('#C8FFC9');
  p.arc(lengthx, lengthy, 184, 184, 0, 360, p.PIE);
  
  p.strokeWeight(6);
  p.fill('lightgreen');
  p.arc(lengthx, lengthy, 180, 180, 0, hourCap, p.PIE);
  
  p.strokeWeight(2);
  p.fill('#FF9B80');
  p.arc(lengthx, lengthy, 104, 104, 0, 360, p.PIE);

  p.strokeWeight(6);
  p.fill('tomato');
  p.arc(lengthx, lengthy, 100, 100, 0, minCap, p.PIE);
  
  p.fill('#FFFBED')
  p.circle(lengthx, lengthy, 50)
}
}

let makeClock3 = (opts) => (p) => {
    p.setup = () => {
        p.createCanvas(opts.w || 300, opts.h || 300, p.WEBGL).parent(opts.parent);
        p.angleMode(p.DEGREES);
      };
    p.draw = () => {

  let now = new Date();
  let sec = now.getSeconds() + now.getMilliseconds() / 1000;

  let oneMinute = sec / 60;

  let minCap = p.map(oneMinute, 0, 1, 0, 14);
  let minCap2 = p.map(oneMinute, 0, 1, 0, 360);

  p.strokeWeight(minCap);
  p.stroke('#fcff5cff');
  p.fill('#0c0c0cff');

  let axis = p.createVector(1, 1, 0);
  p.rotate(minCap2, axis);
  p.sphere(150, 24, 24)
}
}

let clockSketch1 = new p5(makeClock1({ parent: 'clock1', w: 500, h:  500 }));
let clockSketch2 = new p5(makeClock2({ parent: 'clock2', w: 500, h:  500 }));
let clockSketch3 = new p5(makeClock3({ parent: 'clock3', w: 500, h:  500 }));



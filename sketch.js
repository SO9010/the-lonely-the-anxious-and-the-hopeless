class obj {
  constructor(imgPath, imgSoundPath) {
    this.imgSoundPath = imgSoundPath;
    this.imgPath = imgPath;
    this.img = null;
    this.sound = null;
    this.isDragging = false;
    this.finalSize = 100;
  }

  // I also want a preload function
  preLoad(){
    try {
      this.sound = loadSound(this.imgSoundPath);
      this.img = loadImage(this.imgPath);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  setUp(imgPosX, imgPosY, imgSize) {
    this.imgSize = imgSize;
    this.imgPosX = imgPosX;
    this.imgPosY = imgPosY;
    this.sound.loop();
    this.analyzer = new p5.Amplitude();
    this.analyzer.setInput(this.sound);
  }

  draw() {
    let distanceFromImage = (1 - dist(mouseX, mouseY, this.imgPosX, this.imgPosY) / (this.imgSize * 2.5));
    if(distanceFromImage < 0){
      distanceFromImage = 0.01; 
    }
    else if(distanceFromImage > 1){
      distanceFromImage = 1;
    }

    let rms = this.analyzer.getLevel();
    this.sound.amp(distanceFromImage);

    this.finalSize = this.imgSize + rms * 500;

    imageMode(CENTER);
    image(this.img, this.imgPosX, this.imgPosY, this.finalSize, this.finalSize);
  }

  isMouseOn(){
    if (
      mouseX >= this.imgPosX - this.finalSize / 2 &&
      mouseX <= this.imgPosX + this.finalSize / 2 &&
      mouseY >= this.imgPosY - this.finalSize / 2 &&
      mouseY <= this.imgPosY + this.finalSize / 2) {
      return true;
    }
    else{
      return false;
    }
  }

  mousePressed() {
    if(this.isMouseOn()){
      this.isDragging = true;
      this.imgPosX = mouseX;
      this.imgPosY = mouseY;
    }
  }
  
  mouseDragged() {
    if (this.isDragging) {
      // Update the position of the element while dragging
      this.imgPosX = mouseX;
      this.imgPosY = mouseY;
    }
  }
  
  mouseReleased() {
    // Stop dragging when the mouse is released
    this.isDragging = false;
  }
  
}


let angle = 0;
let audioCtx, font;
let centreCircleSound;
let img1;
let started = false;

function backroundShape(){
  noStroke();
  fill(45);
  let d1 = width/8 + (sin(angle) * width/2) / 2 + width/2 / 2;
  let d2 = width/8 + (sin(angle + PI / 2) * width/2) / 2 + width/2 / 2;
  let d3 = width/8 + (sin(angle + PI) * width/2) / 2 + width/2 / 2;

  ellipse(0, height / 2, d1, d1);
  ellipse(width / 2, height / 2, d2, d2);
  ellipse(width, height / 2, d3, d3);

  angle += 0.02;
}


function preload() {
  soundFormats('mp3', 'ogg');
  centreCircleSound = loadSound('assets/audio/bombabom.mp3');
  font = loadFont('assets/font/Roboto_Mono/RobotoMono-VariableFont_wght.ttf');
  img1 = new obj('assets/images/img1.jpg', '../assets/audio/audio1.mp3');
  img1.preLoad();
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);

  audioCtx = getAudioContext();
  audioCtx.suspend();  

  img1.setUp(random(width), random(height), width/8);
  ccStartUp();

  textFont(font);

  background(25);
}

function draw() {
  // put drawing code here
  background(25, 15);
  backroundShape();

  textSize(70);
  text('The lonley, the anxious and the hopeless.', 35, height- 35);

  centreCircle();
  img1.draw();
  textSize(30);
  if(!started){
    strokeWeight(5);
    text('Click to start!',0, 30);
  }
}

function mousePressed() {
  // so the goal is to have it so all thingsa re loaded then the perosn clikcs start and this starts playing everything.
  if(!started){
    audioCtx.resume();
    started = true;
  }
  img1.mousePressed();
}

function mouseDragged() {
  img1.mouseDragged();
}

function mouseReleased() {
  // Stop dragging when the mouse is released
  img1.mouseReleased();
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}




///////////////////////////////////////////////////
// Centre Circle code /////////////////////////////
///////////////////////////////////////////////////

let analyzer;

function ccStartUp() {
  centreCircleSound.loop()

  analyzer = new p5.Amplitude();
  analyzer.setInput(centreCircleSound);
}

function centreCircle() {
  // put drawing code here
  let posX = width / 2;
  let posY = height / 2;
  let size = 1-(dist(mouseX, mouseY, posX, posY)/(dist(0, 0, posX, posY)))*1.5;
  if(size < 0.05){
    size = 0.05;
  }
  else if(size > 1){
    size = 1;
  }

  let rms = analyzer.getLevel();
  centreCircleSound.amp(size);

  fill('#b3b3b3');
  stroke(40);
  strokeWeight(20);
  circle(posX, posY, width/8 + rms * 1000);
}

// IDEA make it so if the iamge is clicked on, it centres it and blurs out the background.s
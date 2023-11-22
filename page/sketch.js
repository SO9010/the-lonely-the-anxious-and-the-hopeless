class obj {
  constructor(imgPath, imgSoundPath) {
    this.imgSoundPath = imgSoundPath;
    this.imgPath = imgPath;
    this.img = null;
    this.sound = null;
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
    let distanceFromImage = (1 - dist(mouseX, mouseY, this.imgPosX, this.imgPosY) / (this.imgSize * 3));
    if(distanceFromImage < 0){
      distanceFromImage = 0.01; 
    }
    else if(distanceFromImage > 0.9){
      distanceFromImage = 0.9;
    }

    let rms = this.analyzer.getLevel();
    this.sound.amp(distanceFromImage);

    imageMode(CENTER);
    image(this.img, this.imgPosX, this.imgPosY, this.imgSize + rms * 1000, this.imgSize + rms * 1000);
  }

  isMouseOn(){
    if (mouseX >= this.posX && mouseX <= this.posX + this.imgSize && mouseY >= this.posY && mouseY <= this.posY + this.imgSize) {
      return true;
    }
    else{
      return false;
    }
  }
}


let analyzer, audioCtx;
let centreCircleSound;
let img1;

function preload() {
  soundFormats('mp3', 'ogg');
  centreCircleSound = loadSound('../assets/audio/bombabom.mp3');
  img1 = new obj('../assets/images/img1.jpg', '../assets/audio/audio1.mp3');
  img1.preLoad();
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  audioCtx = getAudioContext();
  audioCtx.suspend();  
  img1.setUp(random(width), random(height), width/6);
  ccStartUp();
  background(20);
}

function draw() {
  // put drawing code here
  background(20, 15);
  centreCircle();
  img1.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // so the goal is to have it so all thingsa re loaded then the perosn clikcs start and this starts playing everything.
  audioCtx.resume();
}

///////////////////////////////////////////////////
// Centre Circle code /////////////////////////////
///////////////////////////////////////////////////



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
  else if(size > 0.9){
    size = 0.9;
  }

  let rms = analyzer.getLevel();
  centreCircleSound.amp(size);

  fill('#b3b3b3');
  noStroke();
  circle(posX, posY, width/8 + rms * 1000);
}

///////////////////////////////////////////////////
// Populate with images ///////////////////////////
///////////////////////////////////////////////////

// We want to have a new function that creates a new analyzer, and then effects the images in the same way to how to balls weermade.

// IDEA make it so if the iamge is clicked on, it centres it and blurs out the background.s
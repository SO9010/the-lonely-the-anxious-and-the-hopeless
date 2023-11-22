// If the sound is less that .2 then have it so a voice goes, ah thats nice, finally some quiite. 

class obj {
  constructor(imgPath, imgSoundPath) {
    this.imgSoundPath = imgSoundPath;
    this.imgPath = imgPath;
    this.img = null;
    this.sound = null;
    this.isDragging = false;
    this.finalSize = 100;
  }

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
    this.imgSizeCpy = imgSize;
    this.imgPosX = imgPosX;
    this.imgPosY = imgPosY;
    this.sound.loop();
    this.analyzer = new p5.Amplitude();
    this.analyzer.setInput(this.sound);
  }

  draw() {
    let distanceFromImage = (1 - dist(mouseX, mouseY, this.imgPosX, this.imgPosY) / (this.imgSize * 3.75));
    if(distanceFromImage < 0){
      distanceFromImage = 0.01; 
    }
    else if(distanceFromImage > 1){
      distanceFromImage = 1;
    }

    let rms = this.analyzer.getLevel();
    this.sound.amp(distanceFromImage);

    this.finalSize = this.imgSize + rms * 650;

    imageMode(CENTER);
    image(this.img, this.imgPosX, this.imgPosY, this.finalSize, this.finalSize);
  }

  // This handles the movement of the images //
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
      this.imgSize = this.imgSizeCpy*4;
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
    this.imgSize = this.imgSizeCpy;
    this.isDragging = false;
  }
  
}


let angle = 0;
let audioCtx, font;
let centreCircleSound;
let imageObjects = [];
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
let num = 12;
// to load all of mt images and sounds we can put it in an array, then loop through the dir until there are none left, the naming should be img1, sound1, ext...
function preload() {
  soundFormats('mp3', 'ogg');
  centreCircleSound = loadSound('assets/audio/bombabom.mp3');
  font = loadFont('assets/font/Roboto_Mono/RobotoMono-VariableFont_wght.ttf');

  for (let i = 1; i <= num; i++) {
    let imgPath = 'assets/images/img'+ i +'.jpg';
    let soundPath = 'assets/audio/audio'+ i +'.mp3';
    console.log(soundPath);
    imageObjects.push(new obj(imgPath, soundPath));
  }
  for (let i = 0; i < imageObjects.length -1; i++) {
    let crnt = imageObjects[i];
    crnt.preLoad();
  }
}


function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);

  audioCtx = getAudioContext();
  audioCtx.suspend();  
  let imgWidth;
  if(width > height){
    imgWidth = height/8;
  }
  else{
    imgWidth = width/8;
  }
  for(let i = 0; i < imageObjects.length -1; i++){
    //add a function to get a suiteble random size and position for each image
    let crnt = imageObjects[i];
    crnt.setUp(random(width), random(height), imgWidth);
  }
  ccStartUp();

  textFont(font);

  background(25);
}

function draw() {
  // put drawing code here
  background(25, 15);
  backroundShape();

  textSize(70);
  text('The lonely, the anxious and the hopeless.', 35, height - 35);

  centreCircle();
  for(let i = 0; i < imageObjects.length -1; i++){
    let crnt = imageObjects[i];
    crnt.draw();
  }
  textSize(30);
  if(!started){
    noStroke();
    fill(75)
    text('Click to start!', 0, 30);
  }
}

function mousePressed() {
  // so the goal is to have it so all thingsa re loaded then the perosn clikcs start and this starts playing everything.
  if(!started){
    audioCtx.resume();
    started = true;
  }
  for(let i = 0; i < imageObjects.length -1; i++){
    let crnt = imageObjects[i];
    crnt.mousePressed();
  }
}

function mouseDragged() {
  for(let i = 0; i < imageObjects.length -1; i++){
    let crnt = imageObjects[i];
    crnt.mouseDragged();
  }
}

function mouseReleased() {
  // Stop dragging when the mouse is released
  for(let i = 0; i < imageObjects.length -1; i++){
    let crnt = imageObjects[i];
    crnt.mouseReleased();
  }
} 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(25);
  for(let i = 0; i < imageObjects.length -1; i++){
    //add a function to get a suiteble random size and position for each image
    let crnt = imageObjects[i];
    crnt.imgPosX = random(width);
    crnt.imgPosY = random(height);
  }
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
let video;
let poseNet;
let pose;
let skeleton;
let hearImg; // 新增變數來儲存圖片

function preload() {
  hearImg = loadImage('hear.png'); // 預先載入圖片
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded); 
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;  
    skeleton = poses[0].skeleton; 
  }
}

function modelLoaded() {   
  console.log('poseNet ready');
}

function draw() {
  background(0);
  translate(video.width, 0);  
  scale(-1, 1);    
  image(video, 0, 0);  

  if (pose) {
    let eyeR = pose.rightEye;  
    let eyeL = pose.leftEye;   
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); 

    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d); 

    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 62); 
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 62); 

    // 在鼻子位置顯示 hear.png
    image(hearImg, pose.nose.x - d / 2, pose.nose.y - d / 2, d, d);

    // 在左耳位置顯示 hear.png
    let leftEar = pose.keypoints[3].position; // 取得左耳的位置
    image(hearImg, leftEar.x - d / 4, leftEar.y - d / 4, d / 2, d / 2);

    drawKeypoints();
    drawSkeleton();
  }
}

function drawKeypoints() {  
  for (let i = 0; i < pose.keypoints.length; i++) {
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    fill(0, 255, 0);
    ellipse(x, y, 16, 16);
  }
}

function drawSkeleton() {
  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];			
    stroke(255, 0, 0);
    line(a.position.x, a.position.y, b.position.x, b.position.y);			
  }
}
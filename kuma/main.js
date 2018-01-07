//v4.1.0 kuma封装之前

var canvas;
var gl;
var program;

var axis = 1;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var vPosition, vNormal, vTexCoord; //对应html文件中的变量

var precise = 5; //精度

var bear1 = new SceneObject();
var bear2 = new SceneObject();
var dotLight = new SceneObject();
var camera_default = new Camera();

var hat1 = new SceneObject();
var hat2 = new SceneObject();

var scene=new SceneObject();

var camera = camera_default;
var character = bear1;
// var thetaTest=-135;
// var direction=5;
// var jumpHeight=0;
// var directionj=0.5;

var textures=[];
var images=[];

var dr = radians(5.0);
function Camera() {
  this.near = 0.3;
  this.far = 30.0;
  this.fovy = 45.0; // Field-of-view in Y direction angle (in degrees)
  this.aspect; // Viewport aspect ratio

  this.radius = 2.0;
  this.theta = Math.PI / 2;
  this.phi = Math.PI / 2;
  this.eye;
  this.at = vec3(0.0, 0.0, 0.0);
  this.up = vec3(0.0, 1.0, 0.0);

  this.calModelViewMat = function() {
    this.eye = add(
      vec3(
        this.radius * Math.sin(this.phi) * Math.cos(this.theta),
        this.radius * Math.cos(this.phi),
        this.radius * Math.sin(this.phi) * Math.sin(this.theta)
      ),
      this.at
    );
    return lookAt(this.eye, this.at, this.up);
  };
  this.calPerspectiveMat = function() {
    return perspective(this.fovy, this.aspect, this.near, this.far);
  };
  this.attach = function(obj) {
    this.at = add(vec3(obj.offset), obj.centerPos);
  };
}

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight-5);
  camera.aspect = canvas.width / canvas.height;

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  // First, initialize the vertices of oSur 3D gasket
  // Four vertices on unit circle
  // Intial tetrahedron with equal length sides
  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // enable hidden-surface removal

  gl.enable(gl.DEPTH_TEST);

  //  Load shaders and initialize attribute buffers

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  vPosition = gl.getAttribLocation(program, "vPosition");
  vNormal = gl.getAttribLocation(program, "vNormal");
  vTexCoord = gl.getAttribLocation(program, "vTexCoord");

  for(var i=0;i<32;i++) {
    textures.push(gl.createTexture());
  }

  // Create a buffer object, initialize it, and associate it with the
  //  associated attribute variable in our vertex shader

  background(scene);
  scene.offset=[0.0,-0.01,0.0];
  sendData(scene);

  //variable 1
  bear(bear1);
  bear1.offset = [-0.35, 0.0, 0];
  sendData(bear1);

  //variable 2
  //bear(bear2);
  //bear2 = bear1.copy();
  readObj(bear2,comaru);
  bear2.offset = [0.35, 0.0, 0];
  //bear2.rMat=rotateY(180);
  sendData(bear2);

  christmasHat(hat1);
  hat1.offset = [-0.35, 0.72, 0];
  sendData(hat1);

  // christmasHat(hat2);
  // hat2.offset = [0.35, 0.72, 0];
  // sendData(hat2);

  sun(dotLight);
  dotLight.offset = [5.0, 4.0, 7.0];
  sendData(dotLight);


  camera.attach(bear1);

  addEvents();

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //view
  //theta+=dr;
  // if(thetaTest>-45)
  //     direction=-5;
  // if(thetaTest<-135)
  //     direction=5;
  // thetaTest+=direction;
  //camera and light
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelView"),
    false,
    flatten(camera.calModelViewMat())
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projection"),
    false,
    flatten(camera.calPerspectiveMat())
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(vec4(dotLight.offset, 1))
  );
  scene.render();

  //two bears
  bear1.rMat = rotates(bear1.rMat, bear1.theta);
  bear1.nextAction();
  bear1.render();

  bear2.rMat = rotates(bear2.rMat, bear2.theta);
  bear2.nextAction();
  bear2.render();

  
  hat1.offset=[bear1.offset[0],bear1.offset[1]+0.72,bear1.offset[2]];
  hat1.render();

  // prepareData(hat2);
  // drawObject(hat2);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //lightdot
  dotLight.render();
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //shadow
  bear1.drawShadow();
  bear2.drawShadow();
  hat1.drawShadow();

  window.requestAnimFrame(render);
}

function configureTexture(image, i, reverse) {
  if (i < 0 || i >= 32) return;
  texture = textures[i];
  gl.activeTexture(gl.TEXTURE0 + i);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, reverse);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.uniform1i(gl.getUniformLocation(program, "texture" + i), i);
}

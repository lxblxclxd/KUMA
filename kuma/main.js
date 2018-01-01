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
  this.theta = -Math.PI / 2;
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
    this.at = vec3(obj.offset);
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
  bear1.offset = [-0.35, 0.2, 0];
  sendData(bear1);

  //variable 2
  //bear(bear2);
  readObj(bear2,comaru);
  bear2.offset = [0.35, 0, 0];
  bear2.rMat=rotateY(180);
  sendData(bear2);

  christmasHat(hat1);
  hat1.offset = [-0.35, 0.72, 0];
  sendData(hat1);

  // christmasHat(hat2);
  // hat2.offset = [0.35, 0.72, 0];
  // sendData(hat2);

  sun(dotLight);
  dotLight.offset = [0.0, 1.0, 3.0];
  sendData(dotLight);


  camera.attach(bear1);

  addEvents();

  render();
};

function sendData(obj) {
  obj.vBuffer = gl.createBuffer(); //创建缓存区
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer); //绑定缓存区
  gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.points), gl.STATIC_DRAW); //向缓存区传输数据

  if (!obj.colorDirect) {
    obj.nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.normals), gl.STATIC_DRAW);

    obj.tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.texs), gl.STATIC_DRAW);
  }

  if (obj.indices) {
    obj.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.indices), gl.STATIC_DRAW);
    obj.indices=null;
  }
  obj.points = null;
  obj.normals = null;
  obj.texs = null;
  obj.imgOffset = images.length;
  for (var i = 0; images.length<=32 ; i++) {//设置贴图（不多于八张）
    image = document.getElementById(obj.name + i);
    if (!image) break;
    configureTexture(image, images.length, obj.imgReverse);
    images.push(image);
  }
}

function prepareData(obj) {
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer); //绑定对应缓存区
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0); //从该缓存区中取数
  gl.enableVertexAttribArray(vPosition); //开启取数

  if (!obj.colorDirect) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.nBuffer);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.tBuffer);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    gl.uniform4fv(
      gl.getUniformLocation(program, "colorDirect"),
      flatten(vec4(0, 0, 0, 0))
    );
  } else {
    gl.uniform4fv(
      gl.getUniformLocation(program, "colorDirect"),
      flatten(obj.colorDirect)
    );
    gl.disableVertexAttribArray(vNormal);
    gl.disableVertexAttribArray(vTexCoord);
  }

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "cmt_R"),
    false,
    flatten(obj.rMat)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "cmt_T"),
    false,
    flatten(translate(obj.offset))
  );
}

function drawObject(obj) {
  for (var i = 1; i < obj.tags.length; i++) {
    tag = obj.tags[i];
    gl.uniform1i(
      gl.getUniformLocation(program, "bTexCoord"),
      tag.material.image + obj.imgOffset
    );
    gl.uniform4fv(
      gl.getUniformLocation(program, "ambientProduct"),
      flatten(mult(dotLight.material.ambient, tag.material.ambient))
    );
    gl.uniform4fv(
      gl.getUniformLocation(program, "diffuseProduct"),
      flatten(mult(dotLight.material.diffuse, tag.material.diffuse))
    );
    gl.uniform4fv(
      gl.getUniformLocation(program, "specularProduct"),
      flatten(mult(dotLight.material.specular, tag.material.specular))
    );
    gl.uniform1f(
      gl.getUniformLocation(program, "shininess"),
      tag.material.shininess
    );
    // if(i==5||i==7)
    //     gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mult(translate(0.15,-0.08,0),mult(rotateX(thetaTest),translate(-0.15,0.08,0)) )));
    // else if(i==6||i==8)
    //     gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mult(translate(-0.15,-0.08,0),mult(rotateX(-thetaTest-180),translate(0.15,0.08,0)) )));
    // else
    //     gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mat4()));
    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "cmtPart"),
      false,
      flatten(tag.calCMT())
    );
    if (tag.type == 0) gl.drawElements(gl.TRIANGLES, tag.numOfPoints*3, gl.UNSIGNED_SHORT, tag.start*3*2 );//起始位置以字节为单位！
    else if (tag.type == 1) gl.drawArrays(gl.TRIANGLES, tag.start, tag.numOfPoints);
    else if (tag.type == 2) gl.drawArrays(gl.TRIANGLE_FAN, tag.start, tag.numOfPoints);
    else if (tag.type == 3) gl.drawArrays(gl.TRIANGLE_STRIP, tag.start, tag.numOfPoints);
  }
}

function drawShadow(obj) {
  gl.uniform4fv(
    gl.getUniformLocation(program, "colorDirect"),
    flatten(vec4(0, 0, 0, 1))
  );
  m = mat4();
  m[3][3] = 0;
  m[3][1] = -1 / dotLight.offset[1];
  mvMatrix = mult(camera.calModelViewMat(), translate(dotLight.offset));
  mvMatrix = mult(mvMatrix, m);
  mvMatrix = mult(mvMatrix, translate(negate(dotLight.offset)));
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelView"),
    false,
    flatten(mvMatrix)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "cmt_R"),
    false,
    flatten(obj.rMat)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "cmt_T"),
    false,
    flatten(translate(obj.offset))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer);
  gl.vertexAttribPointer(bear1.vPosition, 3, gl.FLOAT, false, 0, 0);
  drawObject(obj);
}

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
  prepareData(scene);
  drawObject(scene);

  //two bears
  bear1.rMat = rotates(bear1.rMat, bear1.theta);
  bear1.nextAction();
  prepareData(bear1);
  drawObject(bear1);

  bear2.rMat = rotates(bear2.rMat, bear2.theta);
  bear2.nextAction();
  prepareData(bear2);
  drawObject(bear2);

  prepareData(hat1);
  drawObject(hat1);

  // prepareData(hat2);
  // drawObject(hat2);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //lightdot
  prepareData(dotLight);
  drawObject(dotLight);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //shadow
  drawShadow(bear1);
  drawShadow(bear2);

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

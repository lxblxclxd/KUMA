function SceneObject() {
  this.points = [];
  this.colors = [];
  this.normals=[];//法向量normal vectors
  this.texs=[];
  this.tags = [new Component()];//(type,start,numOfPoints,colorRaw(vec4))
                                 //type 1 for Triangles,type 3 for Triangle_Strip;
  this.offset = [0, 0, 0];//position of current object
  this.theta = [0, 0, 0];//direction and speed the object rotates
  this.rMat = mat4();
  this.vBuffer = null;
  this.nBuffer=null;
  this.tBuffer=null;

  this.get=null;
  this.actionList=[];
  this.setAction=function(action){//设置执行一个动作
      setAction(this,action);
  }
  this.nextAction=function(){//得出执行动作后的下一步状态
      nextAction(this);
  }
  this.render = function(){
      prepareData(this);
      drawObject(this);
  }
  this.drawShadow = function(){
      drawShadow(this);
  }   
}

function bear(obj) {
    tags=obj.tags;
    texs=obj.texs;
    normals=obj.normals;
    points=obj.points;
    obj.name="bear";

    //计算points，normals和texs并设置颜色
    //左右区分按照熊自身的位置，如左手在我们默认视角的右侧
    var head      = sphere(points,normals,texs,tags,0,0.5,0,0.2,Material.undefine(0));//face
    var body      = ellipsoid(points,normals,texs,tags,0,0.2,0,0.27,0.2,0.2,Material.undefine(1));//body
    var leftHand  = ellipsoid(points,normals,texs,tags,0.27,0.2,0,0.05,0.08,0.05,Material.black());//left hand
    var rightHand = ellipsoid(points,normals,texs,tags,-0.27,0.2,0,0.05,0.08,0.05,Material.white());//right hand
    var leftLeg   = cylinderZ(points,normals,texs,tags,0.15,0.2-0.08,0.0,0.3,0.07,Material.black());//left leg
    var rightLeg  = cylinderZ(points,normals,texs,tags,-0.15,0.2-0.08,0.0,0.3,0.07,Material.white());//right leg
    var leftFoot  = ellipsoid(points,normals,texs,tags,0.15,0.2-0.08,0.3,0.07,0.09,0.07,Material.black());//left foot
    var rightFoot = ellipsoid(points,normals,texs,tags,-0.15,0.2-0.08,0.3,0.07,0.09,0.07,Material.white());//right foot
    var leftEar   = sphere(points,normals,texs,tags,0.27*Math.cos(Math.PI/3),0.48+0.27*Math.sin(Math.PI/3),0,0.08,Material.black());//left ear
    var rightEar  = sphere(points,normals,texs,tags,-0.27*Math.cos(Math.PI/3),0.48+0.27*Math.sin(Math.PI/3),0,0.08,Material.white());//right ear

    //设置名称映射关系
    obj.get={
      'head':head,
      'body':body,
      'leftHand':leftHand,
      'rightHand':rightHand,
      'leftLeg':leftLeg,
      'rightLeg':rightLeg,
      'leftFoot':leftFoot,
      'rightFoot':rightFoot,
      'leftEar':leftEar,
      'rightEar':rightEar,
  };

    //设置关节树
    body.attach(head,head.downPos);
    body.attach(leftHand,leftHand.leftPos);
    body.attach(rightHand,rightHand.rightPos);
    body.attach(leftLeg,leftLeg.backPos);
    body.attach(rightLeg,rightLeg.backPos);
    head.attach(leftEar,vec3(0.2*Math.cos(Math.PI/3),0.28+0.2*Math.sin(Math.PI/3),0));
    head.attach(rightEar,vec3(-0.2*Math.cos(Math.PI/3),0.28+0.2*Math.sin(Math.PI/3),0));
    leftLeg.attach(leftFoot,leftFoot.backPos);
    rightLeg.attach(rightFoot,rightFoot.backPos);

    //leftLeg.theta=[-135,0,0];
    obj.imgReverse=true;
    obj.centerPos=body.centerPos;
}

function sun(obj) {
  tags=obj.tags;
  texs=obj.texs;
  normals=obj.normals;
  points=obj.points;
  obj.material=Material.createNew(vec4(0.2,0.2,0.2,1.0),vec4(1.0,1.0,1.0,1.0),vec4(1.0,1.0,1.0,1.0));
  sphere(points,normals,texs, tags,0,0,0,0.2,obj.material);//球体
  obj.colorDirect=Color.red;
}

function christmasHat(obj) {
    tags=obj.tags;
    texs=obj.texs;
    normals=obj.normals;
    points=obj.points;
    var bottom=wheelXZ(points,normals,texs,tags,0,0,0,0.2,0.05,Material.white());//帽檐
    var body=coneY(points,normals,texs,tags,0,0,0.05,0.4,0.2,Material.red());//帽身
    var ball=sphere(points,normals,texs,tags,0,0.4,0,0.05,Material.white());//小球
}

function readObj(obj,objRaw) {//从导出的原始对象的js文件读取为SceneObject对象
    tags=obj.tags;
    texs=obj.texs;
    normals=obj.normals;
    points=obj.points;
    texsRaw=objRaw.texs;
    normalsRaw=objRaw.normals;
    pointsRaw=objRaw.points;
    indicesRaw=objRaw.indices;
    tagsRaw=objRaw.tags;
    obj.name=objRaw.name;

    for(j = 0,len=pointsRaw.length/3; j < len; j++) {
        p=pointsRaw.splice(0,3);
        p[2]=-p[2];
        points.push(p);
    }

    for(j = 0,len=texsRaw.length/2; j < len; j++) {
        texs.push(texsRaw.splice(0,2));
    }

    for(j = 0,len=normalsRaw.length/3; j < len; j++) {
        p=normalsRaw.splice(0,3);
        p[2]=-p[2];
        normals.push(p);
    }
    obj.get = {};
    im=[1,0,1,1,1,1,1,4,1,0,0,3,0,0,0,0,0,0,7,0,0,0,0,0,0,4,3,3,3,2];
    obj.indices=indicesRaw;
    for(j = 0;j < tagsRaw.length-1;j++){
        i=im[j];
        len=tagsRaw[j+1]-tagsRaw[j];
        addTag(tags,Material.undefine(i),0,len,[0]);
    }
    //addTag(tags,Material.red(),0,indicesRaw.length/3,[0]);
    obj.imgReverse=false;
    obj.centerPos=vec3(0,1.5,0);
}

function background(obj){
    tags=obj.tags;
    texs=obj.texs;
    normals=obj.normals;
    points=obj.points;
    obj.name="background";
    var sky=medisphere(points,normals,texs,tags,0,0,0,10,10,10,Material.undefine(0));
    var ground=square(points,normals,texs,tags,0,0,0,40,Material.undefine(1));
    obj.get={
      'sky':sky,
      'ground':ground,
  };
    obj.imgReverse=true;
  }
  

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
    for (var i = 1; i < obj.tags.length; i++) {
        obj.tags[i].material.image += images.length;
    }
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
      obj.tags[i].render();
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
      false,flatten(obj.rMat)
    );
    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "cmt_T"),
      false,flatten(translate(obj.offset))
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer);
    gl.vertexAttribPointer(bear1.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(vNormal);
    gl.disableVertexAttribArray(vTexCoord);
    drawObject(obj);
  }

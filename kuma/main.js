//v4.1.0 kuma封装之前

var canvas;
var gl;
var program;

var axis = 1;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var precise = 10;//精度

var bear1 = new DrawData();
var bear2 = new DrawData();
var dotLight = new DrawData();

function DrawData() {
    this.points = [];
    this.colors = [];
    this.normals=[];//法向量normal vectors
    this.texs=[];
    this.tags = [[0, 0, 0,vec4()]];//(type,start,numOfPoints,colorRaw(vec4)) 
                                   //type 1 for Triangles,type 3 for Triangle_Strip;
    this.offset = [0, 0, 0];//position of current bear
    this.theta = [0, 0, 0];//direction and speed the bear rotates
    this.rMat = mat4();
    this.vBuffer = null;
    this.vPosition = null;
    this.nBuffer=null;
    this.vNormal=null;
    this.tBuffer=null;
    this.vTexCoord=null;
}

var thetaTest=-135;
var direction=5;
var jumpHeight=0;
var directionj=0.5;
//data for perspective
var near = 0.3;
var far = 30.0;
var radius = 2.0;
var theta = Math.PI / 2;
var phi = Math.PI / 2;
var dr = 5.0 * Math.PI / 180.0;
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var cmtLoc,normalMatrixLoc,modelView, projection;

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    aspect = canvas.width / canvas.height;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

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
    gl.useProgram( program );

    cmtLoc = gl.getUniformLocation(program, "cmt");
    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    normalMatrixLoc=gl.getUniformLocation(program,"normalMatrix");


    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    //variable 1
    bear(bear1);
    bear1.offset=[-0.35, 0.2, 0];
    sendData(bear1);

    //variable 2
    bear(bear2);
    bear2.offset=[0.35, 0.2, 0];
    sendData(bear2);

    sun(dotLight);
    dotLight.offset=[0.0, 1.0, 3.0];
    sendData(dotLight);

    image0 = document.getElementById("texImage3");
    configureTexture( image0,0 );

    image1 = document.getElementById("texImage5");
    configureTexture( image1,1 );
    
    addEvents(document);
    
    render();
};

function sendData(obj){
    obj.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.points), gl.STATIC_DRAW);

    obj.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(obj.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(obj.vPosition);

    obj.nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.normals), gl.STATIC_DRAW);

    obj.vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( obj.vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( obj.vNormal);

    obj.tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.texs), gl.STATIC_DRAW);

    obj.vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( obj.vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( obj.vTexCoord);
}

function prepareData(){

}

function drawTags(tags)
{
    for(var i=1;i<tags.length;i++){
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), i);
        gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),flatten(tags[i][3]));
        
        if(i==1)
            gl.activeTexture(gl.TEXTURE0);
        else
            gl.activeTexture(gl.TEXTURE1);
        if(i==5||i==7)
            gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mult(translate(0.15,-0.08,0),mult(rotateX(thetaTest),translate(-0.15,0.08,0)) )));
        else if(i==6||i==8)
            gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mult(translate(-0.15,-0.08,0),mult(rotateX(-thetaTest-180),translate(0.15,0.08,0)) )));
        else
            gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mat4()));
        if(tags[i][0]==1)
            gl.drawArrays( gl.TRIANGLES, tags[i][1], tags[i][2]);
        if(tags[i][0]==2)
            gl.drawArrays( gl.TRIANGLE_FAN, tags[i][1], tags[i][2]);
        if(tags[i][0]==3)
            gl.drawArrays( gl.TRIANGLE_STRIP, tags[i][1], tags[i][2]);
    }
}

function rotates(mat, theta){//原矩阵根据角度左乘旋转矩阵
    mat = mult(rotateX(theta[0]), mat);
    mat = mult(rotateY(theta[1]), mat);
    return mult(rotateZ(theta[2]), mat);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //view
    //theta+=dr;
    if(thetaTest>-45)
        direction=-5;
    if(thetaTest<-135)
        direction=5;
    thetaTest+=direction;
    eye = vec3(radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta));
    mvMatrix = lookAt(eye, at, up);
    pMatrix = perspective(fovy, aspect, near, far);
    
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    gl.uniform4fv( gl.getUniformLocation(program,"lightPosition"),flatten(vec4(dotLight.offset,0)));
    //two bears
    gl.uniform4fv( gl.getUniformLocation(program,"colorDirect"),flatten(vec4(0,0,0,0)) );
    bear1.rMat = rotates(bear1.rMat, bear1.theta);
    //gl.uniformMatrix4fv(cmtLoc, false, flatten(mult(translate(bear1.offset), bear1.rMat)));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_R"), false, flatten(bear1.rMat));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_T"), false, flatten(translate(bear1.offset)));
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bear1.vBuffer);
    gl.vertexAttribPointer(bear1.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bear1.nBuffer);
    gl.vertexAttribPointer(bear1.vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bear1.tBuffer);
    gl.vertexAttribPointer(bear1.vTexCoord, 2, gl.FLOAT, false, 0, 0);
    
    materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0 );
    materialDiffuse = vec4( 88/255,88/255,88/255,1.0);//red
    materialSpecular = vec4( 0.1, 0.2, 0.0, 1.0 );
    materialShininess = 20.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"),flatten(specularProduct));
    gl.uniform1f( gl.getUniformLocation(program,"shininess"),materialShininess );
    drawTags(bear1.tags);


    bear2.rMat = rotates(bear2.rMat, bear2.theta);
    //gl.uniformMatrix4fv(cmtLoc, false, flatten(mult(translate(bear2.offset), bear2.rMat)));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_R"), false, flatten(bear2.rMat));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_T"), false, flatten(translate(bear2.offset)));

    gl.bindBuffer(gl.ARRAY_BUFFER, bear2.vBuffer);
    gl.vertexAttribPointer(bear2.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bear2.nBuffer);
    gl.vertexAttribPointer(bear2.vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bear2.tBuffer);
    gl.vertexAttribPointer(bear2.vTexCoord, 2, gl.FLOAT, false, 0, 0);

    materialAmbient = vec4( 0.4, 0.4, 0.4, 1.0 );
    materialDiffuse = vec4( 128/255, 64/255, 0.0,1.0);//brown
    materialSpecular = vec4( 0.1, 0.2, 0.0, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"),flatten(specularProduct));
    gl.uniform1f( gl.getUniformLocation(program,"shininess"),materialShininess );
    drawTags(bear2.tags);

////////////////////////////////////////////////////////////////////////////////////////////////////////
    //lightdot
    gl.uniform4fv( gl.getUniformLocation(program,"colorDirect"),flatten(vec4(1,0,0,1)) );
    gl.uniformMatrix4fv(cmtLoc, false, flatten(mult(translate(dotLight.offset), dotLight.rMat)));  

    gl.bindBuffer(gl.ARRAY_BUFFER, dotLight.vBuffer);
    gl.vertexAttribPointer(dotLight.vPosition, 3, gl.FLOAT, false, 0, 0);

    drawTags(dotLight.tags);
///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //shadow
    // gl.uniform4fv( gl.getUniformLocation(program,"colorDirect"),flatten(vec4(0,0,0,1)) );

    // m = mat4();m[3][3] = 0;m[3][1] = -1 / dotLight.offset[1];
    // mvMatrix = mult(mvMatrix, translate(dotLight.offset));
    // mvMatrix = mult(mvMatrix, m);
    // mvMatrix = mult(mvMatrix, translate(negate(dotLight.offset)));

    // gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
    // gl.uniformMatrix4fv( projection, false, flatten(pMatrix));

    // gl.uniformMatrix4fv(cmtLoc,false,flatten(mult(translate(bear1.offset),bear1.rMat)));
    // gl.bindBuffer( gl.ARRAY_BUFFER, bear1.vBuffer );
    // gl.vertexAttribPointer( bear1.vPosition, 3, gl.FLOAT, false, 0, 0 );
    // drawTags(bear1.tags);

    // gl.uniformMatrix4fv(cmtLoc,false,flatten(mult(translate(bear2.offset),bear2.rMat)));
    // gl.bindBuffer( gl.ARRAY_BUFFER, bear2.vBuffer );
    // gl.vertexAttribPointer( bear2.vPosition, 3, gl.FLOAT, false, 0, 0 );
    // drawTags(bear2.tags);



    window.requestAnimFrame(render);

}

function configureTexture( image ,i ) {
    if(i<0||i>=8)
        return;
    texture = gl.createTexture();
    if(i==0)
        gl.activeTexture(gl.TEXTURE0);
    if(i==1)
        gl.activeTexture(gl.TEXTURE1);
    if(i==2)
        gl.activeTexture(gl.TEXTURE2);
    if(i==3)
        gl.activeTexture(gl.TEXTURE3);
    if(i==4)
        gl.activeTexture(gl.TEXTURE4);
    if(i==5)
        gl.activeTexture(gl.TEXTURE5);
    if(i==6)
        gl.activeTexture(gl.TEXTURE6);
    if(i==7)
        gl.activeTexture(gl.TEXTURE7);

    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
            gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"+i), i);
    
}

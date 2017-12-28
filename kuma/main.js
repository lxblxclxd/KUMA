//v4.1.0 kuma封装之前

var canvas;
var gl;
var program;

var axis = 1;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var vPosition, vNormal, vTexCoord;//对应html文件中的变量

var precise = 5;//精度

var bear1 = new SceneObject();
var bear2 = new SceneObject();
var dotLight = new SceneObject();
var camera_default= new Camera();

var hat1 = new SceneObject(); 
var hat2 = new SceneObject(); 

var camera=camera_default;
var character=bear1;
// var thetaTest=-135;
// var direction=5;
// var jumpHeight=0;
// var directionj=0.5;

var dr = 5.0 * Math.PI / 180.0;
function Camera() {
    this.near = 0.3;
    this.far = 30.0;
    this.fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
    this.aspect;       // Viewport aspect ratio

    this.radius = 2.0;
    this.theta = -Math.PI / 2;
    this.phi = Math.PI / 2;
    this.eye;
    this.at = vec3(0.0, 0.0, 0.0);
    this.up = vec3(0.0, 1.0, 0.0);

    this.calModelViewMat = function(){
        this.eye = add(vec3(this.radius * Math.sin(this.phi) * Math.cos(this.theta),
        this.radius * Math.cos(this.phi),
        this.radius * Math.sin(this.phi) * Math.sin(this.theta)),this.at);
        return lookAt(this.eye, this.at, this.up);
    }
    this.calPerspectiveMat = function(){
       return perspective(this.fovy, this.aspect, this.near, this.far);
    }
    this.attach = function(obj){
        this.at=vec3(obj.offset);
    }
}

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    camera.aspect = canvas.width / canvas.height;

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
    
    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation( program, "vNormal" );
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );


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

    christmasHat(hat1);
    hat1.offset=[-0.35, 0.7, 0];
    sendData(hat1);

    christmasHat(hat2);
    hat2.offset=[0.35, 0.7, 0];
    sendData(hat2);

    sun(dotLight);
    dotLight.offset=[0.0, 1.0, 3.0];
    sendData(dotLight);

    camera.attach(bear1);
    image0 = document.getElementById("texImage3");
    configureTexture( image0,0 );
    image1 = document.getElementById("texImage5");
    configureTexture( image1,1 );

    addEvents();
    
    render();
};

function sendData(obj){
    obj.vBuffer = gl.createBuffer();//创建缓存区
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer);//绑定缓存区
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.points), gl.STATIC_DRAW);//向缓存区传输数据

    if(!obj.colorDirect){    
        obj.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.normals), gl.STATIC_DRAW);

        obj.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.texs), gl.STATIC_DRAW);
    }
}

function prepareData(obj){
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer);//绑定对应缓存区
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);//从该缓存区中取数
    gl.enableVertexAttribArray(vPosition);//开启取数

    if(!obj.colorDirect){
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.nBuffer);
        gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray( vNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.tBuffer);
        gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray( vTexCoord);

        gl.uniform4fv( gl.getUniformLocation(program,"colorDirect"),flatten(vec4(0,0,0,0)) );
    }
    else{
        gl.uniform4fv( gl.getUniformLocation(program,"colorDirect"),flatten(obj.colorDirect));
        gl.disableVertexAttribArray( vNormal);
        gl.disableVertexAttribArray( vTexCoord);
    }

    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_R"), false, flatten(obj.rMat));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_T"), false, flatten(translate(obj.offset)));
}

function drawObject(obj)
{
    for(var i=1;i<obj.tags.length;i++){
        tag=obj.tags[i];
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), i);
        gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),flatten(tag.material.diffuse));
        // if(i==5||i==7)
        //     gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mult(translate(0.15,-0.08,0),mult(rotateX(thetaTest),translate(-0.15,0.08,0)) )));
        // else if(i==6||i==8)
        //     gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mult(translate(-0.15,-0.08,0),mult(rotateX(-thetaTest-180),translate(0.15,0.08,0)) )));
        // else
        //     gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(mat4()));
        gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmtPart"),false, flatten(tag.calCMT()));
        if(tag.type==1)
            gl.drawArrays( gl.TRIANGLES, tag.start, tag.numOfPoints);
        if(tag.type==2)
            gl.drawArrays( gl.TRIANGLE_FAN, tag.start, tag.numOfPoints);
        if(tag.type==3)
            gl.drawArrays( gl.TRIANGLE_STRIP, tag.start, tag.numOfPoints);
    }
}

function drawShadow(obj){
    gl.uniform4fv( gl.getUniformLocation(program,"colorDirect"),flatten(vec4(0,0,0,1)));
    m = mat4();m[3][3] = 0;m[3][1] = -1 / dotLight.offset[1];
    mvMatrix = mult(camera.calModelViewMat(), translate(dotLight.offset));
    mvMatrix = mult(mvMatrix, m);
    mvMatrix = mult(mvMatrix, translate(negate(dotLight.offset)));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelView"), false, flatten(mvMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_R"), false, flatten(obj.rMat));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"cmt_T"), false, flatten(translate(obj.offset)));
    gl.bindBuffer( gl.ARRAY_BUFFER, obj.vBuffer );
    gl.vertexAttribPointer( bear1.vPosition, 3, gl.FLOAT, false, 0, 0 );
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
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelView"), false, flatten(camera.calModelViewMat()));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projection"), false, flatten(camera.calPerspectiveMat()));
    gl.uniform4fv(gl.getUniformLocation(program,"lightPosition"),flatten(vec4(dotLight.offset,1)));

    //two bears
    bear1.rMat = rotates(bear1.rMat, bear1.theta);
    bear1.nextAction();
    prepareData(bear1);
    
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
    drawObject(bear1);

    bear2.rMat = rotates(bear2.rMat, bear2.theta);
    bear2.nextAction();
    prepareData(bear2);

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
    drawObject(bear2);

    prepareData(hat1);
    drawObject(hat1);

    prepareData(hat2);
    drawObject(hat2);
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

function configureTexture( image ,i ) {
    if(i<0||i>=8)
        return;
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0+i);
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

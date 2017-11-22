//v4.1.0 kuma封装之前

var canvas;
var gl;
var program;

var axis = 1;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;

var precise=10;//精度

//data for bear1
var points1 = [];
var colors1 = [];
var tags1=[[0,0,0]];//(type,start,numOfPoints) type 1 for Triangles,type 3 for Triangle_Strip;
var offset1=[-0.5,0.2,0];//position of current bear
var theta1=[0,0,0];//direction and speed the bear rotates
var rMat1=mat4();
var cBuffer,vColor,vBuffer,vPosition;

//data for bear2
var points2 = [];
var colors2 = [];
var tags2=[[0,0,0]];
var offset2=[0.5,0.2,0];
var theta2=[0,0,0];
var rMat2=mat4();
var cBuffer2,vColor2,vBuffer2,vPosition2;

//data for perspective
var near = 0.3;
var far = 8.0;
var radius = 4.0;
var theta  = Math.PI/2;
var phi    = Math.PI/2;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var modelView, projection;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
const light=vec3(1.0,1.0,1.0);
var m;

var cmtLoc=mat4();
var fColor=mat4();

black=[0.0, 0.0, 0.0];
gray=[88/255,88/255,88/255];
white=[1.0, 1.0, 1.0];
red=[1.0, 0.0, 0.0];
blue=[0.0, 0.0, 1.0];
brown=[128/255, 64/255, 0.0];
skin=[247/255, 204/255,179/255];
pink=[255/255, 128/255,255/255];

front=[0.0,0.0,0.05];
back=[0.0,0.0,-0.05];
upward=[0.0,0.05,0.0];
down=[0.0,-0.05,0.0];
left=[0.05,0.0,0.0];
right=[-0.05,0.0,0.0];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    aspect =  canvas.width/canvas.height;

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of oSur 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides
    monokuma(points1,colors1,tags1); 
    monokuma(points2,colors2,tags2); 
    cube(points1,colors1,tags1,0,0,0,3,pink);
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    // enable hidden-surface removal
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cmtLoc = gl.getUniformLocation(program, "cmt");
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection");
    fColor = gl.getUniformLocation(program, "color");
    m = mat4();
    m[3][3] = 0;
    m[3][1] = -1/light[1];
    //event listeners for buttons

    document.getElementById( "xRButton" ).onclick = function () {theta1[xAxis] = (theta1[xAxis]+5.0)%10;};
    document.getElementById( "yRButton" ).onclick = function () {theta1[yAxis] = (theta1[yAxis]+5.0)%10;};
    document.getElementById( "zRButton" ).onclick = function () {theta1[zAxis] = (theta1[zAxis]+5.0)%10;};
    document.getElementById( "xTButton" ).onclick = function () {offset1[xAxis]+=0.1;};
    document.getElementById( "yTButton" ).onclick = function () {offset1[yAxis]+=0.1;};
    document.getElementById( "xTnButton" ).onclick = function () {offset1[xAxis]-=0.1;};
    document.getElementById( "yTnButton" ).onclick = function () {offset1[yAxis]-=0.1;};
    document.getElementById( "rsButton" ).onclick = function () {offset1=[-0.5,0,0];theta1=[0,0,0];rMat1=mat4();};
/**********************************************************************/
    document.getElementById( "xRButton2" ).onclick = function () {theta2[xAxis] = (theta2[xAxis]+5.0)%10;};
    document.getElementById( "yRButton2" ).onclick = function () {theta2[yAxis] = (theta2[yAxis]+5.0)%10;};
    document.getElementById( "zRButton2" ).onclick = function () {theta2[zAxis] = (theta2[zAxis]+5.0)%10;};
    document.getElementById( "xTButton2" ).onclick = function () {offset2[xAxis]+=0.1;};
    document.getElementById( "yTButton2" ).onclick = function () {offset2[yAxis]+=0.1;};
    document.getElementById( "xTnButton2" ).onclick = function () {offset2[xAxis]-=0.1;};
    document.getElementById( "yTnButton2" ).onclick = function () {offset2[yAxis]-=0.1;};
    document.getElementById( "rsButton2" ).onclick = function () {offset2=[0.5,0,0];theta2=[0,0,0];rMat2=mat4();};

    // buttons for viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){if(phi<Math.PI) phi += dr;};
    document.getElementById("Button8").onclick = function(){if(phi>0) phi -= dr;};
    document.getElementById("rsButtonE").onclick = function(){near=0.3;far=5.0;radius=4.0;theta=0.0;phi=0.0;};
    //listener for keyboard
    
    document.onkeydown=function()
    {
        var keycode = event.keyCode;
        var realkey = String.fromCharCode(event.keyCode);

        phiold=phi;

        //camera
        if(keycode==33) radius+=1.0;//pageup
        if(keycode==34) if(radius>1.0) radius-=1.0;//pagedown
        if(keycode==37) theta += dr;//leftArrow       
        if(keycode==38) {(phi -= dr)%Math.PI;if(phi<-Math.PI) phi+=2*Math.PI}//upArrow
        if(keycode==39) {theta -= dr;theta%=(Math.PI*2);}//rightArrow
        if(keycode==40) {(phi += dr)%Math.PI;if(phi>Math.PI) phi-=2*Math.PI;}//downArrow
        if((phiold>0&&phi<-0)||(phiold<-0&&phi>0))
            up[yAxis]=-up[yAxis];

        //bear1
        if(keycode==87) offset1=move(upward,rMat1,offset1);//w
        if(keycode==65) offset1=move(left,rMat1,offset1);//a
        if(keycode==83) offset1=move(down,rMat1,offset1);//s
        if(keycode==68) offset1=move(right,rMat1,offset1);//d
        if(keycode==81) offset1=move(front,rMat1,offset1);//q
        if(keycode==69) offset1=move(back,rMat1,offset1);//e

        //bear2
        if(keycode==73) offset2=move(upward,rMat2,offset2);//i
        if(keycode==74) offset2=move(left,rMat2,offset2);//j
        if(keycode==75) offset2=move(down,rMat2,offset2);//k
        if(keycode==76) offset2=move(right,rMat2,offset2);//l
        if(keycode==85) offset2=move(front,rMat2,offset2);//u
        if(keycode==79) offset2=move(back,rMat2,offset2);//o     
    }

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    //variable 1
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors1), gl.STATIC_DRAW );
    
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );  

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points1), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //variable 2
    cBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );
    
    vColor2 = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor2, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor2 );

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points2), gl.STATIC_DRAW );

    vPosition2 = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition2, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition2 );

    render();
};

function rotates(mat,theta)//原矩阵根据角度左乘旋转矩阵
{
    mat=mult(rotateX(theta[0]),mat); 
    mat=mult(rotateY(theta[1]),mat); 
    return mult(rotateZ(theta[2]),mat);   
}

function move(dir,mat,offset)//算出移动后的偏移量
{
    offset[xAxis]+=(rMat1[xAxis][0]*dir[0]+rMat1[xAxis][1]*dir[1]+rMat1[xAxis][2]*dir[2]);
    offset[yAxis]+=(rMat1[yAxis][0]*dir[0]+rMat1[yAxis][1]*dir[1]+rMat1[yAxis][2]*dir[2]);
    offset[zAxis]+=(rMat1[zAxis][0]*dir[0]+rMat1[zAxis][1]*dir[1]+rMat1[zAxis][2]*dir[2]);
    return offset;   
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //theta+=dr;
    eye = vec3(radius*Math.sin(phi)*Math.cos(theta),
               radius*Math.cos(phi),
               radius*Math.sin(phi)*Math.sin(theta));
    mvMatrix = lookAt(eye, at , up);
    pMatrix = perspective(fovy, aspect, near, far);

    // model-view matrix for shadow then render

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix));

    rMat1=rotates(rMat1,theta1);
    gl.uniformMatrix4fv(cmtLoc,false,flatten(mult(translate(offset1),rMat1)));

    gl.uniformMatrix4fv(fColor,false, [1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1]);

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    drawTags(tags1);

    rMat2=rotates(rMat2,theta2);
    gl.uniformMatrix4fv(cmtLoc,false,flatten(mult(translate(offset2),rMat2)));

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.vertexAttribPointer( vColor2, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer2 );
    gl.vertexAttribPointer( vPosition2, 3, gl.FLOAT, false, 0, 0 );

    drawTags(tags2);
    
    // //shadow
    // mvMatrix = mult(mvMatrix, translate(light[0], light[1], light[2]));
    // mvMatrix = mult(mvMatrix, m);
    // mvMatrix = mult(mvMatrix, translate(-light[0], -light[1],
    // -light[2]));

    // gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
    // gl.uniformMatrix4fv( projection, false, flatten(pMatrix));

    // gl.uniformMatrix4fv(cmtLoc,false,flatten(mult(translate(offset1),rMat1)));

    // gl.uniformMatrix4fv(fColor,false, [0,0,0,0,
    //                         0,0,0,0,
    //                         0,0,0,0,
    //                         0,0,0,1]);
    
    // gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    // gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    // drawTags(tags1);

    // gl.uniformMatrix4fv(cmtLoc,false,flatten(mult(translate(offset2),rMat2)));

    // gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer2 );
    // gl.vertexAttribPointer( vPosition2, 3, gl.FLOAT, false, 0, 0 );

    // drawTags(tags2);

    window.requestAnimFrame(render);
    
} 

function cube(points,colors,tags,x,y,z,scal,colour)
{
    A=vec3( -1, -1,  1 );
    B=vec3( -1,  1,  1 );
    C=vec3(  1,  1,  1 );
    D=vec3(  1, -1,  1 );
    E=vec3( -1, -1, -1 );
    F=vec3( -1,  1, -1 );
    G=vec3(  1,  1, -1 );
    H=vec3(  1, -1, -1 );
    v=[A,B,C,
       A,C,D,
       A,D,H,
       A,H,E,
       A,B,F,
       A,F,E,
       G,H,E,
       G,E,F,
       G,C,B,
       G,B,F,
       G,C,D,
       G,D,H]
    for(i=0;i<v.length;i++)
    {
        points.push(add(scale(scal,v[i]),vec3(x,y,z)));     
        colors.push(colour);
    }
    addTag(tags,1,v.length);
}
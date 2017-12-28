front = [0.0, 0.0, 0.05];
back = [0.0, 0.0, -0.05];
upward = [0.0, 0.05, 0.0];
down = [0.0, -0.05, 0.0];
left = [0.05, 0.0, 0.0];
right = [-0.05, 0.0, 0.0];

function addEvents(){
    //event listeners for buttons
    document.getElementById("xRButton").onclick = function () { bear1.theta[xAxis] = (bear1.theta[xAxis] + 5.0) % 10; };
    document.getElementById("yRButton").onclick = function () { bear1.theta[yAxis] = (bear1.theta[yAxis] + 5.0) % 10; };
    document.getElementById("zRButton").onclick = function () { bear1.theta[zAxis] = (bear1.theta[zAxis] + 5.0) % 10; };
    document.getElementById("xTButton").onclick = function () { bear1.offset[xAxis] += 0.1; };
    document.getElementById("yTButton").onclick = function () { bear1.offset[yAxis] += 0.1; };
    document.getElementById("xTnButton").onclick = function () { bear1.offset[xAxis] -= 0.1; };
    document.getElementById("yTnButton").onclick = function () { bear1.offset[yAxis] -= 0.1; };
    document.getElementById("rsButton").onclick = function () { bear1.offset = [-0.5, 0, 0]; bear1.theta = [0, 0, 0]; bear1.rMat = mat4(); };
    /**********************************************************************/
    document.getElementById("xRButton2").onclick = function () { bear2.theta[xAxis] = (bear2.theta[xAxis] + 5.0) % 10; };
    document.getElementById("yRButton2").onclick = function () { bear2.theta[yAxis] = (bear2.theta[yAxis] + 5.0) % 10; };
    document.getElementById("zRButton2").onclick = function () { bear2.theta[zAxis] = (bear2.theta[zAxis] + 5.0) % 10; };
    document.getElementById("xTButton2").onclick = function () { bear2.offset[xAxis] += 0.1; };
    document.getElementById("yTButton2").onclick = function () { bear2.offset[yAxis] += 0.1; };
    document.getElementById("xTnButton2").onclick = function () { bear2.offset[xAxis] -= 0.1; };
    document.getElementById("yTnButton2").onclick = function () { bear2.offset[yAxis] -= 0.1; };
    document.getElementById("rsButton2").onclick = function () { bear2.offset = [0.5, 0, 0]; bear2.theta = [0, 0, 0]; bear2.rMat = mat4(); };

    //lightbuttons
    document.getElementById("LightButtonx1").onclick = function () { dotLight.offset[0] += 1.0; showPosition();};
    document.getElementById("LightButtonx2").onclick = function () { dotLight.offset[0] -= 1.0;  showPosition();};
    document.getElementById("LightButtony1").onclick = function () { dotLight.offset[1] += 1.0;  showPosition();};
    document.getElementById("LightButtony2").onclick = function () { dotLight.offset[1] -= 1.0;  showPosition();};
    document.getElementById("LightButtonz1").onclick = function () { dotLight.offset[2] += 1.0;  showPosition();};
    document.getElementById("LightButtonz2").onclick = function () { dotLight.offset[2] -= 1.0;  showPosition();};
    document.getElementById("LightReset").onclick = function () { dotLight.offset=[0,1,3];  showPosition();};
 
    showPosition();
    
    function showPosition() {
        document.getElementById("light-position").innerHTML = dotLight.offset[0]+", "+dotLight.offset[1]+", "+dotLight.offset[2];     
    }
    
    //listener for keyboard

    document.onkeydown = function () {
        var keycode = event.keyCode;
        var realkey = String.fromCharCode(event.keyCode);

        if (keycode == 87){
            character.setAction('StandUp');
            move(character, front);//w
        } 
        if (keycode == 65) move(character, left);//a
        if (keycode == 83) move(character, back);//s
        if (keycode == 68) move(character, right);//d

        if(realkey=='1'){
            character=bear1; 
        } 
        if(realkey=='2'){
            character=bear2;
        }

        if (keycode == 32) character.setAction('JumpUp');//space
        
        camera.attach(character);
    }

    //鼠标监听控制视角(Camera)
    mouseX = event.clientX;  
    mouseY = event.clientY;  
    document.onmousemove = function(){
        var ctrlKey = event.ctrlKey || event.metaKey;
        mouseXLast=mouseX;
        mouseYLast=mouseY;
        mouseX = event.clientX;  
        mouseY = event.clientY;
        // if(ctrlKey&&mouseX<mouseXLast) theta -=dr;
        // if(ctrlKey&&) theta += dr;
        if(ctrlKey)
        camera.theta+=(mouseX-mouseXLast)/200;
        if (ctrlKey&&mouseY<mouseYLast) { if(camera.phi<Math.PI/2) camera.phi+=dr;}
        if (ctrlKey&&mouseY>mouseYLast) {if(camera.phi>0.5) camera.phi -= dr; }
        camera.theta %= (Math.PI * 2);
    }

    document.onmousewheel = function(){
        direction=event.wheelDelta>0?-1.0:1.0;
        camera.radius+=direction;
        if(camera.radius<=0.0)
            camera.radius+=1.0;
    }
}

function move(obj,dir){//算出移动后的偏移量
    mat=obj.rMat;
    offset=obj.offset;
    offset[xAxis] += (mat[xAxis][0] * dir[0] + mat[xAxis][1] * dir[1] + mat[xAxis][2] * dir[2]);
    offset[yAxis] += (mat[yAxis][0] * dir[0] + mat[yAxis][1] * dir[1] + mat[yAxis][2] * dir[2]);
    offset[zAxis] += (mat[zAxis][0] * dir[0] + mat[zAxis][1] * dir[1] + mat[zAxis][2] * dir[2]);
    return offset;
}

function rotates(mat, theta,center){//原矩阵根据角度和旋转中心左乘旋转矩阵
    if (arguments.length == 3)
        mat=  mult(translate(negate(center)), mat);
    if(theta[xAxis]!=0)
        mat = mult(rotateX(theta[xAxis]), mat);
    if(theta[yAxis]!=0)
        mat = mult(rotateY(theta[yAxis]), mat);
    if(theta[zAxis]!=0)
        mat = mult(rotateZ(theta[zAxis]), mat);
    if (arguments.length == 3)
        mat=  mult(translate(center), mat);
    return mat;
}

front = [0.0, 0.0, 0.05];
back = [0.0, 0.0, -0.05];
upward = [0.0, 0.05, 0.0];
down = [0.0, -0.05, 0.0];
left = [0.05, 0.0, 0.0];
right = [-0.05, 0.0, 0.0];

function addEvents(document){
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

        phiold = phi;

        //camera
        if (keycode == 33) radius += 1.0;//pageup
        if (keycode == 34) if (radius > 1.0) radius -= 1.0;//pagedown
        if (keycode == 37) theta += dr;//leftArrow
        if (keycode == 38) { (phi -= dr) % Math.PI; if (phi < -Math.PI) phi += 2 * Math.PI }//upArrow
        if (keycode == 39) { theta -= dr; theta %= (Math.PI * 2); }//rightArrow
        if (keycode == 40) { (phi += dr) % Math.PI; if (phi > Math.PI) phi -= 2 * Math.PI; }//downArrow
        if ((phiold > 0 && phi < -0) || (phiold < -0 && phi > 0))
            up[yAxis] = -up[yAxis];

        //bear1
        if (keycode == 87) move(bear1, upward);//w
        if (keycode == 65) move(bear1, left);//a
        if (keycode == 83) move(bear1, down);//s
        if (keycode == 68) move(bear1, right);//d
        if (keycode == 81) move(bear1, front);//q
        if (keycode == 69) move(bear1, back);//e

        //bear2
        if (keycode == 73) move(bear2, upward);//i
        if (keycode == 74) move(bear2, left);//j
        if (keycode == 75) move(bear2, down);//k
        if (keycode == 76) move(bear2, right);//l
        if (keycode == 85) move(bear2, front);//u
        if (keycode == 79) move(bear2, back);//o

        if (keycode == 32) bear2.setAction('StandUp');//space
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

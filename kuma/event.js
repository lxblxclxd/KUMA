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
        if (keycode == 87) bear1.offset = move(upward, bear1.rMat, bear1.offset);//w
        if (keycode == 65) bear1.offset = move(left, bear1.rMat, bear1.offset);//a
        if (keycode == 83) bear1.offset = move(down, bear1.rMat, bear1.offset);//s
        if (keycode == 68) bear1.offset = move(right, bear1.rMat, bear1.offset);//d
        if (keycode == 81) bear1.offset = move(front, bear1.rMat, bear1.offset);//q
        if (keycode == 69) bear1.offset = move(back, bear1.rMat, bear1.offset);//e

        //bear2
        if (keycode == 73) bear2.offset = move(upward, bear2.rMat, bear2.offset);//i
        if (keycode == 74) bear2.offset = move(left, bear2.rMat, bear2.offset);//j
        if (keycode == 75) bear2.offset = move(down, bear2.rMat, bear2.offset);//k
        if (keycode == 76) bear2.offset = move(right, bear2.rMat, bear2.offset);//l
        if (keycode == 85) bear2.offset = move(front, bear2.rMat, bear2.offset);//u
        if (keycode == 79) bear2.offset = move(back, bear2.rMat, bear2.offset);//o
    }
}

function move(dir, mat, offset){//算出移动后的偏移量
    offset[xAxis] += (bear1.rMat[xAxis][0] * dir[0] + bear1.rMat[xAxis][1] * dir[1] + bear1.rMat[xAxis][2] * dir[2]);
    offset[yAxis] += (bear1.rMat[yAxis][0] * dir[0] + bear1.rMat[yAxis][1] * dir[1] + bear1.rMat[yAxis][2] * dir[2]);
    offset[zAxis] += (bear1.rMat[zAxis][0] * dir[0] + bear1.rMat[zAxis][1] * dir[1] + bear1.rMat[zAxis][2] * dir[2]);
    return offset;
}

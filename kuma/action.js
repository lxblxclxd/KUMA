var fps=20;
var dmove=0.002;
var dtheta=5.0;//5度

function setAction(obj,action){
    act={
        'JumpUp':JumpUp,
        'StandUp':StandUp
    };
    act[action](obj);
}

function nextAction(obj){
    if(obj.actionList.length!=0){
        action=obj.actionList.pop();
        action=[action[0],arg=action[1]][0];
        action(obj,arg);
    }
}

function JumpUp(obj){
    for(i=fps-1;i>=0;i--){
        obj.actionList.push([function(obj,i){
            obj.offset[1]-=i*dmove;
        },i]);
    }
    for(i=0;i<fps;i++){
        obj.actionList.push([function(obj,i){
            obj.offset[1]+=i*dmove;
        },i]);
    }    
}

function StandUp(obj){
    for(i=18-1;i>=0;i--){
        obj.actionList.push([function(obj,i){
            leftLeg=obj.get['leftLeg'];
            rightLeg=obj.get['rightLeg'];
            leftFoot=obj.get['leftFoot'];
            legLength=leftLeg.lengthz()+leftFoot.lengthz();
            leftLeg.theta[0]-=dtheta;
            rightLeg.theta[0]-=dtheta;
            b=transpose(leftFoot.calCMT())[2];
            a=dot(b,vec4(leftFoot.centerPos,0))
            if(a<=0){//触碰地面
                obj.offset[1]-=legLength*Math.sin(radians(dtheta*i));
                obj.offset[2]-=legLength*(1-Math.cos(radians(dtheta*i)));
                obj.offset[1]+=legLength*Math.sin(radians(dtheta*(i+1)));
                obj.offset[2]+=legLength*(1-Math.cos(radians(dtheta*(i+1))));
            }
        },i]);
    }
}
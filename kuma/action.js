function Action(target,operation,source){
    this.target=target;
    this.operation=operation;
    this.source=source;
}

function setAction(obj,action){
    act={
        'JumpUp':JumpUp
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
    for(i=50-1;i>=0;i--){
        obj.actionList.push([function(obj,i){
            obj.offset[1]-=i*0.001;
        },i]);
    }
    for(i=0;i<50;i++){
        obj.actionList.push([function(obj,i){
            obj.offset[1]+=i*0.001;
        },i]);
    }    
}
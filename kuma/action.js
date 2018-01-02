var fps = 20;
var dmove = 0.002;
var dtheta = 5.0; //5度

function setAction(obj, action) {
  act = {
    'JumpUp': JumpUp,
    'StandUp': StandUp,
    'SitDown' : SitDown
  };
  act[action](obj);
}

function nextAction(obj) {
  if (obj.actionList.length != 0) {
    action = obj.actionList.pop();
    action = [action[0], (arg = action[1])][0];
    action(obj, arg);
    camera.attach(character);
  }
}

function JumpUp(obj) {
  for (i = fps - 1; i >= 0; i--) {
    obj.actionList.push([
      function(obj, i) {
        obj.offset[1] -= i * dmove;
      },
      i
    ]);
  }
  for (i = 0; i < fps; i++) {
    obj.actionList.push([
      function(obj, i) {
        obj.offset[1] += i * dmove;
      },
      i
    ]);
  }
}

function StandUp(obj) {
  if (!(obj.get["leftLeg"] || obj.get["rightLeg"])) return;
  if (obj.actionList.length != 0) return;
  for (i = 90 - 1; i >= -(obj.get["leftLeg"].theta[0]); i--) {
    obj.actionList.push([
      function(obj, i) {
        leftLeg = obj.get["leftLeg"];
        rightLeg = obj.get["rightLeg"];
        leftFoot = obj.get["leftFoot"];
        legLength = leftLeg.lengthz() + leftFoot.lengthz() / 2;
        leftLeg.theta[0] -= 1;
        rightLeg.theta[0] -= 1;

        if (legLength * Math.sin(radians(i)) >= 0.12) {
          //触碰地面
          obj.offset[1] -= legLength * Math.sin(radians(i));
          obj.offset[2] -= legLength * (1 - Math.cos(radians(i)));
          obj.offset[1] += legLength * Math.sin(radians(i + 1));
          obj.offset[2] += legLength * (1 - Math.cos(radians(i + 1)));
        }
      },
      i
    ]);
  }
}

function SitDown(obj) {
  if (!(obj.get["leftLeg"] || obj.get["rightLeg"])) return;
  if (obj.actionList.length != 0) return;
  for (i = 0; i <= -obj.get["leftLeg"].theta[0]; i++) {
    obj.actionList.push([
      function(obj, i) {
        leftLeg = obj.get["leftLeg"];
        rightLeg = obj.get["rightLeg"];
        leftFoot = obj.get["leftFoot"];
        legLength = leftLeg.lengthz() + leftFoot.lengthz() / 2;
        leftLeg.theta[0] += 1;
        rightLeg.theta[0] += 1;

        if (legLength * Math.sin(radians(i)) >= 0.12) {
          //触碰地面
          obj.offset[1] += legLength * Math.sin(radians(i));
          obj.offset[2] += legLength * (1 - Math.cos(radians(i)));
          obj.offset[1] -= legLength * Math.sin(radians(i + 1));
          obj.offset[2] -= legLength * (1 - Math.cos(radians(i + 1)));
        }
      },
      i
    ]);
  }
}

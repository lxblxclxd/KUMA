black = [0.0, 0.0, 0.0,1.0];
gray = [88 / 255, 88 / 255, 88 / 255,1.0];
white = [1.0, 1.0, 1.0,1.0];
red = [1.0, 0.0, 0.0,1.0];
blue = [0.0, 0.0, 1.0,1.0];
brown = [128 / 255, 64 / 255, 0.0,1.0];
skin = [247 / 255, 204 / 255, 179 / 255,1.0];
pink = [255 / 255, 128 / 255, 255 / 255,1.0];
color_undefined=[0.0,0.0,0.0,0.0];


function Component(type,start,numOfPoints,colorRaw) {
  if (arguments.length == 0) {
    type=0;
    start=0;
    numOfPoints=0;
    colorRaw=vec4();
  } 
  
  this.type=type;
  this.start=start;
  this.numOfPoints=numOfPoints;
  this.colorRaw=colorRaw;//直接显示的颜色

  this.theta=[0,0,0];//离初始位置的偏转角度在三个方向的分量
  this.rootPos=vec3();//物体旋转所绕的点
  //this.tailPos=vec3();

  this.upPos    =vec3();
  this.downPos  =vec3();
  this.leftPos  =vec3();
  this.rightPos =vec3();
  this.frontPos =vec3();
  this.backPos  =vec3();
  this.centerPos=vec3();

  this.father=null;//父节点
  this.sons=[];//子节点
  this.attach=function(son,pos){
    son.father=this;
    son.rootPos=pos;
    this.sons.push(son);
  }
  this.calRMat=function(){
    if(this.father==null)
      return rotates(mat4(),this.theta);
    else
      return rotates(father.calRMat(),this.theta);
  }
  this.calCMT=function(){
    if(this.father==null)
      return rotates(mat4(),this.theta,this.rootPos);
    else
      return rotates(this.father.calCMT(),this.theta,this.rootPos);
  }
  this.lengthz=function(){
    return this.frontPos[2]-this.backPos[2];
  }
}

function sphere(points,normals,texs,tags,x,y,z,radis,color)
{
  return ellipsoid(points,normals,texs,tags,x,y,z,radis,radis,radis,color);
}

function cylinderX(points,normals,texs,tags,x,y,z,radis,height,color)//柱面，中心轴平行于x轴
{
}

function cylinderY(points,normals,texs,tags,x,y,z,radis,height,color)//柱面，中心轴平行于y轴
{
}

function cylinderZ(points,normals,texs,tags,x,y,zback,zfront,radis,color){//柱面，中心轴平行于z轴
  return circularZ(points,normals,texs,tags,x,y,zback,zfront,radis,radis,color);
}

function coneY(points,normals,texs,tags,x,z,ybottom,ytop,radis,color){//圆锥面，中心轴平行于y轴
  var tag=circularZ(points,normals,texs,tags,x,z,ybottom,ytop,radis,0,color);
  tag.theta=[90,0,0];
  return tag;
}

function coneZ(points,normals,texs,tags,x,y,zback,zfront,radis,color){//圆锥面，中心轴平行于z轴
  return circularZ(points,normals,texs,tags,x,y,zback,zfront,radis,0,color);
}

function circularZ(points,normals,texs,tags,x,y,zback,zfront,rback,rfront,color){//圆台面，中心轴平行于z轴
    if(zback>zfront){
      zback = [zfront,zfront=zback][0];//交换zback与zfront的值
      rback = [rfront,rfront=rback][0];
    }
    var theta;
    var theta1=Math.atan((rback-rfront)/2/(zfront-zback));
    nx=rx*Math.cos(theta1);
    ny=ry*Math.cos(theta1);
    nz=Math.sin(theta1);
    for(var i=0;i<=360;i++){
      theta=i/360*2*Math.PI;
      rx=Math.cos(theta);
      ry=Math.sin(theta);
      
      points.push(vec3(x+rback*rx,y+rback*ry,zback),vec3(x+rfront*rx,y+rfront*ry,zfront));
      normals.push(vec3(nx,ny,nz),vec3(nx,ny,nz));
      texy=i/360;    
      texs.push(vec2(0.0,texy),vec2(1.0,texy));
    }
    z=(zback+zfront)/2;
    radis=(rback+rfront)/2;
    stdPos=[
      vec3(x,y+radis,z),vec3(x,y-radis,z),
      vec3(x-radis,y,z),vec3(x+radis,y,z),
      vec3(x,y,zfront),vec3(x,y,zback),
      vec3(x,y,z)
     ];
    return addTag(tags,color,3,2*361,stdPos);
}

function wheelXZ(points,normals,texs,tags,x,y,z,r1,r2,color){
  for(var j=0;j<360;j+=precise){
    theta2=j/360*2*Math.PI;
    for(var i=0;i<=360;i+=precise){
      theta1=i/360*2*Math.PI;
      //对于点，法向量和贴图映射关系的计算
      px=x+(r1+r2*Math.cos(theta1))*Math.cos(theta2);
      py=y+r2*Math.sin(theta1);
      pz=z+(r1+r2*Math.cos(theta1))*Math.sin(theta2);
      pxd=x+(r1+r2*Math.cos(theta1))*Math.cos(theta2+precise/360*2*Math.PI);
      pyd=y+r2*Math.sin(theta1);
      pzd=z+(r1+r2*Math.cos(theta1))*Math.sin(theta2+precise/360*2*Math.PI);
      nx=Math.cos(theta1)*Math.cos(theta2);
      ny=Math.sin(theta1);
      nz=Math.cos(theta1)*Math.sin(theta2);
      nxd=Math.cos(theta1)*Math.cos(theta2+precise/360*2*Math.PI);
      nyd=Math.sin(theta1);
      nzd=Math.cos(theta1)*Math.sin(theta2+precise/360*2*Math.PI);
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));
      normals.push(vec3(nx,ny,nz),vec3(pxd,pyd,pzd));
      texs.push(vec2(j/360,i/360),vec2(j+1/360,i/360));
    }
   }
   stdPos=[
    vec3(x,y+r2,z),vec3(x,y-r2,z),
    vec3(x-r1-r2,y,z),vec3(x+r1+r2,y,z),
    vec3(x,y,z+r1+r2),vec3(x,y,z-r1-r2),
    vec3(x,y,z)
   ];
   return addTag(tags,color,3,2*360*(360+precise)/precise/precise,stdPos);
}


function ellipsoid(points,normals,texs,tags,x,y,z,a,b,c,color)//椭球
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise){
    theta2=j/360*2*Math.PI;
    for(var i=0;i<=360;i+=precise){
      theta1=i/360*2*Math.PI;
      //对于点，法向量和贴图映射关系的计算
      rx=Math.sin(theta2)*Math.cos(theta1);
      ry=Math.sin(theta2)*Math.sin(theta1);
      rz=Math.cos(theta2);
      rxd=Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      ryd=Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      rzd=Math.cos(theta2+precise/360*2*Math.PI);
      points.push(vec3(x+a*rx,y+b*ry,z+c*rz),vec3(x+a*rxd,y+b*ryd,z+c*rzd));
      normals.push(vec3(rx/a,ry/b,rz/c),vec3(rxd/a,ryd/b,rzd/c));

      var texx,texy,texxd,texyd;
      texy=0.5+ry/2;
      texyd=0.5+ryd/2;
      if(rz>=0)
        texx=rx/2+0.5;
      else
        texx=1.5-rx/2;
      if(rzd>=0)
        texxd=rxd/2+0.5;
      else
        texxd=1.5-rxd/2;
      if(j==91){//解决贴图边界的错误问题
        texx=texxd;
        texy=texyd;
      }
      if(j==90){
        texxd=texx;
        texyd=texy;
      }
      texs.push(vec2(texx/2,texy),vec2(texxd/2,texyd));
    }
   }
   stdPos=[
    vec3(x,y+b,z),vec3(x,y-b,z),
    vec3(x-a,y,z),vec3(x+a,y,z),
    vec3(x,y,z+c),vec3(x,y,z-c),
    vec3(x,y,z)
   ];
   return addTag(tags,color,3,180*(360+precise)*2/precise/precise,stdPos);
}

// function parabola(p1,p2,p3,n){//X(a,b,c)=y n个点的xy平面抛物线y=ax2+bx+c
//   X=mat3(p1[0]*p1[0],p1[0],1,
//           p2[0]*p2[0],p2[0],1,
//           p3[0]*p3[0],p3[0],1);
//   y=vec3(p1[1],p2[1],p3[1]);
//   Xn=inverse(X);
//   a=Xn[0][0]*y[0]+Xn[0][1]*y[1]+Xn[0][2]*y[2];
//   b=Xn[1][0]*y[0]+Xn[1][1]*y[1]+Xn[1][2]*y[2];
//   c=Xn[2][0]*y[0]+Xn[2][1]*y[1]+Xn[2][2]*y[2];
//   v=[p1];
//   for(i=1;i<n;i++)
//   {
//       x1=(p3[0]-p1[0])/n*i+p1[0];
//       y1=a*x1*x1+b*x1+c;
//       v.push(vec2(x1,y1));
//   }
//   return v;
// }


function addTag(tags,color,type,length,stdPos)//增加当前部件的标签
{
    tagLast=tags[tags.length-1];
    start=tagLast.start+tagLast.numOfPoints;
    tagThis=new Component(type,start,length,color);
    if(stdPos.length==7){  
      tagThis.upPos    =stdPos[0];
      tagThis.downPos  =stdPos[1];
      tagThis.leftPos  =stdPos[2];
      tagThis.rightPos =stdPos[3];
      tagThis.frontPos =stdPos[4];
      tagThis.backPos  =stdPos[5];
      tagThis.centerPos=stdPos[6];  
    }
    tags.push(tagThis);
    return tagThis;
}

// function cube(points,  texs,tags, x, y, z, scal, color) {
//     A = vec3(-1, -1, 1);
//     B = vec3(-1, 1, 1);
//     C = vec3(1, 1, 1);
//     D = vec3(1, -1, 1);
//     E = vec3(-1, -1, -1);
//     F = vec3(-1, 1, -1);
//     G = vec3(1, 1, -1);
//     H = vec3(1, -1, -1);
//     v = [A, B, C,
//         A, C, D,
//         A, D, H,
//         A, H, E,
//         A, B, F,
//         A, F, E,
//         G, H, E,
//         G, E, F,
//         G, C, B,
//         G, B, F,
//         G, C, D,
//         G, D, H]
//     for (i = 0; i < v.length; i++) {
//         points.push(add(scale(scal, v[i]), vec3(x, y, z)));
//     }
//     return addTag(tags,color, 1, v.length);
//   }

black = [0.0, 0.0, 0.0,1.0];
gray = [88 / 255, 88 / 255, 88 / 255,1.0];
white = [1.0, 1.0, 1.0,1.0];
red = [1.0, 0.0, 0.0,1.0];
blue = [0.0, 0.0, 1.0,1.0];
brown = [128 / 255, 64 / 255, 0.0,1.0];
skin = [247 / 255, 204 / 255, 179 / 255,1.0];
pink = [255 / 255, 128 / 255, 255 / 255,1.0];
color_undefined=[0.0,0.0,0.0,0.0];

front = [0.0, 0.0, 0.05];
back = [0.0, 0.0, -0.05];
upward = [0.0, 0.05, 0.0];
down = [0.0, -0.05, 0.0];
left = [0.05, 0.0, 0.0];
right = [-0.05, 0.0, 0.0];

function sphere(points,normals,texs,tags,x,y,z,radis,color)//从外到里的颜色渐变的球
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise)
  {
    theta2=j/360*2*Math.PI;
    for(var i=0;i<=360;i+=precise)
    {
      theta1=i/360*2*Math.PI;
      px=x+radis*Math.sin(theta2)*Math.cos(theta1);
      py=y+radis*Math.sin(theta2)*Math.sin(theta1);
      pz=z+radis*Math.cos(theta2);
      pxd=x+radis*Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      pyd=y+radis*Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      pzd=z+radis*Math.cos(theta2+precise/360*2*Math.PI);
      var normalx=(px-x)/radis;
      var normaly=(py-y)/radis;
      var normalz=(pz-z)/radis;
      var normalxd=(pxd-x)/radis;
      var normalyd=(pyd-y)/radis;
      var normalzd=(pzd-z)/radis;
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));
      normals.push(vec3(normalx,normaly,normalz),vec3(normalxd,normalyd,normalzd));

      var texx,texy,texxd,texyd;
      if(pz-z>=0){
        texx=(px-x)/(2*radis)+0.5;
        texy=0.5+(py-y)/(2*radis);
      }
      else{
        texx=1.5-(px-x)/(2*radis);
        texy=0.5+(py-y)/(2*radis);
        
      }
      if(pzd-z>=0){
        texxd=(pxd-x)/(2*radis)+0.5;
        texyd=0.5+(pyd-y)/(2*radis);
      }
      else{
        texxd=1.5-(pxd-x)/(2*radis);
        texyd=0.5+(pyd-y)/(2*radis);
        
      }
      if(j==91){
        texx=texxd;
        texy=texyd;
      }
      if(j==90){
        texxd=texx;
        texyd=texy;
      }
      texx/=2;
      texxd/=2;
      texs.push(vec2(texx,texy),vec2(texxd,texyd));
    }
   }
   addTag(tags,color,3,180*(360+precise)*2/precise/precise);
}

/*
function circleXY(points,texs,tags,x,y,z,radis,color)//平行于xy平面
{
  for(var i=0;i<360;i++){
    px=x+radis*Math.cos(i/360*6.28);
    py=y+radis*Math.sin(i/360*6.28);
    pz=z;
    points.push(vec3(px,py,pz));
  }
  addTag(tags,color,2,360);
}

function circleXZ(points,texs,tags,x,y,z,radis,color)//平行于xz平面
{
  for(var i=0;i<360;i++){
    px=x+radis*Math.cos(i/360*6.28);
    py=y;
    pz=z+radis*Math.sin(i/360*6.28);
    points.push(vec3(px,py,pz));
  }
  addTag(tags,color,2,360);
}
*/
function cylinderX(points,normals,texs,tags,x,y,z,radis,height,color)//柱面，中心轴平行于x轴
{
  var theta;
  for(var i=0;i<=360;i++){
    theta=i/360*2*Math.PI;
    py=y+radis*Math.cos(theta);
    pz=z+radis*Math.sin(theta);
    pxup=x+height/2;
    pxdown=x-height/2;
    normalx=0;
    normaly=(py-y)/radis;
    normalz=(pz-z)/radis;
    points.push(vec3(pxup,py,pz),vec3(pxdown,py,pz));
    normals.push(vec3(normalx,normaly,normalz),vec3(normalx,normaly,normalz));

    var texxup,texxdown,texy;
    if(pz>=0){
      texxup=(px-x)/height+0.5;
      texxdown=(px-x)/height+0.5;
      texy=0.5-(py-y)/height;
    }
    else{
      texxup=(px-x)/height+1.5;
      texxdown=(px-x)/height+1.5;
      texy=0.5-(py-y)/height;
    }
    texs.push(vec2(texxup,texy),vec2(texxdown,texy));
  }
  addTag(tags,color,3,2*361);
}

function cylinderY(points,normals,texs,tags,x,y,z,radis,height,color)//柱面，中心轴平行于y轴
{
  var theta;
  for(var i=0;i<=360;i++){
    theta=i/360*2*Math.PI;
    px=x+radis*Math.cos(theta);
    pz=z+radis*Math.sin(theta);
    pyup=y+height/2;
    pydown=y-height/2;
    normalx=(px-x)/radis;
    normaly=0;
    normalz=(pz-z)/radis;
    points.push(vec3(px,pyup,pz),vec3(px,pydown,pz));
    normals.push(vec3(normalx,normaly,normalz),vec3(normalx,normaly,normalz));

    var texxup,texxdown,texy;
    if(pz>=0){
      texx=(px-x)/height+0.5;
      texyup=0.5-(pyup-y)/height;
      texydown=0.5-(pydown-y)/height;
    }
    else{
      texx=(px-x)/height+1.5;
      texyup=0.5-(pyup-y)/height;
      texydown=0.5-(pydown-y)/height;
    }
    texs.push(vec2(texx,texyup),vec2(texx,texydown));

  }
  addTag(tags,color,3,2*361);
}

function cylinderZ(points,normals,texs,tags,x,y,z,radis,height,color)//柱面，中心轴平行于z轴
{
  var theta;
  for(var i=0;i<=360;i++){
    theta=i/360*2*Math.PI;
    px=x+radis*Math.cos(theta);
    py=y+radis*Math.sin(theta);
    pzup=z+height/2;
    pzdown=z-height/2;
    normalx=(px-x)/radis*5;
    normaly=(py-y)/radis*5;
    normalz=0;
    points.push(vec3(px,py,pzup),vec3(px,py,pzdown));
    normals.push(vec3(normalx,normaly,normalz),vec3(normalx,normaly,normalz));

    var texzup,texzdown,texy;
    if(px>=0){
      texzup=(pz-z)/height+0.5;
      texzdown=(pz-z)/height+0.5;
      texy=0.5-(py-y)/height;
    }
    else{
      texzup=(pz-z)/height+1.5;
      texzdown=(pz-z)/height+1.5;
      texy=0.5-(py-y)/height;
    }
    texs.push(vec2(texzup,texy),vec2(texzdown,texy));
  }
  addTag(tags,color,3,2*361);
}

// function podetiumY(points,texs,tags,x,y,z,radis,height,color1,color2,color3)//柱体，中心轴平行于y轴，1为上底面，3为下底面
// {
//   circleXZ(points,texs,tags,x,y+height/2,z,radis,color1);
//   cylinderY(points,texs,tags,x,y,z,radis,height,color2);
//   circleXZ(points,texs,tags,x,y-height/2,z,radis,color3);
// }

// function podetiumZ(points,texs,tags,x,y,z,radis,height,color1,color2,color3)//柱体，中心轴平行于z轴，1为上底面，3为下底面
// {
//   circleXY(points,texs,tags,x,y,z+height/2,radis,color1);
//   cylinderZ(points,texs,tags,x,y,z,radis,height,color2);
//   circleXY(points,texs,tags,x,y,z-height/2,radis,color3);
// }

function ellipsoid(points,normals,texs,tags,x,y,z,a,b,c,color)//椭球
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise){
    theta2=j/360*2*Math.PI;
    for(var i=0;i<=360;i+=precise){
      theta1=i/360*2*Math.PI;
      px=x+a*Math.sin(theta2)*Math.cos(theta1);
      py=y+b*Math.sin(theta2)*Math.sin(theta1);
      pz=z+c*Math.cos(theta2);
      pxd=x+a*Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      pyd=y+b*Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      pzd=z+c*Math.cos(theta2+precise/360*2*Math.PI);
      normalx=Math.sin(theta2)*Math.cos(theta1)/a;
      normaly=Math.sin(theta2)*Math.sin(theta1)/b;
      normalz=Math.cos(theta2)/c;
      normalxd=Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1)/a;
      normalyd=Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1)/b;
      normalzd=Math.cos(theta2+precise/360*2*Math.PI)/c;
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));
      normals.push(vec3(normalx,normaly,normalz),vec3(normalxd,normalyd,normalzd));

      var texx,texy,texxd,texyd;
      if(pz>=0){
        texx=(px-x)/(2*a)+0.5;
        texy=0.5+(py-y)/(2*a);
      }
      else{
        texx=1.5-(px-x)/(2*a);
        texy=0.5+(py-y)/(2*a);
      }
      if(pzd>=0){
        texxd=(pxd-x)/(2*a)+0.5;
        texyd=0.5+(pyd-y)/(2*a);
      }
      else{
        texxd=1.5-(pxd-x)/(2*a);
        texyd=0.5+(pyd-y)/(2*a);
      }
      if(j==91){
        texx=texxd;
        texy=texyd;
      }
      if(j==90){
        texxd=texx;
        texyd=texy;
      }
      texx/=2;
      texxd/=2;
      texs.push(vec2(texx,texy),vec2(texxd,texyd));
    }
   }
   addTag(tags,color,3,180*(360+precise)*2/precise/precise);
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


function addTag(tags,color,type,length)//(type,start,numOfPoints) type 1 for Triangles,type 3 for Triangle_Strip;
{
    tag=tags[tags.length-1];
    start=tag[1]+tag[2];
    tags.push([type,start,length,color]);
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
//     addTag(tags,color, 1, v.length);
//   }

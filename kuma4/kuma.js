//functions for drawing a bear

function bear(points,colors,tags,style)
{
    var body,eye,other;
    if(style==0)
    {     
      body=brown;
      eye=black;
      other=skin;
    }
    if(style==1)
    {     
      body=skin;
      eye=brown;
      other=brown;
    }
    if(style==2)
    {     
      body=gray;
      eye=black;
      other=skin;
    }
    ellipsoid(points,colors,tags,0,0,0,0.27,0.2,0.2,body,body);//body 
    ellipsoid(points,colors,tags,0.27,0,0,0.05,0.08,0.05,body,other);//right hand
    ellipsoid(points,colors,tags,-0.27,0,0,0.05,0.08,0.05,body,other);//left hand
    cylinderZ(points,colors,tags,0.15,-0.08,0.15,0.07,0.3,body,body,body);//right leg
    cylinderZ(points,colors,tags,-0.15,-0.08,0.15,0.07,0.3,body,body,body);//left leg
    ellipsoid(points,colors,tags,0.15,-0.08,0.3,0.07,0.09,0.07,body,other);//right foot
    ellipsoid(points,colors,tags,-0.15,-0.08,0.3,0.07,0.09,0.07,body,other);//left foot
    sphere(points,colors,tags,0.27*Math.cos(Math.PI/3),0.28+0.27*Math.sin(Math.PI/3),0,0.08,body,other);//right ear
    sphere(points,colors,tags,-0.27*Math.cos(Math.PI/3),0.28+0.27*Math.sin(Math.PI/3),0,0.08,body,other);//left ear
    //sphere(points,colors,tags,0.24*Math.cos(Math.PI/3),0.28+0.24*Math.sin(Math.PI/3),0,0.04,body);//right earin
    //sphere(points,colors,tags,-0.24*Math.cos(Math.PI/3),0.28+0.24*Math.sin(Math.PI/3),0,0.04,body);//left earin
    sphere(points,colors,tags,0,0.3,0,0.2,body,body);//face
    //chin
    sphere(points,colors,tags,0.1,0.33,Math.sqrt(0.021),0.03,eye,eye);//right eye
    sphere(points,colors,tags,-0.1,0.33,Math.sqrt(0.021),0.03,eye,eye);//left eye
    sphere(points,colors,tags,0,0.27,Math.sqrt(0.031),0.04,eye,eye);//nose
}

function monokuma(points,colors,tags)
{
    monoellipsoid(points,colors,tags,0,0,0,0.27,0.2,0.2);//monobody    
    ellipsoid(points,colors,tags,0.27,0,0,0.05,0.08,0.05,black,black);//right hand
    ellipsoid(points,colors,tags,-0.27,0,0,0.05,0.08,0.05,white,white);//left hand
    cylinderZ(points,colors,tags,0.15,-0.08,0.15,0.07,0.3,black,black,black);//right leg
    cylinderZ(points,colors,tags,-0.15,-0.08,0.15,0.07,0.3,white,white,white);//left leg
    ellipsoid(points,colors,tags,0.15,-0.08,0.3,0.07,0.09,0.07,black,black);//right foot
    ellipsoid(points,colors,tags,-0.15,-0.08,0.3,0.07,0.09,0.07,white,white);//left foot
    sphere(points,colors,tags,0.27*Math.cos(Math.PI/3),0.28+0.27*Math.sin(Math.PI/3),0,0.08,black,black);//mono right ear
    sphere(points,colors,tags,-0.27*Math.cos(Math.PI/3),0.28+0.27*Math.sin(Math.PI/3),0,0.08,white,white);//monoleft ear
    monosphere(points,colors,tags,0,0.3,0,0.2);//monoface
    //chin
    //sphere(points,colors,tags,0.1,0.33,Math.sqrt(0.021),0.03,eye,eye);//right eye
    monoeye(points,colors,tags,0,0.3,0,0.2,0.1,0.03,0.02);//monoeye
    sphere(points,colors,tags,-0.1,0.33,Math.sqrt(0.021),0.03,black,black);//left eye
    sphere(points,colors,tags,0,0.27,Math.sqrt(0.031),0.04,white,white);//nose
}

function bear1(points,colors,tags)
{
    ellipsoid(points,colors,tags,0,0,0,0.27,0.2,0.2,body,body);//body
    ellipsoid(points,colors,tags,0.27,0,0,0.05,0.05,0.08,body,other);//right hand
    ellipsoid(points,colors,tags,-0.27,0,0,0.05,0.05,0.08,body,other);//left hand
    cylinderY(points,colors,tags,0.15,0.15,-0.08,0.07,0.3,body,body,body);//right leg
    cylinderY(points,colors,tags,-0.15,0.15,-0.08,0.07,0.3,body,body,body);//left leg
    ellipsoid(points,colors,tags,0.15,0.3,-0.08,0.07,0.07,0.09,body,other);//right foot
    ellipsoid(points,colors,tags,-0.15,0.3,-0.08,0.07,0.07,0.09,body,other);//left foot
    sphere(points,colors,tags,0.27*Math.cos(Math.PI/3),0,0.28+0.27*Math.sin(Math.PI/3),0.08,body,other);//right ear
    sphere(points,colors,tags,-0.27*Math.cos(Math.PI/3),0,0.28+0.27*Math.sin(Math.PI/3),0.08,body,other);//left ear
    sphere(points,colors,tags,0,0,0.3,0.2,body,body);//face
    //chin
    sphere(points,colors,tags,0.1,Math.sqrt(0.021),0.33,0.03,eye,eye);//right eye
    sphere(points,colors,tags,-0.1,Math.sqrt(0.021),0.33,0.03,eye,eye);//left eye
    sphere(points,colors,tags,0,Math.sqrt(0.031),0.27,0.04,eye,eye);//nose
}

function sphere(points,colors,tags,x,y,z,radis,colorOut,colorIn)//从外到里的颜色渐变的球
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise)
  {
    theta2=j/360*2*Math.PI;
    color=calColor(colorOut,colorIn,j/180);
    colord=calColor(colorOut,colorIn,(j+1)/180);
    for(var i=0;i<360;i+=precise)
    {
      theta1=i/360*2*Math.PI;
      px=x+radis*Math.sin(theta2)*Math.cos(theta1);
      py=y+radis*Math.sin(theta2)*Math.sin(theta1);
      pz=z+radis*Math.cos(theta2);
      pxd=x+radis*Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      pyd=y+radis*Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      pzd=z+radis*Math.cos(theta2+precise/360*2*Math.PI);
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));     
      colors.push(color,colord);    
    }
   } 
   addTag(tags,3,180*360*2/precise/precise);
}

function monosphere(points,colors,tags,x,y,z,radis)//黑白球根据yz平面分割左白右黑
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise)
  {
    theta2=j/360*2*Math.PI;
    color=(j<90)?black:white;
    for(var i=0;i<=360;i+=precise)
    { 
      theta1=i/360*2*Math.PI;
      px=x+radis*Math.cos(theta2);
      py=y+radis*Math.sin(theta2)*Math.cos(theta1);
      pz=z+radis*Math.sin(theta2)*Math.sin(theta1);
      pxd=x+radis*Math.cos(theta2+precise/360*2*Math.PI);
      pyd=y+radis*Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      pzd=z+radis*Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));     
      colors.push(color,color);    
    }
   } 
   addTag(tags,3,180*(360*2/precise+2)/precise);
}

function calColor(colorStart,colorEnd,degree)
{
    color0=colorStart[0]+(colorEnd[0]-colorStart[0])*degree;
    color1=colorStart[1]+(colorEnd[1]-colorStart[1])*degree;
    color2=colorStart[2]+(colorEnd[2]-colorStart[2])*degree;
    return vec3(color0,color1,color2);
}

function circleXY(points,colors,tags,x,y,z,radis,color)//平行于xy平面
{
  for(var i=0;i<360;i++){
    px=x+radis*Math.cos(i/360*6.28);
    py=y+radis*Math.sin(i/360*6.28);
    pz=z;
    points.push(vec3(px,py,pz));
    colors.push(color);
  }
  addTag(tags,2,360);
}

function circleXZ(points,colors,tags,x,y,z,radis,color)//平行于xz平面
{
  for(var i=0;i<360;i++){
    px=x+radis*Math.cos(i/360*6.28);
    py=y;
    pz=z+radis*Math.sin(i/360*6.28);
    points.push(vec3(px,py,pz));
    colors.push(color);
  }
  addTag(tags,2,360);
}

function cylinderX(points,colors,tags,x,y,z,radis,height,color)//柱面，中心轴平行于x轴
{
  var theta;
  for(var i=0;i<=360;i++){
    theta=i/360*2*Math.PI;
    py=y+radis*Math.cos(theta);
    pz=z+radis*Math.sin(theta);
    pxup=x+height/2;
    pxdown=x-height/2;
    points.push(vec3(pxup,py,pz),vec3(pxdown,py,pz));
    colors.push(color,color);
  }
  addTag(tags,3,2*361);
}

function cylinderY(points,colors,tags,x,y,z,radis,height,color)//柱面，中心轴平行于y轴
{
  var theta;
  for(var i=0;i<=360;i++){
    theta=i/360*2*Math.PI;
    px=x+radis*Math.cos(theta);
    pz=z+radis*Math.sin(theta);
    pyup=y+height/2;
    pydown=y-height/2;
    points.push(vec3(px,pyup,pz),vec3(px,pydown,pz));
    colors.push(color,color);
  }
  addTag(tags,3,2*361);
}

function cylinderZ(points,colors,tags,x,y,z,radis,height,color)//柱面，中心轴平行于z轴
{
  var theta;
  for(var i=0;i<=360;i++){
    theta=i/360*2*Math.PI;
    px=x+radis*Math.cos(theta);
    py=y+radis*Math.sin(theta);
    pzup=z+height/2;
    pzdown=z-height/2;
    points.push(vec3(px,py,pzup),vec3(px,py,pzdown));
    colors.push(color,color);
  }
  addTag(tags,3,2*361);
}

function podetiumY(points,colors,tags,x,y,z,radis,height,color1,color2,color3)//柱体，中心轴平行于y轴，1为上底面，3为下底面
{
  circleXZ(points,colors,tags,x,y+height/2,z,radis,color1);
  cylinderY(points,colors,tags,x,y,z,radis,height,color2);
  circleXZ(points,colors,tags,x,y-height/2,z,radis,color3);
}

function podetiumZ(points,colors,tags,x,y,z,radis,height,color1,color2,color3)//柱体，中心轴平行于z轴，1为上底面，3为下底面
{
  circleXY(points,colors,tags,x,y,z+height/2,radis,color1);
  cylinderZ(points,colors,tags,x,y,z,radis,height,color2);
  circleXY(points,colors,tags,x,y,z-height/2,radis,color3);
}


function ellipsoid(points,colors,tags,x,y,z,a,b,c,colorOut,colorIn)//椭球
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise){
    theta2=j/360*2*Math.PI;
    color=calColor(colorOut,colorIn,j/180);
    colord=calColor(colorOut,colorIn,(j+1)/180);
    for(var i=0;i<360;i+=precise){
      theta1=i/360*2*Math.PI;
      px=x+a*Math.sin(theta2)*Math.cos(theta1);
      py=y+b*Math.sin(theta2)*Math.sin(theta1);
      pz=z+c*Math.cos(theta2);
      pxd=x+a*Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      pyd=y+b*Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      pzd=z+c*Math.cos(theta2+precise/360*2*Math.PI);
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));
      colors.push(color,colord);
    }
   }
   addTag(tags,3,180*360*2/precise/precise);
}

function monoellipsoid(points,colors,tags,x,y,z,a,b,c)//类似于monoshere
{
  var theta1;
  var theta2;

  for(var j=0;j<180;j+=precise){
    theta2=j/360*2*Math.PI;
    color=(j<90)?black:white;
    for(var i=0;i<=360;i+=precise){
      theta1=i/360*2*Math.PI;
      px=x+a*Math.cos(theta2);
      py=y+b*Math.sin(theta2)*Math.cos(theta1);
      pz=z+c*Math.sin(theta2)*Math.sin(theta1);
      pxd=x+a*Math.cos(theta2+precise/360*2*Math.PI);
      pyd=y+b*Math.sin(theta2+precise/360*2*Math.PI)*Math.cos(theta1);
      pzd=z+c*Math.sin(theta2+precise/360*2*Math.PI)*Math.sin(theta1);
      points.push(vec3(px,py,pz),vec3(pxd,pyd,pzd));
      colors.push(color,color);
    }
   }
   addTag(tags,3,180*(360*2/precise+2)/precise);
}

function monoeye(points,colors,tags,cx,cy,cz,radis,x,y,scal){
  var v=[vec2(-2,1),
          vec2(0,0),
          vec2(5,4),
          vec2(3.5,-2.5),
          vec2(1.5,-1),
          vec2(0,-2),
          vec2(-2,-1),            
          vec2(-4,-2),
          vec2(-2,1)];
  scal*=0.7;
  v1=parabola(v[0],v[1],v[2],20);
  v2=parabola(v[7],v[6],v[5],10).concat(parabola(v[5],v[4],v[3],10));

  var prec=30;
  for(var floor=0;floor<prec;floor++)
  {
      for(var i=0;i<v1.length;i++)
      {
          topp=add(scale(scal,v1[i]),vec2(x,y));
          bottom=add(scale(scal,v2[i]),vec2(x,y));
          step=scale(1/prec,subtract(topp,bottom));
          p1=subtract(topp,scale(floor,step));
          p2=subtract(topp,scale(floor+1,step));
          pp1=vec3(p1[0]+cx,p1[1]+cy,Math.sqrt(radis*radis-p1[0]*p1[0]-p1[1]*p1[1])+cz);
          pp2=vec3(p2[0]+cx,p2[1]+cy,Math.sqrt(radis*radis-p2[0]*p2[0]-p2[1]*p2[1])+cz);
          points.push(pp1);
          points.push(pp2);
          colors.push(red);        
          colors.push(red);        
      }
      addTag(tags,3,v1.length*2);
  }
}

function parabola(p1,p2,p3,n){//X(a,b,c)=y n个点的xy平面抛物线y=ax2+bx+c
  X=mat3(p1[0]*p1[0],p1[0],1,
          p2[0]*p2[0],p2[0],1,
          p3[0]*p3[0],p3[0],1);
  y=vec3(p1[1],p2[1],p3[1]);
  Xn=inverse(X);
  a=Xn[0][0]*y[0]+Xn[0][1]*y[1]+Xn[0][2]*y[2];
  b=Xn[1][0]*y[0]+Xn[1][1]*y[1]+Xn[1][2]*y[2];
  c=Xn[2][0]*y[0]+Xn[2][1]*y[1]+Xn[2][2]*y[2];
  v=[p1];
  for(i=1;i<n;i++)
  {
      x1=(p3[0]-p1[0])/n*i+p1[0];
      y1=a*x1*x1+b*x1+c;
      v.push(vec2(x1,y1));
  }
  return v;       
}

function addTag(tags,type,length)//(type,start,numOfPoints) type 1 for Triangles,type 3 for Triangle_Strip;
{
    tag=tags[tags.length-1];
    start=tag[1]+tag[2];
    tags.push([type,start,length]);
}

function drawTags(tags)
{
    for(var i=1;i<tags.length;i++){
        if(tags1[i][0]==1)
            gl.drawArrays( gl.TRIANGLES, tags[i][1], tags[i][2]);
        if(tags1[i][0]==2)
            gl.drawArrays( gl.TRIANGLE_FAN, tags[i][1], tags[i][2]);
        if(tags1[i][0]==3)
            gl.drawArrays( gl.TRIANGLE_STRIP, tags[i][1], tags[i][2]);
    }
}
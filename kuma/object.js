//functions for drawing a bear

function bear(points,normals,texs,tags){
    a=Object.prototype.toString.call(points);
    if(a== "[object Object]"){//function bear(bear)
      tags=points.tags;
      texs=points.texs;
      normals=points.normals;
      points=points.points;
    }
    sphere(points,normals,texs,tags,0,0.3,0,0.2,color_undefined);//face
    ellipsoid(points,normals,texs,tags,0,0,0,0.27,0.2,0.2,color_undefined);//body
    ellipsoid(points,normals,texs,tags,0.27,0,0,0.05,0.08,0.05,black);//right hand
    ellipsoid(points,normals,texs,tags,-0.27,0,0,0.05,0.08,0.05,white);//left hand
    cylinderZ(points,normals,texs,tags,0.15,-0.08,0.15,0.07,0.3,black);//right leg
    cylinderZ(points,normals,texs,tags,-0.15,-0.08,0.15,0.07,0.3,white);//left leg
    ellipsoid(points,normals,texs,tags,0.15,-0.08,0.3,0.07,0.09,0.07,black);//right foot
    ellipsoid(points,normals,texs,tags,-0.15,-0.08,0.3,0.07,0.09,0.07,white);//left foot
    sphere(points,normals,texs,tags,0.27*Math.cos(Math.PI/3),0.28+0.27*Math.sin(Math.PI/3),0,0.08,black);//right ear
    sphere(points,normals,texs,tags,-0.27*Math.cos(Math.PI/3),0.28+0.27*Math.sin(Math.PI/3),0,0.08,white);//left ear
    //sphere(points,normals,texs,tags,0.1,0.33,Math.sqrt(0.021),0.03,eye);//right eye
    //sphere(points,normals,texs,tags,-0.1,0.33,Math.sqrt(0.021),0.03,eye);//left eye
    //sphere(points,normals,texs,tags,0,0.27,Math.sqrt(0.031),0.04,eye);//nose
}

function  sun(points,normals,texs,tags){
  a=Object.prototype.toString.call(points);
  if(a== "[object Object]"){//function bear(bear)
    tags=points.tags;
    texs=points.texs;
    normals=points.normals;
    points=points.points;
  }
  sphere(points,normals,texs, tags,0,0,0,0.2,red);
}






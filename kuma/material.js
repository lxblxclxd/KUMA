var Color={
    black : vec4(0.0, 0.0, 0.0, 1.0),
    gray : vec4(88 / 255, 88 / 255, 88 / 255, 1.0),
    white : vec4(1.0, 1.0, 1.0, 1.0),
    red : vec4(1.0, 0.0, 0.0, 1.0),
    blue : vec4(0.0, 0.0, 1.0, 1.0),
    brown : vec4(128 / 255, 64 / 255, 0.0, 1.0),
    skin : vec4(247 / 255, 204 / 255, 179 / 255, 1.0),
    pink : vec4(255 / 255, 128 / 255, 255 / 255, 1.0),
    undefine :vec4(0.0, 0.0, 0.0, 0.0)
}

var Material={
    create: function(colorA,colorD,colorS,shininess){
       switch(arguments.length){
           case 0: colorA=Color.undefine;
           case 1: colorD=colorA;
           case 2: colorS=Color.undefine;
           case 3: shininess=100.0;
       }
       var material={};
       material.ambient=colorA;
       material.diffuse=colorD;
       material.specular=colorS;
       material.shininess=shininess;
       return material;
    },
    black : function(){return Material.create(Color.black);},
    white : function(){return Material.create(Color.white);},
    red : function(){return Material.create(Color.red);},
    undefine : function(){return Material.create();}
}
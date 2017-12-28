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
    create: function(colorAD){
        if(arguments.length==0){
            colorAD=Color.undefine;
        }
       var material={};
       material.ambient=colorAD;
       material.diffuse=colorAD;
       material.specular=vec4();
       return material;
    },
    black : function(){return Material.create(Color.black);},
    white : function(){return Material.create(Color.white);},
    red : function(){return Material.create(Color.red);},
    undefine : function(){return Material.create();}
}
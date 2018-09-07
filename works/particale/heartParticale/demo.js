window.onload = function () {
    let threeConf = initThree({
        lightX:100,
        lightY:100,
        lightZ:100,
        cameraX:0,
        cameraY:6800,
        cameraZ:0,
    });//基础配置
    let fontLoader = new THREE.FontLoader();
    let geometry;
    let geo_ver;
    let pointsFiled, originParticlae,particleAnimate;
    let objLoader = new THREE.OBJLoader();
    objLoader.load('./obj/rose7.obj',function (obj) {
        console.log(obj.children[0]);
        let testGeo = obj.children[0];
        let position = testGeo.geometry.attributes.position.array;
        let geo_ver = [];
        let length = position.length;
        console.log(position);
        for(let i = 0; i < length; i+=3){
            geo_ver.push(new THREE.Vector3(position[i] *150  , position[i+1] *150  , position[i+2] * 150 ));
        }
        let geo_verArray = JSON.parse(JSON.stringify(geo_ver));
        let geometry = new THREE.Geometry();

        geometry.vertices = geo_verArray;
        console.log(geometry);
        // threeConf.camera.rotation.y = 200;
        // let geometry = new THREE.Geometry();
        // console.log(geometry);
        // //因为引入的是bufferGeometry，所以要对坐标做个转换,存入geometry中
        // console.log(obj.children[0].geometry);
        // let geoPosition = obj.children[0].geometry.attributes.position;
        // let tempArray = [];
        // let x,y,z;
        //
        // geoPosition.array.forEach((num, index)=>{
        //     switch (index % 3){
        //         case 0: x = num;break;
        //         case 1: y = num;break;
        //         case 2: z = num;break;
        //     }
        //     if(index !== 0 && index%3 === 0){
        //         tempArray.push(new THREE.Vector3(x, y, z))
        //     }
        // });
        // let geo_ver = tempArray;
        // geometry.vertices = geo_ver;
        // console.log(geo_ver);


        // console.log(obj);
        // let objGeo = obj.children[0].geometry;
        // console.log(objGeo);
        // let geometry = new THREE.Geometry();
        // geometry.fromBufferGeometry(objGeo);
        // geo_ver = getGeoVer(geometry);
        //
        let pointsMaterial = new THREE.PointsMaterial({
            color:0xffffff,
            size:100,
            transparent:true,//使材质透明
            blending:THREE.AdditiveBlending,//Blending is the stage of OpenGL rendering pipeline that takes the fragment color outputs from the Fragment Shader and combines them with the colors in the color buffers that these outputs map to.
            depthTest:false,//深度测试关闭，不消去场景的不可见面
            map:createLightMateria()});
        pointsFiled = new THREE.Points(geometry,pointsMaterial);
        pointsFiled.position.x = -2500;
        console.log(pointsFiled);
        originParticlae = createOriginParticleField_samePosition({originParticleNum:geo_ver.length,verPosition:[-100,-1000,0],pointsMaterial:pointsMaterial});
        originParticlae.position.z = -500;
        originParticlae.position.x = -1000;
        originParticlae.position.y = -700;
        console.log(originParticlae);
        particleAnimate = createParticleAnimateFunction(
            {   originParticle:originParticlae,
                destiParticale:pointsFiled,
                speedX:200,
                speedY:100,
                speedZ:200
            });
        // threeConf.scene.add(pointsFiled);
        threeConf.scene.add(originParticlae);

        animate();

    });

    // fontLoader.load('../../../package/font/optimer_bold.typeface.json',
    //     function (font) {
    //         let fontOptions ={
    //             font:font,
    //             size:1000,
    //             height:20,
    //             fontWeight:'bold',
    //             curveSegments: 12,  //number of points on the curves
    //             bevelEnabled:true,
    //             bevelThickness:2,
    //             bevelSize:8,
    //             bevelSegments:5
    //         };
    //         geometry = new THREE.TextGeometry("Jonithan" ,fontOptions);
    //         geo_ver = getGeoVer(geometry);
    //         console.log(geometry);
    //         //粒子代码
    //         let pointsMaterial = new THREE.PointsMaterial({
    //             color:0xffffff,
    //             size:80,
    //             transparent:true,//使材质透明
    //             blending:THREE.AdditiveBlending,//Blending is the stage of OpenGL rendering pipeline that takes the fragment color outputs from the Fragment Shader and combines them with the colors in the color buffers that these outputs map to.
    //             depthTest:false,//深度测试关闭，不消去场景的不可见面
    //             map:createLightMateria()});
    //         pointsFiled = new THREE.Points(geometry,pointsMaterial);
    //         pointsFiled.position.x = -2500;
    //         console.log(pointsFiled);
    //         originParticlae = createOriginParticleField_samePosition({originParticleNum:geo_ver.length,verPosition:[-100,-1000,0]});
    //         originParticlae.position.z = -1000;
    //         originParticlae.position.x = -2500;
    //         originParticlae.position.y = -200;
    //         console.log(originParticlae);
    //         particleAnimate = createParticleAnimateFunction(
    //             {   originParticle:originParticlae,
    //                 destiParticale:pointsFiled,
    //                 speedX:8000,
    //                 speedY:8000,
    //                 speedZ:8000
    //             });
    //         // threeConf.scene.add(pointsFiled);
    //         threeConf.scene.add(originParticlae);
    //
    //         animate();
    //     });





    function animate() {
        threeConf.stats.begin();//更新啦
        threeConf.renderer.clear();
        threeConf.renderer.render(threeConf.scene,threeConf.camera);
        threeConf.control.update();
        particleAnimate();
        threeConf.stats.end();
        // threeConf.camera.rotation.y += 10;
        requestAnimationFrame(animate);
      }
    function createLightMateria() {
        let canvasDom = document.createElement('canvas');
        canvasDom.width = 16;
        canvasDom.height = 16;
        let ctx = canvasDom.getContext('2d');
        //根据参数确定两个圆的坐标，绘制放射性渐变的方法，一个圆在里面，一个圆在外面
        let gradient = ctx.createRadialGradient(
            canvasDom.width/2,
            canvasDom.height/2,
            0,
            canvasDom.width/2,
            canvasDom.height/2,
            canvasDom.width/2);
        //设置偏移值和颜色值

        //蓝色

          // gradient.addColorStop(0,'rgba(255,255,255,1)');
          // gradient.addColorStop(0.2,'rgba(0,255,255,1)');
          // gradient.addColorStop(0.4,'rgba(0,0,64,1)');
          // gradient.addColorStop(1,'rgba(0,0,0,1)');


        //红色

        gradient.addColorStop(0,'rgba(255,255,255,1)');
        gradient.addColorStop(0.2,'rgba(255,182,193,1)');
        gradient.addColorStop(0.4,'rgba(64,0,0,1)');
        gradient.addColorStop(1,'rgba(0,0,0,1)');


        //金色
        /*
        gradient.addColorStop(0,'rgba(255,255,255,1)');
        gradient.addColorStop(0.005,'rgba(139,69,19,1)');
        gradient.addColorStop(0.4,'rgba(139,69,19,1)');
        gradient.addColorStop(1,'rgba(0,0,0,1)');
        */
        //设置ctx为渐变色
        ctx.fillStyle = gradient;
        //绘图
        ctx.fillRect(0,0,canvasDom.width,canvasDom.height);

        //贴图使用
        let texture = new THREE.Texture(canvasDom);
        texture.needsUpdate = true;//使用贴图时进行更新
        return texture;

    }
    function createOriginParticleField_samePosition(
        {   originParticleNum,
            verPosition = [0,0,0],
            pointsMaterial = new THREE.PointsMaterial({
                color:0xffffff,
                size:80,
                transparent:true,//使材质透明
                blending:THREE.AdditiveBlending,//Blending is the stage of OpenGL rendering pipeline that takes the fragment color outputs from the Fragment Shader and combines them with the colors in the color buffers that these outputs map to.
                depthTest:false,//深度测试关闭，不消去场景的不可见面
                map:createLightMateria()
            })
        } = {}) {
        let[x,y,z] = verPosition;
        let originGeo = new THREE.Geometry();
        for (let i = 0; i <originParticleNum; i++){//循环创建Geo
            originGeo.vertices.push(new THREE.Vector3(x,y,z));
        }
        let originParticleField = new THREE.Points(originGeo,pointsMaterial);
        console.log(originParticleField);
        return originParticleField;
    }

    // 迁移至wheel/particaleAnimate

    // //操作一个粒子系统（粒子集合），而不是一个粒子点
    // //为减少多次赋值的麻烦，此函数返回函数后置于animation之中
    // //传入两个粒子系统
    // function createParticleAnimateFunction({originParticle,destiParticale,speedX = 1,speedY = 1,speedZ = 1}= {}) {//粒子动画
    //     let [originVer, destiVer] = [originParticle.geometry.vertices, destiParticale.geometry.vertices];
    //     let pointsNum = originVer.length;
    //     return function () {
    //         for(let i = 0; i < pointsNum; i++){
    //             let originP = originVer[i],
    //                 destiP =  destiVer[i];
    //             let distance = Math.abs(originP.x - destiP.x) + Math.abs(originP.y - destiP.y) + Math.abs(originP.z - destiP.z);
    //             if (distance > 1){
    //                 //利用距离与坐标差的余弦值
    //                 originP.x += ((destiP.x - originP.x)/distance) * speedX * (1 - Math.random());
    //                 originP.y += ((destiP.y - originP.y)/distance) * speedY * (1 - Math.random());
    //                 originP.z += ((destiP.z - originP.z)/distance) * speedZ * (1 - Math.random());
    //             }
    //         }
    //         originParticle.geometry.verticesNeedUpdate=true;
    //     }
    //
    //
    //
    //
    //
    //
    //
    //
    // }
    // function getGeoVer(geometry) {//记录欲形成的图形的顶点位置并且返回
    //     const geo_ver = JSON.parse(JSON.stringify(geometry.vertices));
    //     console.log(geo_ver);
    //     return geo_ver;
    //
    // }

};


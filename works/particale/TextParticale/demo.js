window.onload = function () {
    let threeConf = initThree({
        lightX:100,
        lightY:100,
        lightZ:100,
        cameraX:0,
        cameraY:800,
        cameraZ:2500
    });//基础配置
    let fontLoader = new THREE.FontLoader();
    let geometry;
    let geo_ver;
    let pointsFiled, originParticlae,particleAnimate;

    fontLoader.load('../../../package/font/optimer_bold.typeface.json',
        function (font) {
            let fontOptions ={
                font:font,
                size:1000,
                height:20,
                fontWeight:'bold',
                curveSegments: 12,  //number of points on the curves
                bevelEnabled:true,
                bevelThickness:2,
                bevelSize:8,
                bevelSegments:5
            };
            geometry = new THREE.TextGeometry("Jonithan" ,fontOptions);
            geo_ver = getGeoVer(geometry);
            
            //粒子代码
            let pointsMaterial = new THREE.PointsMaterial({
                color:0xffffff,
                size:80,
                transparent:true,//使材质透明
                blending:THREE.AdditiveBlending,//Blending is the stage of OpenGL rendering pipeline that takes the fragment color outputs from the Fragment Shader and combines them with the colors in the color buffers that these outputs map to.
                depthTest:false,//深度测试关闭，不消去场景的不可见面
                map:createLightMateria()});
            pointsFiled = new THREE.Points(geometry,pointsMaterial);
            pointsFiled.position.x = -2500;
            console.log(pointsFiled);
            originParticlae = createOriginParticleField_samePosition({originParticleNum:geo_ver.length,verPosition:[-100,-1000,0]});
            originParticlae.position.z = -1000;
            originParticlae.position.x = -2500;
            originParticlae.position.y = -600;
            console.log(originParticlae);
            particleAnimate = createParticleAnimateFunction(
                {   originParticle:originParticlae,
                    destiParticale:pointsFiled,
                    speedX:1000,
                    speedY:1000,
                    speedZ:1000
                });
            // threeConf.scene.add(pointsFiled);
            threeConf.scene.add(originParticlae);
            animate();
        });
    function animate() {
        threeConf.stats.begin();
        threeConf.renderer.clear();
        threeConf.renderer.render(threeConf.scene,threeConf.camera);
        threeConf.control.update();
        particleAnimate();
        threeConf.stats.end();
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
        /*
          gradient.addColorStop(0,'rgba(255,255,255,1)');
          gradient.addColorStop(0.2,'rgba(0,255,255,1)');
          gradient.addColorStop(0.4,'rgba(0,0,64,1)');
          gradient.addColorStop(1,'rgba(0,0,0,1)');
         */

        //红色
        /*
        gradient.addColorStop(0,'rgba(255,255,255,1)');
        gradient.addColorStop(0.2,'rgba(255,182,193,1)');
        gradient.addColorStop(0.4,'rgba(64,0,0,1)');
        gradient.addColorStop(1,'rgba(0,0,0,1)');
        */

        gradient.addColorStop(0,'rgba(255,255,255,1)');
        gradient.addColorStop(0.005,'rgba(139,69,19,1)');
        gradient.addColorStop(0.4,'rgba(139,69,19,1)');
        gradient.addColorStop(1,'rgba(0,0,0,1)');

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
    //操作一个粒子系统（粒子集合），而不是一个粒子点
    //为减少多次赋值的麻烦，此函数返回函数后置于animation之中
    //传入两个粒子系统
    function createParticleAnimateFunction({originParticle,destiParticale,speedX = 1,speedY = 1,speedZ = 1}= {}) {//粒子动画
        let [originVer, destiVer] = [originParticle.geometry.vertices, destiParticale.geometry.vertices];
        let pointsNum = originVer.length;
        return function () {
            for(let i = 0; i < pointsNum; i++){
                let originP = originVer[i],
                    destiP =  destiVer[i];
                let distance = Math.abs(originP.x - destiP.x) + Math.abs(originP.y - destiP.y) + Math.abs(originP.z - destiP.z);
                if (distance > 1){
                    //利用距离与坐标差的余弦值
                    originP.x += ((destiP.x - originP.x)/distance) * speedX * (1 - Math.random());
                    originP.y += ((destiP.y - originP.y)/distance) * speedY * (1 - Math.random());
                    originP.z += ((destiP.z - originP.z)/distance) * speedZ * (1 - Math.random());
                }
            }
            originParticlae.geometry.verticesNeedUpdate=true;
        }








    }

    function getGeoVer(geometry) {//记录欲形成的图形的顶点位置并且返回
        const geo_ver = JSON.parse(JSON.stringify(geometry.vertices));
        console.log(geo_ver);
        return geo_ver;

    }

};


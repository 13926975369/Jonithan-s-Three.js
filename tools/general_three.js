function initThree({
    canvasID = 'three_canvas',
    cameraNear = 1,
    cameraFar = 10000,
    cameraX = 600,
    cameraY = 600,
    cameraZ = 600,
    lightX = 100,
    lightY = 100,
    lightZ = 100
    } = {}) {
    let threeConf = {
        renderer:null,
        camera:null,
        scene:null,
        light:null,
        control:null,
    };
    let[width,height] = [document.getElementById(canvasID).clientWidth,document.getElementById(canvasID).clientHeight];

    //渲染器
    threeConf.renderer = new THREE.WebGLRenderer({
        antialias:true,   //是否开启抗锯齿
        // alpha:true   //是否开启alphaBuffer，执行透明和半透明操作，A是RGBA中的A的透明度,开启后会透明！！！
    });
    threeConf.renderer.setSize(width,height);//渲染器尺寸
    document.getElementById(canvasID).appendChild(threeConf.renderer.domElement);//把渲染器送入元素中进行渲染
    threeConf.renderer.getClearColor(0x000000,1.0);//设置颜色缓冲区颜色

    //摄像头
    threeConf.camera = new THREE.PerspectiveCamera(60,width/height,cameraNear,cameraFar);
    threeConf.camera.position.x = cameraX;
    threeConf.camera.position.y = cameraY;
    threeConf.camera.position.z = cameraZ;
    threeConf.camera.up.x = 0;
    threeConf.camera.up.y = 1;
    threeConf.camera.up.z = 0;
    threeConf.camera.lookAt(0,0,0);

    //场景
    threeConf.scene = new THREE.Scene();

    //灯光
    threeConf.light = new THREE.DirectionalLight(0xffffff);
    threeConf.light.position.set(lightX,lightY,lightZ);
    threeConf.scene.add(threeConf.light);
    threeConf.camera.add(threeConf.light);

    //控制器
    threeConf.control = new THREE.OrbitControls(threeConf.camera);

    console.log("记得写渲染函数");
    return threeConf;
}
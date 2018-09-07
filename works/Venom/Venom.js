let threeConf = initThree({
    cameraNear:0.1,
    cameraFar:1000,
    cameraX:0,
    cameraZ:10,
    cameraY:0,
    isLight:false
});
threeConf.renderer.setClearColor(0xffffff);
let [pointLight1, pointLight2, pointLight3] = [new THREE.PointLight(0xffffff,5,0), new THREE.PointLight(0xffffff,5,0), new THREE.PointLight(0xffffff,5,0)];
let [points, pointsNum, originX, originY, originZ, originR, sphereMaterial] = [[], 10, 0, 0, 0, 2, null];
let [venomGeo, venomMaterial, venomMesh] = [null,null,null];
let axesHelper = new THREE.AxesHelper(5);
threeConf.scene.add(axesHelper);
//灯光
pointLight1.position.set(5,0,5);
pointLight2.position.set(0,5,0);
pointLight3.position.set(-5,0,0);
let pointLightSize = 1;
let pointLightHelper1 = new THREE.PointLightHelper(pointLight1,pointLightSize,0xDC143c);
let pointLightHelper2 = new THREE.PointLightHelper(pointLight2,pointLightSize,0xDC143c);
let pointLightHelper3 = new THREE.PointLightHelper(pointLight3,pointLightSize,0xDC143c);
threeConf.scene.add(pointLight1);
threeConf.scene.add(pointLight2);
threeConf.scene.add(pointLight3);
threeConf.scene.add(pointLightHelper1);
threeConf.scene.add(pointLightHelper2);
threeConf.scene.add(pointLightHelper3);

//创建点
for(let i = 0; i < pointsNum; i++){
    originX = originR * Math.cos(i);
    originY = originR * Math.sin(i);
    originZ = originR * Math.random();
    points.push(new THREE.Vector3(originX, originY, originZ));
}
//通过圆显示点进行辅助
sphereMaterial = new THREE.MeshBasicMaterial({color:0xDC143C});
points.forEach(function (point) {
    let sphereGeo = new THREE.SphereGeometry(0.1);
    let sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphereMesh.position.copy(point);
    threeConf.scene.add(sphereMesh);
});

//创建TubeGeo
venomMaterial = new THREE.MeshStandardMaterial({
    color:0x000000,
    roughness:0.2,
    emissive:0x000000,
    metalness:0.5,
    side:THREE.DoubleSide,
    wireframe:true
});
let counter = 0.9;
console.log(points);
venomGeo = new THREE.TorusGeometry(0.5,0.01,100,100,0.9);//0.4 - 2.5
venomMesh = new THREE.Mesh(venomGeo, venomMaterial);
venomMesh.position.set(0,0,0);
threeConf.scene.add(venomMesh);
console.log(venomGeo);
console.log(venomMesh);






let guiControl = new function () {
    this.intensity = pointLight1.intensity;
    this.linewidth = 1;
    this.metalness = venomMaterial.metalness;
    this.roughness = venomMaterial.roughness;
    this.emissive = venomMaterial.emissive;
    this.radius = venomGeo.parameters.radius;
    this.tube = venomGeo.parameters.tube;
    this.radialSegments = venomGeo.parameters.radialSegments;
    this.tubularSegments = venomGeo.parameters.tubularSegments;
    this.arc = venomGeo.parameters.arc;
    this.redraw = function () {
        threeConf.scene.remove(venomMesh);
        venomGeo = new THREE.TorusGeometry(guiControl.radius, guiControl.tube, guiControl.radialSegments, guiControl.tubularSegments, guiControl.arc);
        venomMesh = new THREE.Mesh(venomGeo, venomMaterial);
        threeConf.scene.add(venomMesh);
    }
};
threeConf.gui.add(guiControl,'radius',0,20).onChange(guiControl.redraw);
threeConf.gui.add(guiControl,'tube',0,20).onChange(guiControl.redraw);
threeConf.gui.add(guiControl,'radialSegments',1,200).onChange(guiControl.redraw);
threeConf.gui.add(guiControl,'tubularSegments',1,200).onChange(guiControl.redraw);
threeConf.gui.add(guiControl,'arc',0,6).onChange(guiControl.redraw);



threeConf.gui.add(guiControl,'intensity',1,100).onChange(function (e) {
   pointLight1 = pointLight2 = pointLight3 = e;
});
threeConf.gui.add(guiControl,'linewidth',0,20).onChange(function (e) {
    console.log(e)
});
threeConf.gui.add(guiControl,'metalness',0,1.0).onChange(function (e) {
    venomMaterial.metalness = e;
});
threeConf.gui.add(guiControl,'roughness',0,1.0).onChange(function (e) {
    venomMaterial.roughness = e;
});
threeConf.gui.addColor(guiControl,'emissive').onChange(function (e) {
    venomMaterial.emissive.setHex(e);
    console.log(venomMaterial);
});

function render() {
    threeConf.stats.update();
    venomMesh.rotation.y += 0.01;
    // venomMesh.rotation.z += 0.01;
    threeConf.renderer.render(threeConf.scene,threeConf.camera);
    requestAnimationFrame(render);
}
render();
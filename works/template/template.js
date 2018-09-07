let threeConf = initThree({
    cameraNear:0.1,
    cameraFar:1000,
    cameraX:0,
    cameraZ:10,
    cameraY:0,
    isLight:false
});
threeConf.renderer.setClearColor(0xffffff);
var geometry = new THREE.CubeGeometry(2,2,2);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
threeConf.scene.add(cube);
threeConf.camera.position.z = 5;
console.log(cube);
function render() {
    console.log(11);
    threeConf.stats.update();
    requestAnimationFrame(render);
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    threeConf.renderer.render(threeConf.scene,threeConf.camera);
}
render();

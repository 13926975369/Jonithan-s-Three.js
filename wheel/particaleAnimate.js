
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
        originParticle.geometry.verticesNeedUpdate=true;
    }
}
function getGeoVer(geometry) {//记录欲形成的图形的顶点位置并且返回
    const geo_ver = JSON.parse(JSON.stringify(geometry.vertices));
    console.log(geo_ver);
    return geo_ver;

}

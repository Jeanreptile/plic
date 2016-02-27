var CINEGRAPH = (function (self) {

    self.scene = null;
    self.linesScene = null;
    self.viewWidth = 0;
    self.viewHeight = 0;
    self.currentNode = null;

    self.options = {
        enablePathfinding: false,
        maxDepth: 1
    };

    self.relationships = {
        'ACTED_IN': { limit: 4, color: '#319ef1' },
        'DIRECTED': { limit: 1, color: '#8e44ad' },
        'PRODUCED': { limit: 1, color: '#27ae60' },
        'COMPOSED_MUSIC': { limit: 1, color: '#00d6ce' },
        'DIRECTED_PHOTOGRAPHY': { limit: 1, color: '#fc6e51' },
        'WROTE': { limit: 1, color: '#f1c40f' },
        'EDITED': { limit: 1, color: '#e33244' },
        'DESIGNED_PRODUCTION': { limit: 1, color: '#ac92ec' },
        'DESIGNED_COSTUMES': { limit: 1, color: '#ec87c0' }
    };

    self.types = {
        'Movie': { color: '#ffa226' }
    };

    self.initScene = function() {
        self.scene = new THREE.Scene();
        self.linesScene = new THREE.Scene();
        self.linesScene.add(self.camera);
    };

    self.init = function (http) {
        $http = http;
        $('#graph').css('opacity', 0);
        //defaultImg.onload = function () {
            self.initCamera();
            self.initScene();
            self.initRender();
            self.initTexture();
            self.initInput();
            self.animate();
            $('#graph').animate({"opacity":1}, 2000);
        //}
    };

    self.destroy = function (){
        self.destroyRender();
        self.destroyInput();
    };

    return self;
})(CINEGRAPH || {});
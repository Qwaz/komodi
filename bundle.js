/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = __webpack_require__(1);
var State = (function () {
    function State() {
        State.renderer = PIXI.autoDetectRenderer(1, 1, { antialias: true, transparent: false, resolution: 1 });
        State.renderer.backgroundColor = 0xecf0f1;
        State.renderer.view.style.position = "absolute";
        State.renderer.view.style.display = "block";
        State.renderer.autoResize = true;
        document.body.appendChild(State.renderer.view);
        State.stage = new PIXI.Container();
        State.freeBlocks = new Set();
        State.menu = new PIXI.Graphics();
        State.stage.addChild(State.menu);
        var purpleBlock = new block_1.BlockGenerator(0x9b59b6);
        purpleBlock.x = 80;
        purpleBlock.y = 55;
        var orangeBlock = new block_1.BlockGenerator(0xe67e22);
        orangeBlock.x = 220;
        orangeBlock.y = 55;
        State.menu.addChild(purpleBlock);
        State.menu.addChild(orangeBlock);
        window.addEventListener('resize', this.drawMenu, true);
        this.drawMenu();
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (State.dragging) {
                State.dragging.position = State.renderer.plugins.interaction.mouse.global;
                State.dragging.adjustChildrenPosition();
                State.freeBlocks.forEach(function (block) {
                    block.highlight = block.possibleNextBlock(State.dragging);
                });
            }
            State.renderer.render(State.stage);
        }
        State.renderer.render(State.stage);
        gameLoop();
    }
    Object.defineProperty(State, "instance", {
        get: function () {
            return this._instance || (this._instance = new State());
        },
        enumerable: true,
        configurable: true
    });
    State.prototype.drawMenu = function () {
        var MENU_HEIGHT = 120;
        State.renderer.resize(window.innerWidth, window.innerHeight);
        State.menu.clear();
        State.menu.beginFill(0xbdc3c7);
        State.menu.drawRect(0, 0, window.innerWidth, MENU_HEIGHT);
        State.menu.endFill();
    };
    State.prototype.update = function () {
        State.renderer.render(State.stage);
    };
    return State;
}());
State._instance = new State();
State.dragging = null;
exports.State = State;
var state = State.instance;
function loop() {
    requestAnimationFrame(loop);
    state.update();
}
loop();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BubbleShape_1 = __webpack_require__(2);
var entry_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(3);
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(color) {
        var _this = _super.call(this) || this;
        _this._highlight = false;
        _this._prevBlock = null;
        _this._nextBlock = null;
        entry_1.State.dragging = _this;
        entry_1.State.freeBlocks.add(_this);
        _this._color = color;
        _this._normalShape = new BubbleShape_1.default(color, false);
        _this._highlightShape = new BubbleShape_1.default(color, true);
        _this._currentShape = _this._normalShape;
        _this.addChild(_this._currentShape);
        _this.interactive = true;
        _this.buttonMode = true;
        _this.hitArea = BubbleShape_1.default.hitArea;
        _this.on('mouseover', function () { return _this.alpha = 0.7; });
        _this.on('mouseout', function () { return _this.alpha = 1; });
        _this.on('mousedown', function () {
            entry_1.State.dragging = _this;
            if (_this._prevBlock) {
                entry_1.State.freeBlocks.add(_this._prevBlock);
                _this._prevBlock._nextBlock = null;
                _this._prevBlock = null;
            }
        });
        _this.on('mouseup', function () {
            if (utils_1.hitTestRectangle(_this, entry_1.State.menu)) {
                _this.deleteTree();
            }
            else {
                entry_1.State.freeBlocks.forEach(function (block) {
                    if (!_this._prevBlock && block.possibleNextBlock(_this)) {
                        _this._prevBlock = block;
                        block._nextBlock = _this;
                        block.highlight = false;
                        entry_1.State.freeBlocks.delete(block);
                        block.adjustChildrenPosition();
                    }
                });
            }
            entry_1.State.dragging = null;
        });
        return _this;
    }
    Object.defineProperty(Block.prototype, "highlight", {
        get: function () {
            return this._highlight;
        },
        set: function (highlighted) {
            this._highlight = highlighted;
            this.removeChild(this._currentShape);
            this._currentShape = highlighted ? this._highlightShape : this._normalShape;
            this.addChild(this._currentShape);
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.possibleNextBlock = function (block) {
        if (block) {
            var NEAR = 40;
            return Math.abs(block.x - this.x) <= NEAR
                && Math.abs(block.y - (this.y - BubbleShape_1.default.BUBBLE_HEIGHT)) <= NEAR;
        }
        return false;
    };
    Block.prototype.deleteTree = function () {
        if (entry_1.State.freeBlocks.has(this)) {
            entry_1.State.freeBlocks.delete(this);
        }
        this.parent.removeChild(this);
        if (this._nextBlock) {
            this._nextBlock.deleteTree();
        }
    };
    Block.prototype.adjustChildrenPosition = function () {
        if (this._nextBlock) {
            this._nextBlock.x = this.x;
            this._nextBlock.y = this.y - BubbleShape_1.default.BUBBLE_HEIGHT;
            this._nextBlock.adjustChildrenPosition();
        }
    };
    return Block;
}(PIXI.Container));
exports.Block = Block;
var BlockGenerator = (function (_super) {
    __extends(BlockGenerator, _super);
    function BlockGenerator(color) {
        var _this = _super.call(this) || this;
        _this._color = color;
        _this.addChild(new BubbleShape_1.default(color, false));
        _this.interactive = true;
        _this.buttonMode = true;
        _this.hitArea = BubbleShape_1.default.hitArea;
        _this.on('mouseover', function () { return _this.alpha = 0.7; });
        _this.on('mouseout', function () { return _this.alpha = 1; });
        _this.on('mousedown', function () {
            var block = new Block(_this._color);
            entry_1.State.stage.addChild(block);
        });
        return _this;
    }
    return BlockGenerator;
}(PIXI.Container));
exports.BlockGenerator = BlockGenerator;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BUBBLE_WIDTH = 100;
var BUBBLE_HEIGHT = 60;
var TRIANGLE_WIDTH = 20;
var TRIANGLE_HEIGHT = 15;
var left = -BUBBLE_WIDTH * .5;
var top = -BUBBLE_HEIGHT * .5;
var right = -left;
var bottom = -top;
var BubbleShape = (function (_super) {
    __extends(BubbleShape, _super);
    function BubbleShape(color, highlighted) {
        var _this = _super.call(this) || this;
        var path = [
            left, top,
            -TRIANGLE_WIDTH * .5, top,
            0, top + TRIANGLE_HEIGHT,
            TRIANGLE_WIDTH * .5, top,
            right, top,
            right, bottom,
            TRIANGLE_WIDTH * .5, bottom,
            0, bottom + TRIANGLE_HEIGHT,
            -TRIANGLE_WIDTH * .5, bottom,
            left, bottom,
            left, top,
        ];
        _this.lineStyle(1, 0x000000, 1);
        _this.beginFill(color);
        _this.drawPolygon(path);
        _this.endFill();
        if (highlighted) {
            _this.lineStyle(4, 0xFF0000, 1);
            _this.moveTo(path[0], path[1]);
            for (var i = 1; i <= 4; i++) {
                _this.lineTo(path[i * 2], path[i * 2 + 1]);
            }
        }
        return _this;
    }
    return BubbleShape;
}(PIXI.Graphics));
BubbleShape.hitArea = new PIXI.Rectangle(left, top, BUBBLE_WIDTH, BUBBLE_HEIGHT);
BubbleShape.BUBBLE_HEIGHT = BUBBLE_HEIGHT;
exports.default = BubbleShape;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function hitTestRectangle(obj1, obj2) {
    var bound1 = obj1.getBounds();
    var bound2 = obj2.getBounds();
    var center1 = {
        x: (bound1.left + bound1.right) * .5,
        y: (bound1.top + bound1.bottom) * .5,
    };
    var center2 = {
        x: (bound2.left + bound2.right) * .5,
        y: (bound2.top + bound2.bottom) * .5,
    };
    var vx = center2.x - center1.x;
    var vy = center2.y - center1.y;
    return Math.abs(vx) < (bound1.width + bound2.width) * .5
        && Math.abs(vy) < (bound1.height + bound2.height) * .5;
}
exports.hitTestRectangle = hitTestRectangle;


/***/ })
/******/ ]);
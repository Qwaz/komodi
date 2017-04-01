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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_Generator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_blocks__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_flow__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_AttachController__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Global", function() { return Global; });




var MENU_PADDING = 20;
var Global = (function () {
    function Global() {
        Global.generators = [
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["a" /* smallBlockFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["b" /* purpleBlockFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["c" /* orangeBlockFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["d" /* binaryBlockFactory */]),
        ];
        Global.attachController = new __WEBPACK_IMPORTED_MODULE_3__controllers_AttachController__["a" /* AttachController */]();
        Global.renderer = PIXI.autoDetectRenderer(1, 1, { antialias: false, transparent: false, resolution: 1 });
        Global.renderer.backgroundColor = 0xecf0f1;
        Global.renderer.view.style.position = "absolute";
        Global.renderer.view.style.display = "block";
        Global.renderer.autoResize = true;
        document.body.appendChild(Global.renderer.view);
        Global.stage = new PIXI.Container();
        Global.menu = new PIXI.Graphics();
        Global.stage.addChild(Global.menu);
        {
            var maxHeight = 0;
            for (var _i = 0, _a = Global.generators; _i < _a.length; _i++) {
                var generator = _a[_i];
                Global.menu.addChild(generator);
                maxHeight = Math.max(maxHeight, generator.height);
            }
            Global.menuHeight = maxHeight + 2 * MENU_PADDING;
            var widthSum = 0;
            for (var i = 0; i < Global.generators.length; i++) {
                var generator = Global.generators[i];
                generator.x = (i + 1) * MENU_PADDING + widthSum + generator.width * .5;
                generator.y = Global.menuHeight * .5;
                widthSum += generator.width;
            }
        }
        window.addEventListener('resize', this.drawMenu, true);
        this.drawMenu();
    }
    Object.defineProperty(Global, "instance", {
        get: function () {
            return this._instance || (this._instance = new Global());
        },
        enumerable: true,
        configurable: true
    });
    Global.prototype.drawMenu = function () {
        Global.menu.clear();
        Global.menu.beginFill(0xbdc3c7);
        Global.menu.drawRect(0, 0, window.innerWidth, Global.menuHeight);
        Global.menu.endFill();
        Global.renderer.resize(window.innerWidth, window.innerHeight);
    };
    Global.prototype.update = function () {
        if (Global.dragging) {
            var target = Global.dragging;
            target.position = Global.renderer.plugins.interaction.mouse.global;
            if (target instanceof __WEBPACK_IMPORTED_MODULE_2__ui_flow__["a" /* Block */]) {
                target.updateChildrenPosition();
                var attachInfo = Global.attachController.getNearestAttachPoint(target.x + target.shape.pivot.offsetX, target.y + target.shape.pivot.offsetY);
                if (attachInfo) {
                    Global.attachController.setHighlight(attachInfo);
                }
                else {
                    Global.attachController.removeHighlight();
                }
            }
        }
        Global.renderer.render(Global.stage);
    };
    return Global;
}());

Global._instance = new Global();
Global.dragging = null;
var state = Global.instance;
function loop() {
    requestAnimationFrame(loop);
    state.update();
}
loop();


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entry__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(7);
/* unused harmony export FlowItem */
/* unused harmony export FlowElement */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FlowItemFactory; });
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


var FlowItem = (function (_super) {
    __extends(FlowItem, _super);
    function FlowItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nextFlowItems = [];
        return _this;
    }
    return FlowItem;
}(PIXI.Container));

var FlowElement = (function (_super) {
    __extends(FlowElement, _super);
    function FlowElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FlowElement;
}(FlowItem));

var Block = (function (_super) {
    __extends(Block, _super);
    function Block(_shape) {
        var _this = _super.call(this) || this;
        _this._shape = _shape;
        _this.attachParent = null;
        _this.attachChildren = [];
        _this.addChild(_shape.graphics.clone());
        _this.interactive = true;
        _this.hitArea = _shape.hitArea;
        _this.highlights = [];
        for (var _i = 0, _a = _shape.highlightGraphics; _i < _a.length; _i++) {
            var highlight = _a[_i];
            var clone = highlight.clone();
            _this.highlights.push(clone);
            _this.addChild(clone);
            clone.visible = false;
            _this.attachChildren.push(null);
        }
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.registerAttachPoints(_this, _shape.highlightOffsets);
        _this.on('mouseover', function () { return _this.alpha = 0.85; });
        _this.on('mouseout', function () { return _this.alpha = 1; });
        _this.on('mousedown', function () {
            if (!__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging) {
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging = _this;
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.detachBlock(_this);
            }
        });
        _this.on('mouseup', function () {
            if (__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging == _this) {
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging = null;
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* hitTestRectangle */])(__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].menu, _this)) {
                    _this.destroy();
                }
                else {
                    __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.removeHighlight();
                    var attachInfo = __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.getNearestAttachPoint(_this.x + _this._shape.pivot.offsetX, _this.y + _this._shape.pivot.offsetY);
                    if (attachInfo) {
                        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.attachBlock(_this, attachInfo);
                    }
                }
            }
        });
        return _this;
    }
    Block.prototype.destroy = function () {
        this.parent.removeChild(this);
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.deleteBlock(this);
        for (var i = 0; i < this.attachChildren.length; i++) {
            var child = this.attachChildren[i];
            if (child) {
                this.attachChildren[i] = null;
                child.destroy();
            }
        }
    };
    Block.prototype.updateChildrenPosition = function () {
        this.parent.setChildIndex(this, this.parent.children.length - 1);
        for (var i = 0; i < this._shape.highlightOffsets.length; i++) {
            var offset = this._shape.highlightOffsets[i];
            var child = this.attachChildren[i];
            if (child) {
                child.x = this.x + offset.offsetX - child._shape.pivot.offsetX;
                child.y = this.y + offset.offsetY - child._shape.pivot.offsetY;
                child.updateChildrenPosition();
            }
        }
    };
    Object.defineProperty(Block.prototype, "shape", {
        get: function () {
            return this._shape;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.calculateElementSize = function () {
    };
    Block.prototype.drawBranch = function () {
    };
    Block.prototype.editingPoints = function () {
    };
    return Block;
}(FlowElement));

var FlowItemFactory = (function () {
    function FlowItemFactory(constructor, shape) {
        this.constructor = constructor;
        this.shape = shape;
    }
    FlowItemFactory.prototype.createFlowItem = function () {
        return new this.constructor(this.shape);
    };
    return FlowItemFactory;
}());



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttachController; });
var AttachController = (function () {
    function AttachController() {
        this.attachPoints = new Map();
        this.currentHighlight = null;
    }
    AttachController.prototype.registerAttachPoints = function (block, offsets) {
        this.attachPoints.set(block, []);
        for (var i = 0; i < offsets.length; i++) {
            this.attachPoints.get(block).push({
                attachIndex: i,
                offsetX: offsets[i].offsetX,
                offsetY: offsets[i].offsetY,
            });
        }
    };
    AttachController.prototype.deleteBlock = function (block) {
        this.attachPoints.delete(block);
    };
    AttachController.prototype.setHighlight = function (attachInfo) {
        this.removeHighlight();
        this.currentHighlight = attachInfo;
        var highlight = this.getHighlightFromAttachInfo(this.currentHighlight);
        highlight.visible = true;
    };
    AttachController.prototype.removeHighlight = function () {
        if (this.currentHighlight) {
            var highlight = this.getHighlightFromAttachInfo(this.currentHighlight);
            highlight.visible = false;
            this.currentHighlight = null;
        }
    };
    AttachController.prototype.getHighlightFromAttachInfo = function (attachInfo) {
        return attachInfo.attachTo.highlights[attachInfo.attachIndex];
    };
    AttachController.prototype.getNearestAttachPoint = function (stageX, stageY) {
        var NEAR = 20;
        var result = null;
        var resultDist = 0;
        this.attachPoints.forEach(function (arr, block) {
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var candidates = arr_1[_i];
                var candX = block.x + candidates.offsetX;
                var candY = block.y + candidates.offsetY;
                var deltaX = Math.abs(stageX - candX);
                var deltaY = Math.abs(stageY - candY);
                if (deltaX <= NEAR && deltaY <= NEAR) {
                    var distance = deltaX + deltaY;
                    if (result == null || distance <= resultDist) {
                        result = {
                            attachTo: block,
                            attachIndex: candidates.attachIndex,
                        };
                        resultDist = distance;
                    }
                }
            }
        });
        return result;
    };
    AttachController.prototype.attachBlock = function (target, attachInfo) {
        var parent = attachInfo.attachTo;
        parent.attachChildren[attachInfo.attachIndex] = target;
        target.attachParent = attachInfo;
        parent.updateChildrenPosition();
        var arr = this.attachPoints.get(parent);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].attachIndex == attachInfo.attachIndex) {
                arr.splice(i, 1);
                break;
            }
        }
    };
    AttachController.prototype.detachBlock = function (target) {
        var attachInfo = target.attachParent;
        if (attachInfo) {
            var parent_1 = attachInfo.attachTo;
            parent_1.attachChildren[attachInfo.attachIndex] = null;
            target.attachParent = null;
            parent_1.updateChildrenPosition();
            var offset = parent_1.shape.highlightOffsets[attachInfo.attachIndex];
            var arr = this.attachPoints.get(parent_1);
            arr.push({
                attachIndex: attachInfo.attachIndex,
                offsetX: offset.offsetX,
                offsetY: offset.offsetY,
            });
        }
    };
    return AttachController;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entry__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Generator; });
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

var Generator = (function (_super) {
    __extends(Generator, _super);
    function Generator(target) {
        var _this = _super.call(this) || this;
        _this.addChild(target.shape.graphics.clone());
        _this.interactive = true;
        _this.buttonMode = true;
        _this.hitArea = target.shape.hitArea;
        _this.on('mouseover', function () { return _this.alpha = 0.85; });
        _this.on('mouseout', function () { return _this.alpha = 1; });
        _this.on('mousedown', function () {
            var flowItem = target.createFlowItem();
            __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].stage.addChild(flowItem);
            __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging = flowItem;
        });
        return _this;
    }
    return Generator;
}(PIXI.Container));



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_UnitaryBlockShape__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_BinaryBlockShape__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shape_SmallBlockShape__ = __webpack_require__(12);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return purpleBlockFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return orangeBlockFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return binaryBlockFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return smallBlockFactory; });




var purpleBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["b" /* FlowItemFactory */](__WEBPACK_IMPORTED_MODULE_0__flow__["a" /* Block */], new __WEBPACK_IMPORTED_MODULE_1__shape_UnitaryBlockShape__["a" /* UnitaryBlockShape */](0x9b59b6));
var orangeBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["b" /* FlowItemFactory */](__WEBPACK_IMPORTED_MODULE_0__flow__["a" /* Block */], new __WEBPACK_IMPORTED_MODULE_1__shape_UnitaryBlockShape__["a" /* UnitaryBlockShape */](0xf1c40f));
var binaryBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["b" /* FlowItemFactory */](__WEBPACK_IMPORTED_MODULE_0__flow__["a" /* Block */], new __WEBPACK_IMPORTED_MODULE_2__shape_BinaryBlockShape__["a" /* BinaryBlockShape */](0x2ecc71));
var smallBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["b" /* FlowItemFactory */](__WEBPACK_IMPORTED_MODULE_0__flow__["a" /* Block */], new __WEBPACK_IMPORTED_MODULE_3__shape_SmallBlockShape__["a" /* SmallBlockShape */](0x95a5a6));


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = hitTestRectangle;
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


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UnitaryBlockShape; });
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


var BUBBLE_WIDTH = 100;
var BUBBLE_HEIGHT = 60;
var left = -BUBBLE_WIDTH * .5;
var top = -BUBBLE_HEIGHT * .5;
var right = -left;
var bottom = -top;
var UnitaryBlockShape = (function (_super) {
    __extends(UnitaryBlockShape, _super);
    function UnitaryBlockShape(color) {
        return _super.call(this, color, UnitaryBlockShape.path, UnitaryBlockShape.highlightInfos) || this;
    }
    Object.defineProperty(UnitaryBlockShape.prototype, "pivot", {
        get: function () {
            return {
                offsetX: 0,
                offsetY: bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */],
            };
        },
        enumerable: true,
        configurable: true
    });
    return UnitaryBlockShape;
}(__WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__["a" /* StaticBlockShape */]));

UnitaryBlockShape.path = new PIXI.Polygon(left, top, -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top, 0, top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top, right, top, right, bottom, __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, bottom, 0, bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, bottom, left, bottom, left, top);
UnitaryBlockShape.highlightInfos = [
    {
        path: new PIXI.Polygon(-__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top, 0, top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top, -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top),
        offsetX: 0,
        offsetY: top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */],
    },
];


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BinaryBlockShape; });
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


var BUBBLE_MARGIN = 30;
var BUBBLE_HEIGHT = 70;
var left = -BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] - 50;
var top = -BUBBLE_HEIGHT * .5;
var right = -left;
var bottom = -top;
var BinaryBlockShape = (function (_super) {
    __extends(BinaryBlockShape, _super);
    function BinaryBlockShape(color) {
        return _super.call(this, color, BinaryBlockShape.path, BinaryBlockShape.highlightInfos) || this;
    }
    Object.defineProperty(BinaryBlockShape.prototype, "pivot", {
        get: function () {
            return {
                offsetX: 0,
                offsetY: bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */],
            };
        },
        enumerable: true,
        configurable: true
    });
    return BinaryBlockShape;
}(__WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__["a" /* StaticBlockShape */]));

BinaryBlockShape.path = new PIXI.Polygon(left, top, left + BUBBLE_MARGIN, top, left + BUBBLE_MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], left + BUBBLE_MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */], top, right - BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */], top, right - BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], right - BUBBLE_MARGIN, top, right, top, right, bottom, __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, bottom, 0, bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, bottom, left, bottom, left, top);
BinaryBlockShape.highlightInfos = [
    {
        path: new PIXI.Polygon(left + BUBBLE_MARGIN, top, left + BUBBLE_MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], left + BUBBLE_MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */], top, left + BUBBLE_MARGIN, top),
        offsetX: left + BUBBLE_MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5,
        offsetY: top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */],
    },
    {
        path: new PIXI.Polygon(right - BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */], top, right - BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], right - BUBBLE_MARGIN, top, right - BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */], top),
        offsetX: right - BUBBLE_MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5,
        offsetY: top + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */],
    },
];


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StaticBlockShape; });
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

var StaticBlockShape = (function (_super) {
    __extends(StaticBlockShape, _super);
    function StaticBlockShape(color, path, highlightInfos) {
        var _this = _super.call(this) || this;
        _this.path = path;
        _this._highlightGraphics = [];
        _this._highlightOffsets = [];
        _this._graphics = new PIXI.Graphics();
        _this._graphics.lineStyle(1, 0x000000, 1);
        _this._graphics.beginFill(color);
        _this._graphics.drawPolygon(_this.path.points);
        _this._graphics.endFill();
        for (var _i = 0, highlightInfos_1 = highlightInfos; _i < highlightInfos_1.length; _i++) {
            var highlightInfo = highlightInfos_1[_i];
            var highlight = new PIXI.Graphics();
            highlight.beginFill(0xFF0000, 0.5);
            highlight.drawPolygon(highlightInfo.path.points);
            highlight.endFill();
            _this._highlightGraphics.push(highlight);
            _this._highlightOffsets.push(highlightInfo);
        }
        return _this;
    }
    Object.defineProperty(StaticBlockShape.prototype, "graphics", {
        get: function () {
            return this._graphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StaticBlockShape.prototype, "highlightGraphics", {
        get: function () {
            return this._highlightGraphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StaticBlockShape.prototype, "highlightOffsets", {
        get: function () {
            return this._highlightOffsets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StaticBlockShape.prototype, "hitArea", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    return StaticBlockShape;
}(__WEBPACK_IMPORTED_MODULE_0__shape__["c" /* BlockShape */]));



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Shape */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BlockShape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TRIANGLE_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TRIANGLE_HEIGHT; });
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
var Shape = (function () {
    function Shape() {
    }
    return Shape;
}());

var BlockShape = (function (_super) {
    __extends(BlockShape, _super);
    function BlockShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BlockShape;
}(Shape));

var TRIANGLE_WIDTH = 20;
var TRIANGLE_HEIGHT = 15;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SmallBlockShape; });
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


var BUBBLE_WIDTH = 50;
var BUBBLE_HEIGHT = 45;
var left = -BUBBLE_WIDTH * .5;
var top = -BUBBLE_HEIGHT * .5;
var right = -left;
var bottom = -top;
var SmallBlockShape = (function (_super) {
    __extends(SmallBlockShape, _super);
    function SmallBlockShape(color) {
        return _super.call(this, color, SmallBlockShape.path, SmallBlockShape.highlightInfos) || this;
    }
    Object.defineProperty(SmallBlockShape.prototype, "pivot", {
        get: function () {
            return {
                offsetX: 0,
                offsetY: bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */],
            };
        },
        enumerable: true,
        configurable: true
    });
    return SmallBlockShape;
}(__WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__["a" /* StaticBlockShape */]));

SmallBlockShape.path = new PIXI.Polygon(left, top, right, top, right, bottom, __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, bottom, 0, bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_HEIGHT */], -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_WIDTH */] * .5, bottom, left, bottom, left, top);
SmallBlockShape.highlightInfos = [];


/***/ })
/******/ ]);
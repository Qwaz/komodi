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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Shape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BlockShape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TRIANGLE_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TRIANGLE_HEIGHT; });
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_Generator__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_blocks__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_flow__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_AttachController__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_FlowController__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Global", function() { return Global; });





var MENU_PADDING = 20;
var Global = (function () {
    function Global() {
        Global.generators = [
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["a" /* startSignalFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["b" /* smallBlockFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["c" /* purpleBlockFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["d" /* orangeBlockFactory */]),
            new __WEBPACK_IMPORTED_MODULE_0__ui_Generator__["a" /* Generator */](__WEBPACK_IMPORTED_MODULE_1__ui_blocks__["e" /* binaryBlockFactory */]),
        ];
        Global.attachController = new __WEBPACK_IMPORTED_MODULE_3__controllers_AttachController__["a" /* AttachController */]();
        Global.flowController = new __WEBPACK_IMPORTED_MODULE_4__controllers_FlowController__["a" /* FlowController */]();
        Global.renderer = PIXI.autoDetectRenderer(1, 1, { antialias: false, transparent: false, resolution: 1 });
        Global.renderer.backgroundColor = 0xECEFF1;
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
                generator.y = Global.menuHeight * .5 + generator.height * .5;
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
    Object.defineProperty(Global, "dragging", {
        get: function () {
            return Global._dragging;
        },
        enumerable: true,
        configurable: true
    });
    Global.setDragging = function (target, pivotX, pivotY) {
        if (target) {
            Global._dragging = target;
            pivotX = pivotX || target.x;
            pivotY = pivotY || target.y;
            Global.dragOffset = {
                offsetX: Global.renderer.plugins.interaction.mouse.global.x - pivotX,
                offsetY: Global.renderer.plugins.interaction.mouse.global.y - pivotY,
            };
        }
        else {
            Global._dragging = null;
        }
    };
    Global.prototype.drawMenu = function () {
        Global.menu.clear();
        Global.menu.beginFill(0xCFD8DC);
        Global.menu.drawRect(0, 0, window.innerWidth, Global.menuHeight);
        Global.menu.endFill();
        Global.renderer.resize(window.innerWidth, window.innerHeight);
    };
    Global.prototype.update = function () {
        if (Global._dragging) {
            var target = Global._dragging;
            target.x = Global.renderer.plugins.interaction.mouse.global.x - Global.dragOffset.offsetX;
            target.y = Global.renderer.plugins.interaction.mouse.global.y - Global.dragOffset.offsetY;
            if (target instanceof __WEBPACK_IMPORTED_MODULE_2__ui_flow__["a" /* Block */]) {
                target.updateChildrenPosition();
                var attachInfo = Global.attachController.getNearestAttachPoint(target.x, target.y, target);
                if (attachInfo) {
                    Global.attachController.setHighlight(attachInfo);
                }
                else {
                    Global.attachController.removeHighlight();
                }
            }
            else if (target instanceof __WEBPACK_IMPORTED_MODULE_2__ui_flow__["b" /* Signal */]) {
                Global.flowController.update(target);
            }
        }
        Global.renderer.render(Global.stage);
    };
    return Global;
}());

Global._instance = new Global();
Global._dragging = null;
Global.dragOffset = { offsetX: 0, offsetY: 0 };
var state = Global.instance;
function loop() {
    requestAnimationFrame(loop);
    state.update();
}
loop();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_AttachController__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_flowStrategies__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_FlowController__ = __webpack_require__(4);
/* unused harmony export FlowControl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Signal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return FlowItemFactory; });
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





var FlowControl = (function (_super) {
    __extends(FlowControl, _super);
    function FlowControl(flowChildren, flowStrategy) {
        var _this = _super.call(this) || this;
        _this.flowChildren = flowChildren;
        _this.flowStrategy = flowStrategy;
        _this.attachParent = null;
        flowChildren.unshift(null);
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.registerFlowControl(_this);
        _this.on('mouseover', function () { return _this.alpha = 0.85; });
        _this.on('mouseout', function () { return _this.alpha = 1; });
        return _this;
    }
    Object.defineProperty(FlowControl.prototype, "numFlow", {
        get: function () {
            return this.flowChildren.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowControl.prototype, "flowNext", {
        get: function () {
            return this.flowChildren[0];
        },
        set: function (val) {
            this.flowChildren[0] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowControl.prototype, "flowHighlights", {
        get: function () {
            if (!this._flowHighlights) {
                this._flowHighlights = __WEBPACK_IMPORTED_MODULE_4__controllers_FlowController__["b" /* Flow */].generateFlowHighlights(this);
            }
            return this._flowHighlights;
        },
        enumerable: true,
        configurable: true
    });
    FlowControl.prototype.findFlowRoot = function () {
        var now = this;
        while (now.attachParent) {
            now = now.attachParent.attachTo;
        }
        if (now instanceof Signal) {
            return now;
        }
        else {
            return null;
        }
    };
    FlowControl.prototype.hasFlowParent = function () {
        return this instanceof Signal || (!!this.attachParent && this.attachParent.attachType == __WEBPACK_IMPORTED_MODULE_2__controllers_AttachController__["b" /* AttachType */].FLOW);
    };
    FlowControl.prototype.calculateElementSize = function () {
        return this.getBounds();
    };
    FlowControl.prototype.destroy = function () {
        this.parent.removeChild(this);
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.deleteFlowControl(this);
        for (var _i = 0, _a = this.flowChildren; _i < _a.length; _i++) {
            var control = _a[_i];
            if (control) {
                control.destroy();
            }
        }
    };
    return FlowControl;
}(PIXI.Container));

var Signal = (function (_super) {
    __extends(Signal, _super);
    function Signal(_shape) {
        var _this = _super.call(this, [], __WEBPACK_IMPORTED_MODULE_3__controllers_flowStrategies__["a" /* noStrategy */]) || this;
        _this._shape = _shape;
        _this.addChild(_shape.graphics.clone());
        _this.interactive = true;
        _this.hitArea = _shape.hitArea;
        _this.on('mousedown', function () {
            if (!__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging) {
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].setDragging(_this);
            }
        });
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].flowController.registerSignal(_this);
        _this.on('mouseup', function () {
            if (__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging == _this) {
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].setDragging(null);
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* hitTestRectangle */])(__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].menu, _this)) {
                    _this.destroy();
                }
            }
        });
        return _this;
    }
    Signal.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].flowController.deleteSignal(this);
    };
    Object.defineProperty(Signal.prototype, "shape", {
        get: function () {
            return this._shape;
        },
        enumerable: true,
        configurable: true
    });
    return Signal;
}(FlowControl));

var Block = (function (_super) {
    __extends(Block, _super);
    function Block(_shape, flowChildren, flowStrategy) {
        var _this = _super.call(this, flowChildren, flowStrategy) || this;
        _this._shape = _shape;
        _this.logicChildren = [];
        _this.addChild(_shape.graphics.clone());
        _this.interactive = true;
        _this.hitArea = _shape.hitArea;
        _this.logicHighlights = [];
        for (var _i = 0, _a = _shape.highlightGraphics; _i < _a.length; _i++) {
            var highlight = _a[_i];
            var clone = highlight.clone();
            _this.logicHighlights.push(clone);
            _this.addChild(clone);
            clone.visible = false;
            _this.logicChildren.push(null);
        }
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.registerBlock(_this, _shape.highlightOffsets);
        _this.on('mousedown', function () {
            if (!__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging) {
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].setDragging(_this);
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.detachBlock(_this);
            }
        });
        _this.on('mouseup', function () {
            if (__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].dragging == _this) {
                __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].setDragging(null);
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* hitTestRectangle */])(__WEBPACK_IMPORTED_MODULE_0__entry__["Global"].menu, _this)) {
                    _this.destroy();
                }
                else {
                    __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.removeHighlight();
                    var attachInfo = __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.getNearestAttachPoint(_this.x, _this.y, _this);
                    if (attachInfo) {
                        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.attachBlock(_this, attachInfo);
                    }
                }
            }
        });
        return _this;
    }
    Block.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].attachController.deleteBlock(this);
        for (var _i = 0, _a = this.logicChildren; _i < _a.length; _i++) {
            var block = _a[_i];
            if (block) {
                block.destroy();
            }
        }
    };
    Block.prototype.updateChildrenPosition = function () {
        this.parent.setChildIndex(this, this.parent.children.length - 1);
        for (var i = 0; i < this._shape.highlightOffsets.length; i++) {
            var offset = this._shape.highlightOffsets[i];
            var child = this.logicChildren[i];
            if (child) {
                child.x = this.x + offset.offsetX;
                child.y = this.y + offset.offsetY;
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
        var bounds = this.getBounds();
        for (var _i = 0, _a = this.logicChildren; _i < _a.length; _i++) {
            var block = _a[_i];
            if (block) {
                bounds.enlarge(block.calculateElementSize());
            }
        }
        return bounds;
    };
    return Block;
}(FlowControl));

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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
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
    function StaticBlockShape(color, hitArea, highlightInfos) {
        var _this = _super.call(this) || this;
        _this.hitArea = hitArea;
        _this.highlightGraphics = [];
        _this.highlightOffsets = [];
        _this.graphics = new PIXI.Graphics();
        _this.graphics.lineStyle(1, 0x000000, 1);
        _this.graphics.beginFill(color);
        _this.graphics.drawPolygon(hitArea.points);
        _this.graphics.endFill();
        for (var _i = 0, highlightInfos_1 = highlightInfos; _i < highlightInfos_1.length; _i++) {
            var highlightInfo = highlightInfos_1[_i];
            var highlight = new PIXI.Graphics();
            highlight.beginFill(0xFF0000, 0.7);
            highlight.drawPolygon(highlightInfo.path.points);
            highlight.endFill();
            _this.highlightGraphics.push(highlight);
            _this.highlightOffsets.push(highlightInfo);
        }
        _this.hitArea = hitArea;
        return _this;
    }
    return StaticBlockShape;
}(__WEBPACK_IMPORTED_MODULE_0__shape__["c" /* BlockShape */]));



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_flow__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__entry__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Flow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowController; });
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


var FLOW_MARGIN = 60;
var EDIT_POINT_RADIUS = 8;
function setGraphicsStyle(graphics, highlight) {
    if (highlight === void 0) { highlight = false; }
    graphics.lineStyle(4, 0);
    if (highlight) {
        graphics.beginFill(0xFF0000, 0.7);
    }
    else {
        graphics.beginFill(0xFFFFFF);
    }
}
var Flow = (function (_super) {
    __extends(Flow, _super);
    function Flow(start) {
        var _this = _super.call(this) || this;
        _this.start = start;
        _this.graphics = new PIXI.Graphics();
        _this.addChild(_this.graphics);
        start.addChild(_this);
        _this.update();
        return _this;
    }
    Flow.generateFlowHighlights = function (target) {
        var ret = [];
        for (var i = 0; i < target.numFlow + 1; i++) {
            var graphics = new PIXI.Graphics();
            setGraphicsStyle(graphics, true);
            graphics.drawCircle(0, 0, EDIT_POINT_RADIUS);
            graphics.visible = false;
            target.addChild(graphics);
            ret.push(graphics);
        }
        return ret;
    };
    Flow.prototype.update = function () {
        var _this = this;
        this.graphics.clear();
        setGraphicsStyle(this.graphics);
        var nowX = 0;
        var nowY = 0;
        var lineDelta = function (x, y) {
            _this.graphics.moveTo(nowX, nowY);
            _this.graphics.lineTo(nowX + x, nowY + y);
            nowX += x;
            nowY += y;
        };
        var now = this.start;
        while (now) {
            if (now.numFlow == 0) {
                var prevY = nowY;
                lineDelta(0, FLOW_MARGIN);
                var flowX = nowX;
                var flowY = (nowY + prevY) * .5;
                this.graphics.drawCircle(flowX, flowY, EDIT_POINT_RADIUS);
                __WEBPACK_IMPORTED_MODULE_1__entry__["Global"].attachController.updateFlowOffset(now, 0, {
                    offsetX: (this.start.x + flowX) - now.x,
                    offsetY: (this.start.y + flowY) - now.y,
                });
            }
            else {
            }
            var next = now.flowChildren[0];
            if (next) {
                var size = next.calculateElementSize();
                lineDelta(0, size.height);
                next.x = this.start.x + nowX;
                next.y = this.start.y + nowY;
                if (next instanceof __WEBPACK_IMPORTED_MODULE_0__ui_flow__["a" /* Block */]) {
                    next.updateChildrenPosition();
                }
            }
            now = next;
        }
    };
    return Flow;
}(PIXI.Container));

var FlowController = (function () {
    function FlowController() {
        this.signals = new Map();
    }
    FlowController.prototype.registerSignal = function (signal) {
        this.signals.set(signal, new Flow(signal));
    };
    FlowController.prototype.deleteSignal = function (signal) {
        this.signals.delete(signal);
    };
    FlowController.prototype.update = function (signal) {
        this.signals.get(signal).update();
    };
    return FlowController;
}());



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return noStrategy; });
var noStrategy = {};


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_flow__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__entry__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AttachType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttachController; });


var AttachType;
(function (AttachType) {
    AttachType[AttachType["FLOW"] = 0] = "FLOW";
    AttachType[AttachType["LOGIC"] = 1] = "LOGIC";
})(AttachType || (AttachType = {}));
var AttachController = (function () {
    function AttachController() {
        this.logicPoints = new Map();
        this.flowPoints = new Map();
        this.currentHighlight = null;
    }
    AttachController.prototype.registerBlock = function (block, offsets) {
        this.logicPoints.set(block, []);
        for (var i = 0; i < offsets.length; i++) {
            this.logicPoints.get(block).push({
                attachType: AttachType.LOGIC,
                attachIndex: i,
                offsetX: offsets[i].offsetX,
                offsetY: offsets[i].offsetY,
            });
        }
    };
    AttachController.prototype.deleteBlock = function (block) {
        this.logicPoints.delete(block);
    };
    AttachController.prototype.registerFlowControl = function (control) {
        this.flowPoints.set(control, []);
        for (var i = 0; i < control.numFlow + 1; i++) {
            this.flowPoints.get(control).push({
                attachType: AttachType.FLOW,
                attachIndex: i,
                offsetX: 0,
                offsetY: 0,
            });
        }
    };
    AttachController.prototype.deleteFlowControl = function (control) {
        this.flowPoints.delete(control);
    };
    AttachController.prototype.updateFlowOffset = function (control, index, offset) {
        control.flowHighlights[index].x = offset.offsetX;
        control.flowHighlights[index].y = offset.offsetY;
        var arr = this.flowPoints.get(control);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].attachIndex == index) {
                arr[i].offsetX = offset.offsetX;
                arr[i].offsetY = offset.offsetY;
                break;
            }
        }
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
        if (attachInfo.attachType == AttachType.FLOW) {
            return attachInfo.attachTo.flowHighlights[attachInfo.attachIndex];
        }
        else if (attachInfo.attachType == AttachType.LOGIC) {
            return attachInfo.attachTo.logicHighlights[attachInfo.attachIndex];
        }
        else {
            throw new TypeError("Unknown Attach Type");
        }
    };
    AttachController.prototype.getNearestAttachPoint = function (stageX, stageY, exclude) {
        var NEAR = 20;
        var result = null;
        var resultDist = 0;
        this.logicPoints.forEach(function (arr, block) {
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var candidates = arr_1[_i];
                if (block == exclude) {
                    continue;
                }
                var candX = block.x + candidates.offsetX;
                var candY = block.y + candidates.offsetY;
                var deltaX = Math.abs(stageX - candX);
                var deltaY = Math.abs(stageY - candY);
                if (deltaX <= NEAR && deltaY <= NEAR) {
                    var distance = deltaX + deltaY;
                    if (result == null || distance <= resultDist) {
                        result = {
                            attachType: AttachType.LOGIC,
                            attachTo: block,
                            attachIndex: candidates.attachIndex,
                        };
                        resultDist = distance;
                    }
                }
            }
        });
        this.flowPoints.forEach(function (arr, control) {
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var candidates = arr_2[_i];
                if (control == exclude ||
                    (candidates.attachIndex == 0 && !control.hasFlowParent())) {
                    continue;
                }
                var candX = control.x + candidates.offsetX;
                var candY = control.y + candidates.offsetY;
                var deltaX = Math.abs(stageX - candX);
                var deltaY = Math.abs(stageY - candY);
                if (deltaX <= NEAR && deltaY <= NEAR) {
                    var distance = deltaX + deltaY;
                    if (result == null || distance <= resultDist) {
                        result = {
                            attachType: AttachType.FLOW,
                            attachTo: control,
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
        if (attachInfo.attachType == AttachType.LOGIC) {
            if (parent instanceof __WEBPACK_IMPORTED_MODULE_0__ui_flow__["a" /* Block */]) {
                parent.logicChildren[attachInfo.attachIndex] = target;
                target.attachParent = attachInfo;
                parent.updateChildrenPosition();
                var arr = this.logicPoints.get(parent);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].attachIndex == attachInfo.attachIndex) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                throw new TypeError("attachType and attachTo do not match");
            }
        }
        else if (attachInfo.attachType == AttachType.FLOW) {
            var next = parent.flowChildren[attachInfo.attachIndex];
            if (next) {
                next.attachParent = {
                    attachTo: target,
                    attachType: AttachType.FLOW,
                    attachIndex: 0,
                };
                target.flowNext = next;
            }
            parent.flowChildren[attachInfo.attachIndex] = target;
            target.attachParent = attachInfo;
        }
        var signal = parent.findFlowRoot();
        if (signal) {
            __WEBPACK_IMPORTED_MODULE_1__entry__["Global"].flowController.update(signal);
        }
    };
    AttachController.prototype.detachBlock = function (target) {
        var attachInfo = target.attachParent;
        if (attachInfo) {
            var parent_1 = attachInfo.attachTo;
            if (attachInfo.attachType == AttachType.LOGIC) {
                if (parent_1 instanceof __WEBPACK_IMPORTED_MODULE_0__ui_flow__["a" /* Block */]) {
                    parent_1.logicChildren[attachInfo.attachIndex] = null;
                    target.attachParent = null;
                    parent_1.updateChildrenPosition();
                    var offset = parent_1.shape.highlightOffsets[attachInfo.attachIndex];
                    var arr = this.logicPoints.get(parent_1);
                    arr.push({
                        attachType: AttachType.LOGIC,
                        attachIndex: attachInfo.attachIndex,
                        offsetX: offset.offsetX,
                        offsetY: offset.offsetY,
                    });
                }
                else {
                    throw new TypeError("attachType and attachTo do not match");
                }
            }
            else if (attachInfo.attachType == AttachType.FLOW) {
                parent_1.flowChildren[attachInfo.attachIndex] = target.flowNext;
                if (target.flowNext) {
                    target.flowNext.attachParent = target.attachParent;
                    target.flowNext = null;
                }
                target.attachParent = null;
            }
            var signal = parent_1.findFlowRoot();
            if (signal) {
                __WEBPACK_IMPORTED_MODULE_1__entry__["Global"].flowController.update(signal);
            }
        }
    };
    return AttachController;
}());



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entry__ = __webpack_require__(1);
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
            __WEBPACK_IMPORTED_MODULE_0__entry__["Global"].setDragging(flowItem, _this.x, _this.y);
        });
        return _this;
    }
    return Generator;
}(PIXI.Container));



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_UnaryBlockShape__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_BinaryBlockShape__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shape_SmallBlockShape__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shape_SignalShape__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_flowStrategies__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return startSignalFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return smallBlockFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return purpleBlockFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return orangeBlockFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return binaryBlockFactory; });
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






var SimpleBlock = (function (_super) {
    __extends(SimpleBlock, _super);
    function SimpleBlock(shape) {
        return _super.call(this, shape, [], __WEBPACK_IMPORTED_MODULE_5__controllers_flowStrategies__["a" /* noStrategy */]) || this;
    }
    return SimpleBlock;
}(__WEBPACK_IMPORTED_MODULE_0__flow__["a" /* Block */]));
var startSignalFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["c" /* FlowItemFactory */](__WEBPACK_IMPORTED_MODULE_0__flow__["b" /* Signal */], new __WEBPACK_IMPORTED_MODULE_4__shape_SignalShape__["a" /* SignalShape */]());
var smallBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["c" /* FlowItemFactory */](SimpleBlock, new __WEBPACK_IMPORTED_MODULE_3__shape_SmallBlockShape__["a" /* SmallBlockShape */](0xBDBDBD));
var purpleBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["c" /* FlowItemFactory */](SimpleBlock, new __WEBPACK_IMPORTED_MODULE_1__shape_UnaryBlockShape__["a" /* UnaryBlockShape */](0xCE93D8));
var orangeBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["c" /* FlowItemFactory */](SimpleBlock, new __WEBPACK_IMPORTED_MODULE_1__shape_UnaryBlockShape__["a" /* UnaryBlockShape */](0xFFC107));
var binaryBlockFactory = new __WEBPACK_IMPORTED_MODULE_0__flow__["c" /* FlowItemFactory */](SimpleBlock, new __WEBPACK_IMPORTED_MODULE_2__shape_BinaryBlockShape__["a" /* BinaryBlockShape */](0x81C784));


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__ = __webpack_require__(3);
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


var MARGIN = 30;
var BLOCK_HEIGHT = 70;
var left = -MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] - 50;
var top = -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */] - BLOCK_HEIGHT;
var right = -left;
var bottom = top + BLOCK_HEIGHT;
var BinaryBlockShape = (function (_super) {
    __extends(BinaryBlockShape, _super);
    function BinaryBlockShape(color) {
        return _super.call(this, color, BinaryBlockShape.path, BinaryBlockShape.highlightInfos) || this;
    }
    return BinaryBlockShape;
}(__WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__["a" /* StaticBlockShape */]));

BinaryBlockShape.path = new PIXI.Polygon(left, top, left + MARGIN, top, left + MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], left + MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */], top, right - MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */], top, right - MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], right - MARGIN, top, right, top, right, bottom, __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, bottom, 0, bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], -__WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, bottom, left, bottom, left, top);
BinaryBlockShape.highlightInfos = [
    {
        path: new PIXI.Polygon(left + MARGIN, top, left + MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], left + MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */], top, left + MARGIN, top),
        offsetX: left + MARGIN + __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5,
        offsetY: top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */],
    },
    {
        path: new PIXI.Polygon(right - MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */], top, right - MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], right - MARGIN, top, right - MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */], top),
        offsetX: right - MARGIN - __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5,
        offsetY: top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */],
    },
];


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignalShape; });
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

var BEZIER_X = 6;
var BEZIER_Y = 25;
var SIGNAL_WIDTH = 140;
var SIGNAL_HEIGHT = 60;
var left = -SIGNAL_WIDTH * .5;
var top = -SIGNAL_HEIGHT;
var right = -left;
var bottom = top + SIGNAL_HEIGHT;
var SignalShape = (function (_super) {
    __extends(SignalShape, _super);
    function SignalShape() {
        var _this = _super.call(this) || this;
        _this.pivot = {
            offsetX: 0,
            offsetY: bottom,
        };
        _this.hitArea = new PIXI.Polygon(left, top, right, top, right, bottom, left, bottom, left, top);
        _this.graphics = new PIXI.Graphics();
        _this.graphics.lineStyle(1, 0x000000, 1);
        _this.graphics.beginFill(0xFFFFFF);
        _this.graphics.moveTo(left, top);
        _this.graphics.bezierCurveTo(-BEZIER_X, top - BEZIER_Y, BEZIER_X, top + BEZIER_Y, right, top);
        _this.graphics.lineTo(right, bottom);
        _this.graphics.lineTo(left, bottom);
        _this.graphics.lineTo(left, top);
        _this.graphics.endFill();
        return _this;
    }
    return SignalShape;
}(__WEBPACK_IMPORTED_MODULE_0__shape__["d" /* Shape */]));



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__ = __webpack_require__(3);
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


var BLOCK_WIDTH = 50;
var BLOCK_HEIGHT = 45;
var left = -BLOCK_WIDTH * .5;
var top = -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */] - BLOCK_HEIGHT;
var right = -left;
var bottom = top + BLOCK_HEIGHT;
var SmallBlockShape = (function (_super) {
    __extends(SmallBlockShape, _super);
    function SmallBlockShape(color) {
        return _super.call(this, color, SmallBlockShape.path, SmallBlockShape.highlightInfos) || this;
    }
    return SmallBlockShape;
}(__WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__["a" /* StaticBlockShape */]));

SmallBlockShape.path = new PIXI.Polygon(left, top, right, top, right, bottom, __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, bottom, 0, bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], -__WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, bottom, left, bottom, left, top);
SmallBlockShape.highlightInfos = [];


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UnaryBlockShape; });
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


var BLOCK_WIDTH = 100;
var BLOCK_HEIGHT = 60;
var left = -BLOCK_WIDTH * .5;
var top = -__WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */] - BLOCK_HEIGHT;
var right = -left;
var bottom = top + BLOCK_HEIGHT;
var UnaryBlockShape = (function (_super) {
    __extends(UnaryBlockShape, _super);
    function UnaryBlockShape(color) {
        return _super.call(this, color, UnaryBlockShape.path, UnaryBlockShape.highlightInfos) || this;
    }
    return UnaryBlockShape;
}(__WEBPACK_IMPORTED_MODULE_1__StaticBlockShape__["a" /* StaticBlockShape */]));

UnaryBlockShape.path = new PIXI.Polygon(left, top, -__WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top, 0, top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top, right, top, right, bottom, __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, bottom, 0, bottom + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], -__WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, bottom, left, bottom, left, top);
UnaryBlockShape.highlightInfos = [
    {
        path: new PIXI.Polygon(-__WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top, 0, top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */], __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top, -__WEBPACK_IMPORTED_MODULE_0__shape__["a" /* TRIANGLE_WIDTH */] * .5, top),
        offsetX: 0,
        offsetY: top + __WEBPACK_IMPORTED_MODULE_0__shape__["b" /* TRIANGLE_HEIGHT */],
    },
];


/***/ }),
/* 13 */
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


/***/ })
/******/ ]);
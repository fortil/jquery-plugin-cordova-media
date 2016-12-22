(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
})([ function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _typeof2 = __webpack_require__(1);
    var _typeof3 = _interopRequireDefault(_typeof2);
    var _keys = __webpack_require__(69);
    var _keys2 = _interopRequireDefault(_keys);
    var _classCallCheck2 = __webpack_require__(73);
    var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
    var _createClass2 = __webpack_require__(74);
    var _createClass3 = _interopRequireDefault(_createClass2);
    var _helpers = __webpack_require__(78);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    Array.prototype.equals = function(array) {
        if (!array) return false;
        if (this.length != array.length) return false;
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i])) return false;
            } else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(Array.prototype, "equals", {
        enumerable: false
    });
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };
    function _getIcon(icon) {
        return '<i class="material-icons md-18">' + icon + "</i>";
    }
    function _init() {
        var rec = this.recordAudio.bind(this);
        var agrs = this.arguments;
        this.cordovaDir = cordova.file.externalDataDirectory;
        var btn = $("" + this.arguments.selector);
        btn.click(function(evt) {
            return rec(agrs);
        });
        this.strings = {
            recording: btn.data("recording") || this.strings.recording,
            stoprecord: btn.data("stoprecord") || this.strings.stoprecord,
            mjsrecord: btn.data("mjsrecord") || this.strings.mjsrecord,
            mjsdivrecord: '<div class="mensaje alignAbsoluteCenter ' + this.arguments.idRegistro + " " + this.arguments.idPregunta + '">' + (btn.data("mjsdivrecord") || this.strings.mjsdivrecord) + "</div>",
            alertmaxrecord: btn.data("alertmaxrecord") || this.strings.alertmaxrecord,
            dialogconfirm: btn.data("dialogconfirm") || this.strings.dialogconfirm,
            fields: btn.data("fields") || this.strings.fields,
            tablename: btn.data("tablename") || this.strings.tablename
        };
        this.icons = {
            playIcon: btn.data("playicon") || this.icons.playIcon,
            stopIcon: btn.data("stopicon") || this.icons.stopIcon,
            deleteIcon: btn.data("deleteicon") || this.icons.deleteIcon
        };
        this.DB = new _helpers.SQLRecords({
            name: "RecordMedia",
            description: "Save records media",
            size: 64 * 1024,
            table: {
                name: this.strings.tablename,
                fields: this.strings.fields.split(",")
            },
            app: this.arguments
        });
        btn.after(this.strings.mjsdivrecord);
        this.initView.bind(this)();
    }
    function _initView() {
        var _this = this;
        var medias = document.querySelector("#content-" + this.arguments.idRegistro + "_" + this.arguments.idPregunta);
        if (medias != undefined) medias.innerHTML = "";
        this.DB.getAllValuesAsId(function(songs) {
            var addAudioView = _this.addAudioView.bind(_this);
            var arraySongs = (0, _keys2.default)(songs);
            if (arraySongs.length > 0) {
                for (var i = 0; i < arraySongs.length; i++) {
                    songs[arraySongs[i]].selector = _this.arguments.selector;
                    songs[arraySongs[i]].max = _this.arguments.max;
                    addAudioView(songs[arraySongs[i]]);
                }
            }
        });
    }
    function _changeIconView(id, icon) {
        document.getElementsByClassName("play " + id)[0].innerHTML = icon;
    }
    function _ref3() {}
    function _ref6(e) {
        console.log("Error getting pos=" + e);
    }
    function _playPauseAudio(_ref2) {
        var _this2 = this;
        var id = _ref2.id, path = _ref2.path, name = _ref2.name, selector = _ref2.selector, idRegistro = _ref2.idRegistro, idPregunta = _ref2.idPregunta, max = _ref2.max;
        var playIcon = this.icons.playIcon;
        var stopIcon = this.icons.stopIcon;
        var changeIconView = this.changeIconView;
        var element = document.getElementsByClassName("range ex1-" + id)[0];
        var dur = 100;
        var stopState = stopStateFunc.bind(this);
        var playState = playStateFunc.bind(this);
        var mediaTimer = _ref3;
        function _ref4(e) {
            console.log("Success ", e);
            changeIconView(id, stopIcon);
        }
        function _ref5(err) {
            changeIconView(id, playIcon);
        }
        if (this.audio && this.audio.id == id && this.audio.estado != "pause") {
            stopState();
        } else if (this.audio && this.audio.id == id && this.audio.estado == "pause") {
            playState();
        } else {
            this.audio = {};
            this.audio.media = new Media(path, _ref4, _ref5, function(e) {
                console.log("Status ", e);
                if (e == 3) {
                    stopState(_this2.audio.media._position * 100);
                } else if (e == 4) {
                    _this2.DB.updateValueById({
                        field: "duration",
                        value: _this2.audio.media._duration,
                        id: id
                    });
                    stopState(0);
                }
            });
            playState();
        }
        function playStateFunc() {
            var _this3 = this;
            this.audio.id = id;
            this.audio.estado = "play";
            this.audio.media.play();
            changeIconView(id, stopIcon);
            mediaTimer = setInterval(function() {
                dur = _this3.audio.media.getDuration() * 100;
                dur = dur <= 0 ? -1 * dur : dur;
                element.max = dur;
                _this3.audio.media.getCurrentPosition(function(position) {
                    var pos = position * 100;
                    if (pos <= 0 || _this3.audio.estado == "pause") {
                        stopState(0);
                    } else {
                        _this3.audio.pos = pos;
                        element.value = pos;
                    }
                }, _ref6);
                if (dur == 0 || _this3.audio.estado == "pause") {
                    stopState(0);
                }
            }, 500);
        }
        function stopStateFunc(pos) {
            this.audio.estado = "pause";
            this.audio.media.pause();
            clearInterval(mediaTimer);
            element.value = typeof pos == "number" ? pos : this.audio.pos;
            changeIconView(id, playIcon);
        }
    }
    function _ref8() {
        console.log("error deleting the file " + error.code);
    }
    function _removeAudio(_ref7) {
        var _this4 = this;
        var id = _ref7.id, path = _ref7.path, name = _ref7.name, selector = _ref7.selector, idRegistro = _ref7.idRegistro, idPregunta = _ref7.idPregunta, max = _ref7.max;
        if (confirm(this.strings.dialogconfirm + " " + name)) {
            window.resolveLocalFileSystemURL(this.cordovaDir, function(dir) {
                dir.getFile(name, {
                    create: true
                }, function(file) {
                    file.remove(function(files) {
                        _this4.DB.deleteValue({
                            field: "id",
                            value: id
                        }, function(res) {
                            if (res == "ok") {
                                document.getElementsByClassName("MediaRecord-media " + id)[0].remove();
                                console.log("File removed! ", files);
                            }
                        });
                    }, _ref8);
                });
            });
        }
    }
    function _ref11(e) {
        return console.log(e);
    }
    function _recordAudio(_ref9) {
        var _this5 = this;
        var selector = _ref9.selector, idRegistro = _ref9.idRegistro, idPregunta = _ref9.idPregunta, max = _ref9.max;
        var store = this.cordovaDir;
        var id = Date.now();
        var name = idRegistro + "_" + idPregunta + "__" + id + ".amr";
        var path = store + name;
        function _ref12() {
            var addAudio = _this5.addAudio.bind(_this5);
            var upload = _this5.upload.bind(_this5);
            _this5.record.recording = true;
            function _ref10() {
                return upload({
                    id: id,
                    path: path,
                    name: name,
                    selector: selector,
                    idRegistro: idRegistro,
                    idPregunta: idPregunta,
                    max: max
                });
            }
            _this5.record.media = new Media(path, function(e) {
                addAudio({
                    id: id,
                    path: path,
                    name: name,
                    selector: selector,
                    idRegistro: idRegistro,
                    idPregunta: idPregunta,
                    max: max
                });
                if (_this5.arguments.nameServer != undefined) setTimeout(_ref10, 0);
            }, _ref11);
            _this5.record.media.startRecord();
            _this5.startRecordView.bind(_this5)(selector);
        }
        this.DB.getAllValuesAsId(function(songs) {
            var lengthSongs = songs.length || ((typeof songs === "undefined" ? "undefined" : (0, 
            _typeof3.default)(songs)) == "object" ? (0, _keys2.default)(songs).length : 0);
            if (lengthSongs >= max) {
                alert(_this5.strings.alertmaxrecord);
            } else {
                if (_this5.record.recording == true) {
                    _this5.record.media.stopRecord();
                    _this5.record.recording = false;
                    _this5.stopRecordView.bind(_this5)(selector);
                } else {
                    _ref12();
                }
            }
        });
    }
    function _addAudio(_ref13) {
        var id = _ref13.id, path = _ref13.path, name = _ref13.name, selector = _ref13.selector, idRegistro = _ref13.idRegistro, idPregunta = _ref13.idPregunta, max = _ref13.max;
        var date = new Date().getTime();
        this.DB.insertValue([ id, name, path, idRegistro, idPregunta, "audio", "4.0", date ]);
        this.addAudioView.bind(this)({
            id: id,
            path: path,
            name: name,
            selector: selector,
            idRegistro: idRegistro,
            idPregunta: idPregunta,
            max: max,
            date: date
        });
    }
    function _startRecordView(selector) {
        document.querySelector(selector + "").innerHTML = this.strings.recording;
        document.getElementsByClassName("mensaje " + this.arguments.idRegistro + " " + this.arguments.idPregunta)[0].style.visibility = "visible";
    }
    function _stopRecordView(selector) {
        document.querySelector(selector + "").innerHTML = this.strings.stoprecord;
        document.getElementsByClassName("mensaje " + this.arguments.idRegistro + " " + this.arguments.idPregunta)[0].style.visibility = "hidden";
    }
    function _addAudioView(audio) {
        var playPauseAudio = this.playPauseAudio.bind(this);
        var removeAudio = this.removeAudio.bind(this);
        var template = this.templateAudio.bind(this)(audio);
        var reg = document.querySelector("#content-" + audio.idRegistro + "_" + audio.idPregunta);
        if (reg == undefined) {
            var btnAudio = document.querySelector("" + audio.selector);
            var father = btnAudio.parentElement;
            var playList = document.createElement("div");
            playList.id = "content-" + audio.idRegistro + "_" + audio.idPregunta;
            father.insertBefore(playList, btnAudio);
        }
        document.querySelector("#content-" + audio.idRegistro + "_" + audio.idPregunta).insertAdjacentHTML("beforeend", template);
        document.getElementsByClassName("play " + audio.id)[0].addEventListener("click", function() {
            return playPauseAudio(audio);
        }, false);
        document.getElementsByClassName("remove " + audio.id)[0].addEventListener("click", function() {
            return removeAudio(audio);
        }, false);
    }
    function _templateAudio(audio) {
        var date = new Date(audio.date).toISOString().split("T");
        var time = date[1].split(".")[0];
        date = date[0] + " " + time;
        return '<div class="MediaRecord-media ' + audio.id + " " + audio.idRegistro + " " + audio.idPregunta + '">\n      <div class="MediaRecord-buttons-media">\n        <button data-url="' + audio.path + '" class="play ' + audio.id + '">' + this.icons.playIcon + '</button>\n        <input class="range ex1-' + audio.id + '" type="range" value="0" min="0" max="100"/>\n        <button class="remove ' + audio.id + '" >' + this.icons.deleteIcon + '</button>\n      </div>\n      <div class="MediaRecord-date">' + date + "</div>\n    </div>";
    }
    function _ref14(progressEvent) {
        if (progressEvent.lengthComputable) {
            console.log(progressEvent.loaded / progressEvent.total);
        } else {
            console.log("----");
        }
    }
    function _ref15(e) {
        return console.log(e);
    }
    function _ref16(e) {
        return console.log(e);
    }
    function _upload(data) {
        var uri = encodeURI(this.arguments.nameServer);
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = data.name;
        options.mimeType = "application/octet-stream";
        var headers = {
            name: data.name
        };
        options.headers = headers;
        var ft = new FileTransfer();
        ft.onprogress = _ref14;
        ft.upload(data.path, uri, _ref15, _ref16, options);
    }
    var RecordMedia = function() {
        function RecordMedia(_ref) {
            var idRegistro = _ref.idRegistro, idPregunta = _ref.idPregunta, max = _ref.max, nameServer = _ref.nameServer, selector = _ref.selector;
            (0, _classCallCheck3.default)(this, RecordMedia);
            this.arguments = {
                selector: selector,
                idRegistro: idRegistro || (0, _helpers.MakeId)(),
                idPregunta: idPregunta || (0, _helpers.MakeId)(),
                max: max || 1e4,
                nameServer: nameServer || undefined
            };
            this.audio = {};
            this.DB;
            this.cordovaDir = "";
            this.icons = {
                playIcon: this.getIcon("play_arrow"),
                stopIcon: this.getIcon("pause"),
                deleteIcon: this.getIcon("clear")
            };
            this.strings = {
                recording: "Detener grabación",
                stoprecord: "Grabar audio",
                mjsrecord: "Grabando audio....",
                mjsdivrecord: "grabando ....",
                alertmaxrecord: " Llegó al máximo de grabaciones posibles ",
                dialogconfirm: "Está seguro de eliminar el archivo ",
                fields: "id,name,path,idRegistro,idPregunta,type,duration,date",
                tablename: "RECORDS"
            };
            this.record = {
                recording: false
            };
        }
        (0, _createClass3.default)(RecordMedia, [ {
            key: "getIcon",
            value: _getIcon
        }, {
            key: "init",
            value: _init
        }, {
            key: "initView",
            value: _initView
        }, {
            key: "changeIconView",
            value: _changeIconView
        }, {
            key: "playPauseAudio",
            value: _playPauseAudio
        }, {
            key: "removeAudio",
            value: _removeAudio
        }, {
            key: "recordAudio",
            value: _recordAudio
        }, {
            key: "addAudio",
            value: _addAudio
        }, {
            key: "startRecordView",
            value: _startRecordView
        }, {
            key: "stopRecordView",
            value: _stopRecordView
        }, {
            key: "addAudioView",
            value: _addAudioView
        }, {
            key: "templateAudio",
            value: _templateAudio
        }, {
            key: "upload",
            value: _upload
        } ]);
        return RecordMedia;
    }();
    function _ref18(_ref17) {
        var idRegistro = _ref17.idRegistro, idPregunta = _ref17.idPregunta, nameServer = _ref17.nameServer, max = _ref17.max;
        var selector = this.selector;
        var app = new App({
            idRegistro: idRegistro,
            idPregunta: idPregunta,
            max: max,
            nameServer: nameServer,
            selector: selector
        });
        app.init();
        return {
            element: this,
            app: app
        };
    }
    function _ref19($) {
        $.fn.recordMedia = _ref18;
    }
    if (jQuery) {
        _ref19(jQuery);
    }
    window.RecordMedia = RecordMedia;
    exports.default = RecordMedia;
}, function(module, exports, __webpack_require__) {
    "use strict";
    exports.__esModule = true;
    var _iterator = __webpack_require__(2);
    var _iterator2 = _interopRequireDefault(_iterator);
    var _symbol = __webpack_require__(53);
    var _symbol2 = _interopRequireDefault(_symbol);
    var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj;
    };
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function(obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof(obj);
    } : function(obj) {
        return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };
}, function(module, exports, __webpack_require__) {
    module.exports = {
        default: __webpack_require__(3),
        __esModule: true
    };
}, function(module, exports, __webpack_require__) {
    __webpack_require__(4);
    __webpack_require__(48);
    module.exports = __webpack_require__(52).f("iterator");
}, function(module, exports, __webpack_require__) {
    "use strict";
    var $at = __webpack_require__(5)(true);
    __webpack_require__(8)(String, "String", function(iterated) {
        this._t = String(iterated);
        this._i = 0;
    }, function() {
        var O = this._t, index = this._i, point;
        if (index >= O.length) return {
            value: undefined,
            done: true
        };
        point = $at(O, index);
        this._i += point.length;
        return {
            value: point,
            done: false
        };
    });
}, function(module, exports, __webpack_require__) {
    var toInteger = __webpack_require__(6), defined = __webpack_require__(7);
    module.exports = function(TO_STRING) {
        return function(that, pos) {
            var s = String(defined(that)), i = toInteger(pos), l = s.length, a, b;
            if (i < 0 || i >= l) return TO_STRING ? "" : undefined;
            a = s.charCodeAt(i);
            return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
        };
    };
}, function(module, exports) {
    var ceil = Math.ceil, floor = Math.floor;
    module.exports = function(it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };
}, function(module, exports) {
    module.exports = function(it) {
        if (it == undefined) throw TypeError("Can't call method on  " + it);
        return it;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var LIBRARY = __webpack_require__(9), $export = __webpack_require__(10), redefine = __webpack_require__(25), hide = __webpack_require__(15), has = __webpack_require__(26), Iterators = __webpack_require__(27), $iterCreate = __webpack_require__(28), setToStringTag = __webpack_require__(44), getPrototypeOf = __webpack_require__(46), ITERATOR = __webpack_require__(45)("iterator"), BUGGY = !([].keys && "next" in [].keys()), FF_ITERATOR = "@@iterator", KEYS = "keys", VALUES = "values";
    var returnThis = function() {
        return this;
    };
    module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
        $iterCreate(Constructor, NAME, next);
        var getMethod = function(kind) {
            if (!BUGGY && kind in proto) return proto[kind];
            switch (kind) {
              case KEYS:
                return function keys() {
                    return new Constructor(this, kind);
                };

              case VALUES:
                return function values() {
                    return new Constructor(this, kind);
                };
            }
            return function entries() {
                return new Constructor(this, kind);
            };
        };
        var TAG = NAME + " Iterator", DEF_VALUES = DEFAULT == VALUES, VALUES_BUG = false, proto = Base.prototype, $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT], $default = $native || getMethod(DEFAULT), $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod("entries") : undefined, $anyNative = NAME == "Array" ? proto.entries || $native : $native, methods, key, IteratorPrototype;
        if ($anyNative) {
            IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
            if (IteratorPrototype !== Object.prototype) {
                setToStringTag(IteratorPrototype, TAG, true);
                if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
            }
        }
        if (DEF_VALUES && $native && $native.name !== VALUES) {
            VALUES_BUG = true;
            $default = function values() {
                return $native.call(this);
            };
        }
        if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
            hide(proto, ITERATOR, $default);
        }
        Iterators[NAME] = $default;
        Iterators[TAG] = returnThis;
        if (DEFAULT) {
            methods = {
                values: DEF_VALUES ? $default : getMethod(VALUES),
                keys: IS_SET ? $default : getMethod(KEYS),
                entries: $entries
            };
            if (FORCED) for (key in methods) {
                if (!(key in proto)) redefine(proto, key, methods[key]);
            } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
        }
        return methods;
    };
}, function(module, exports) {
    module.exports = true;
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(11), core = __webpack_require__(12), ctx = __webpack_require__(13), hide = __webpack_require__(15), PROTOTYPE = "prototype";
    var $export = function(type, name, source) {
        var IS_FORCED = type & $export.F, IS_GLOBAL = type & $export.G, IS_STATIC = type & $export.S, IS_PROTO = type & $export.P, IS_BIND = type & $export.B, IS_WRAP = type & $export.W, exports = IS_GLOBAL ? core : core[name] || (core[name] = {}), expProto = exports[PROTOTYPE], target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE], key, own, out;
        if (IS_GLOBAL) source = name;
        for (key in source) {
            own = !IS_FORCED && target && target[key] !== undefined;
            if (own && key in exports) continue;
            out = own ? target[key] : source[key];
            exports[key] = IS_GLOBAL && typeof target[key] != "function" ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function(C) {
                var F = function(a, b, c) {
                    if (this instanceof C) {
                        switch (arguments.length) {
                          case 0:
                            return new C();

                          case 1:
                            return new C(a);

                          case 2:
                            return new C(a, b);
                        }
                        return new C(a, b, c);
                    }
                    return C.apply(this, arguments);
                };
                F[PROTOTYPE] = C[PROTOTYPE];
                return F;
            }(out) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
            if (IS_PROTO) {
                (exports.virtual || (exports.virtual = {}))[key] = out;
                if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
            }
        }
    };
    $export.F = 1;
    $export.G = 2;
    $export.S = 4;
    $export.P = 8;
    $export.B = 16;
    $export.W = 32;
    $export.U = 64;
    $export.R = 128;
    module.exports = $export;
}, function(module, exports) {
    var global = module.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
    if (typeof __g == "number") __g = global;
}, function(module, exports) {
    var core = module.exports = {
        version: "2.4.0"
    };
    if (typeof __e == "number") __e = core;
}, function(module, exports, __webpack_require__) {
    var aFunction = __webpack_require__(14);
    module.exports = function(fn, that, length) {
        aFunction(fn);
        if (that === undefined) return fn;
        switch (length) {
          case 1:
            return function(a) {
                return fn.call(that, a);
            };

          case 2:
            return function(a, b) {
                return fn.call(that, a, b);
            };

          case 3:
            return function(a, b, c) {
                return fn.call(that, a, b, c);
            };
        }
        return function() {
            return fn.apply(that, arguments);
        };
    };
}, function(module, exports) {
    module.exports = function(it) {
        if (typeof it != "function") throw TypeError(it + " is not a function!");
        return it;
    };
}, function(module, exports, __webpack_require__) {
    var dP = __webpack_require__(16), createDesc = __webpack_require__(24);
    module.exports = __webpack_require__(20) ? function(object, key, value) {
        return dP.f(object, key, createDesc(1, value));
    } : function(object, key, value) {
        object[key] = value;
        return object;
    };
}, function(module, exports, __webpack_require__) {
    var anObject = __webpack_require__(17), IE8_DOM_DEFINE = __webpack_require__(19), toPrimitive = __webpack_require__(23), dP = Object.defineProperty;
    exports.f = __webpack_require__(20) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (IE8_DOM_DEFINE) try {
            return dP(O, P, Attributes);
        } catch (e) {}
        if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(18);
    module.exports = function(it) {
        if (!isObject(it)) throw TypeError(it + " is not an object!");
        return it;
    };
}, function(module, exports) {
    module.exports = function(it) {
        return typeof it === "object" ? it !== null : typeof it === "function";
    };
}, function(module, exports, __webpack_require__) {
    module.exports = !__webpack_require__(20) && !__webpack_require__(21)(function() {
        return Object.defineProperty(__webpack_require__(22)("div"), "a", {
            get: function() {
                return 7;
            }
        }).a != 7;
    });
}, function(module, exports, __webpack_require__) {
    module.exports = !__webpack_require__(21)(function() {
        return Object.defineProperty({}, "a", {
            get: function() {
                return 7;
            }
        }).a != 7;
    });
}, function(module, exports) {
    module.exports = function(exec) {
        try {
            return !!exec();
        } catch (e) {
            return true;
        }
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(18), document = __webpack_require__(11).document, is = isObject(document) && isObject(document.createElement);
    module.exports = function(it) {
        return is ? document.createElement(it) : {};
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(18);
    module.exports = function(it, S) {
        if (!isObject(it)) return it;
        var fn, val;
        if (S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
        if (typeof (fn = it.valueOf) == "function" && !isObject(val = fn.call(it))) return val;
        if (!S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
        throw TypeError("Can't convert object to primitive value");
    };
}, function(module, exports) {
    module.exports = function(bitmap, value) {
        return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
        };
    };
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(15);
}, function(module, exports) {
    var hasOwnProperty = {}.hasOwnProperty;
    module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
    };
}, function(module, exports) {
    module.exports = {};
}, function(module, exports, __webpack_require__) {
    "use strict";
    var create = __webpack_require__(29), descriptor = __webpack_require__(24), setToStringTag = __webpack_require__(44), IteratorPrototype = {};
    __webpack_require__(15)(IteratorPrototype, __webpack_require__(45)("iterator"), function() {
        return this;
    });
    module.exports = function(Constructor, NAME, next) {
        Constructor.prototype = create(IteratorPrototype, {
            next: descriptor(1, next)
        });
        setToStringTag(Constructor, NAME + " Iterator");
    };
}, function(module, exports, __webpack_require__) {
    var anObject = __webpack_require__(17), dPs = __webpack_require__(30), enumBugKeys = __webpack_require__(42), IE_PROTO = __webpack_require__(39)("IE_PROTO"), Empty = function() {}, PROTOTYPE = "prototype";
    var createDict = function() {
        var iframe = __webpack_require__(22)("iframe"), i = enumBugKeys.length, lt = "<", gt = ">", iframeDocument;
        iframe.style.display = "none";
        __webpack_require__(43).appendChild(iframe);
        iframe.src = "javascript:";
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(lt + "script" + gt + "document.F=Object" + lt + "/script" + gt);
        iframeDocument.close();
        createDict = iframeDocument.F;
        while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
        return createDict();
    };
    module.exports = Object.create || function create(O, Properties) {
        var result;
        if (O !== null) {
            Empty[PROTOTYPE] = anObject(O);
            result = new Empty();
            Empty[PROTOTYPE] = null;
            result[IE_PROTO] = O;
        } else result = createDict();
        return Properties === undefined ? result : dPs(result, Properties);
    };
}, function(module, exports, __webpack_require__) {
    var dP = __webpack_require__(16), anObject = __webpack_require__(17), getKeys = __webpack_require__(31);
    module.exports = __webpack_require__(20) ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        var keys = getKeys(Properties), length = keys.length, i = 0, P;
        while (length > i) dP.f(O, P = keys[i++], Properties[P]);
        return O;
    };
}, function(module, exports, __webpack_require__) {
    var $keys = __webpack_require__(32), enumBugKeys = __webpack_require__(42);
    module.exports = Object.keys || function keys(O) {
        return $keys(O, enumBugKeys);
    };
}, function(module, exports, __webpack_require__) {
    var has = __webpack_require__(26), toIObject = __webpack_require__(33), arrayIndexOf = __webpack_require__(36)(false), IE_PROTO = __webpack_require__(39)("IE_PROTO");
    module.exports = function(object, names) {
        var O = toIObject(object), i = 0, result = [], key;
        for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
        while (names.length > i) if (has(O, key = names[i++])) {
            ~arrayIndexOf(result, key) || result.push(key);
        }
        return result;
    };
}, function(module, exports, __webpack_require__) {
    var IObject = __webpack_require__(34), defined = __webpack_require__(7);
    module.exports = function(it) {
        return IObject(defined(it));
    };
}, function(module, exports, __webpack_require__) {
    var cof = __webpack_require__(35);
    module.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
        return cof(it) == "String" ? it.split("") : Object(it);
    };
}, function(module, exports) {
    var toString = {}.toString;
    module.exports = function(it) {
        return toString.call(it).slice(8, -1);
    };
}, function(module, exports, __webpack_require__) {
    var toIObject = __webpack_require__(33), toLength = __webpack_require__(37), toIndex = __webpack_require__(38);
    module.exports = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
            var O = toIObject($this), length = toLength(O.length), index = toIndex(fromIndex, length), value;
            if (IS_INCLUDES && el != el) while (length > index) {
                value = O[index++];
                if (value != value) return true;
            } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
                if (O[index] === el) return IS_INCLUDES || index || 0;
            }
            return !IS_INCLUDES && -1;
        };
    };
}, function(module, exports, __webpack_require__) {
    var toInteger = __webpack_require__(6), min = Math.min;
    module.exports = function(it) {
        return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
    };
}, function(module, exports, __webpack_require__) {
    var toInteger = __webpack_require__(6), max = Math.max, min = Math.min;
    module.exports = function(index, length) {
        index = toInteger(index);
        return index < 0 ? max(index + length, 0) : min(index, length);
    };
}, function(module, exports, __webpack_require__) {
    var shared = __webpack_require__(40)("keys"), uid = __webpack_require__(41);
    module.exports = function(key) {
        return shared[key] || (shared[key] = uid(key));
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(11), SHARED = "__core-js_shared__", store = global[SHARED] || (global[SHARED] = {});
    module.exports = function(key) {
        return store[key] || (store[key] = {});
    };
}, function(module, exports) {
    var id = 0, px = Math.random();
    module.exports = function(key) {
        return "Symbol(".concat(key === undefined ? "" : key, ")_", (++id + px).toString(36));
    };
}, function(module, exports) {
    module.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(11).document && document.documentElement;
}, function(module, exports, __webpack_require__) {
    var def = __webpack_require__(16).f, has = __webpack_require__(26), TAG = __webpack_require__(45)("toStringTag");
    module.exports = function(it, tag, stat) {
        if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
            configurable: true,
            value: tag
        });
    };
}, function(module, exports, __webpack_require__) {
    var store = __webpack_require__(40)("wks"), uid = __webpack_require__(41), Symbol = __webpack_require__(11).Symbol, USE_SYMBOL = typeof Symbol == "function";
    var $exports = module.exports = function(name) {
        return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)("Symbol." + name));
    };
    $exports.store = store;
}, function(module, exports, __webpack_require__) {
    var has = __webpack_require__(26), toObject = __webpack_require__(47), IE_PROTO = __webpack_require__(39)("IE_PROTO"), ObjectProto = Object.prototype;
    module.exports = Object.getPrototypeOf || function(O) {
        O = toObject(O);
        if (has(O, IE_PROTO)) return O[IE_PROTO];
        if (typeof O.constructor == "function" && O instanceof O.constructor) {
            return O.constructor.prototype;
        }
        return O instanceof Object ? ObjectProto : null;
    };
}, function(module, exports, __webpack_require__) {
    var defined = __webpack_require__(7);
    module.exports = function(it) {
        return Object(defined(it));
    };
}, function(module, exports, __webpack_require__) {
    __webpack_require__(49);
    var global = __webpack_require__(11), hide = __webpack_require__(15), Iterators = __webpack_require__(27), TO_STRING_TAG = __webpack_require__(45)("toStringTag");
    for (var collections = [ "NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList" ], i = 0; i < 5; i++) {
        var NAME = collections[i], Collection = global[NAME], proto = Collection && Collection.prototype;
        if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
        Iterators[NAME] = Iterators.Array;
    }
}, function(module, exports, __webpack_require__) {
    "use strict";
    var addToUnscopables = __webpack_require__(50), step = __webpack_require__(51), Iterators = __webpack_require__(27), toIObject = __webpack_require__(33);
    module.exports = __webpack_require__(8)(Array, "Array", function(iterated, kind) {
        this._t = toIObject(iterated);
        this._i = 0;
        this._k = kind;
    }, function() {
        var O = this._t, kind = this._k, index = this._i++;
        if (!O || index >= O.length) {
            this._t = undefined;
            return step(1);
        }
        if (kind == "keys") return step(0, index);
        if (kind == "values") return step(0, O[index]);
        return step(0, [ index, O[index] ]);
    }, "values");
    Iterators.Arguments = Iterators.Array;
    addToUnscopables("keys");
    addToUnscopables("values");
    addToUnscopables("entries");
}, function(module, exports) {
    module.exports = function() {};
}, function(module, exports) {
    module.exports = function(done, value) {
        return {
            value: value,
            done: !!done
        };
    };
}, function(module, exports, __webpack_require__) {
    exports.f = __webpack_require__(45);
}, function(module, exports, __webpack_require__) {
    module.exports = {
        default: __webpack_require__(54),
        __esModule: true
    };
}, function(module, exports, __webpack_require__) {
    __webpack_require__(55);
    __webpack_require__(66);
    __webpack_require__(67);
    __webpack_require__(68);
    module.exports = __webpack_require__(12).Symbol;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var global = __webpack_require__(11), has = __webpack_require__(26), DESCRIPTORS = __webpack_require__(20), $export = __webpack_require__(10), redefine = __webpack_require__(25), META = __webpack_require__(56).KEY, $fails = __webpack_require__(21), shared = __webpack_require__(40), setToStringTag = __webpack_require__(44), uid = __webpack_require__(41), wks = __webpack_require__(45), wksExt = __webpack_require__(52), wksDefine = __webpack_require__(57), keyOf = __webpack_require__(58), enumKeys = __webpack_require__(59), isArray = __webpack_require__(62), anObject = __webpack_require__(17), toIObject = __webpack_require__(33), toPrimitive = __webpack_require__(23), createDesc = __webpack_require__(24), _create = __webpack_require__(29), gOPNExt = __webpack_require__(63), $GOPD = __webpack_require__(65), $DP = __webpack_require__(16), $keys = __webpack_require__(31), gOPD = $GOPD.f, dP = $DP.f, gOPN = gOPNExt.f, $Symbol = global.Symbol, $JSON = global.JSON, _stringify = $JSON && $JSON.stringify, PROTOTYPE = "prototype", HIDDEN = wks("_hidden"), TO_PRIMITIVE = wks("toPrimitive"), isEnum = {}.propertyIsEnumerable, SymbolRegistry = shared("symbol-registry"), AllSymbols = shared("symbols"), OPSymbols = shared("op-symbols"), ObjectProto = Object[PROTOTYPE], USE_NATIVE = typeof $Symbol == "function", QObject = global.QObject;
    var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
    var setSymbolDesc = DESCRIPTORS && $fails(function() {
        return _create(dP({}, "a", {
            get: function() {
                return dP(this, "a", {
                    value: 7
                }).a;
            }
        })).a != 7;
    }) ? function(it, key, D) {
        var protoDesc = gOPD(ObjectProto, key);
        if (protoDesc) delete ObjectProto[key];
        dP(it, key, D);
        if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
    } : dP;
    var wrap = function(tag) {
        var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
        sym._k = tag;
        return sym;
    };
    var isSymbol = USE_NATIVE && typeof $Symbol.iterator == "symbol" ? function(it) {
        return typeof it == "symbol";
    } : function(it) {
        return it instanceof $Symbol;
    };
    var $defineProperty = function defineProperty(it, key, D) {
        if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
        anObject(it);
        key = toPrimitive(key, true);
        anObject(D);
        if (has(AllSymbols, key)) {
            if (!D.enumerable) {
                if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
                it[HIDDEN][key] = true;
            } else {
                if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
                D = _create(D, {
                    enumerable: createDesc(0, false)
                });
            }
            return setSymbolDesc(it, key, D);
        }
        return dP(it, key, D);
    };
    var $defineProperties = function defineProperties(it, P) {
        anObject(it);
        var keys = enumKeys(P = toIObject(P)), i = 0, l = keys.length, key;
        while (l > i) $defineProperty(it, key = keys[i++], P[key]);
        return it;
    };
    var $create = function create(it, P) {
        return P === undefined ? _create(it) : $defineProperties(_create(it), P);
    };
    var $propertyIsEnumerable = function propertyIsEnumerable(key) {
        var E = isEnum.call(this, key = toPrimitive(key, true));
        if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
        return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
    };
    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
        it = toIObject(it);
        key = toPrimitive(key, true);
        if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
        var D = gOPD(it, key);
        if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
        return D;
    };
    var $getOwnPropertyNames = function getOwnPropertyNames(it) {
        var names = gOPN(toIObject(it)), result = [], i = 0, key;
        while (names.length > i) {
            if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
        }
        return result;
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
        var IS_OP = it === ObjectProto, names = gOPN(IS_OP ? OPSymbols : toIObject(it)), result = [], i = 0, key;
        while (names.length > i) {
            if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
        }
        return result;
    };
    if (!USE_NATIVE) {
        $Symbol = function Symbol() {
            if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor!");
            var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
            var $set = function(value) {
                if (this === ObjectProto) $set.call(OPSymbols, value);
                if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                setSymbolDesc(this, tag, createDesc(1, value));
            };
            if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
                configurable: true,
                set: $set
            });
            return wrap(tag);
        };
        redefine($Symbol[PROTOTYPE], "toString", function toString() {
            return this._k;
        });
        $GOPD.f = $getOwnPropertyDescriptor;
        $DP.f = $defineProperty;
        __webpack_require__(64).f = gOPNExt.f = $getOwnPropertyNames;
        __webpack_require__(61).f = $propertyIsEnumerable;
        __webpack_require__(60).f = $getOwnPropertySymbols;
        if (DESCRIPTORS && !__webpack_require__(9)) {
            redefine(ObjectProto, "propertyIsEnumerable", $propertyIsEnumerable, true);
        }
        wksExt.f = function(name) {
            return wrap(wks(name));
        };
    }
    $export($export.G + $export.W + $export.F * !USE_NATIVE, {
        Symbol: $Symbol
    });
    for (var symbols = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), i = 0; symbols.length > i; ) wks(symbols[i++]);
    for (var symbols = $keys(wks.store), i = 0; symbols.length > i; ) wksDefine(symbols[i++]);
    $export($export.S + $export.F * !USE_NATIVE, "Symbol", {
        for: function(key) {
            return has(SymbolRegistry, key += "") ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
        },
        keyFor: function keyFor(key) {
            if (isSymbol(key)) return keyOf(SymbolRegistry, key);
            throw TypeError(key + " is not a symbol!");
        },
        useSetter: function() {
            setter = true;
        },
        useSimple: function() {
            setter = false;
        }
    });
    $export($export.S + $export.F * !USE_NATIVE, "Object", {
        create: $create,
        defineProperty: $defineProperty,
        defineProperties: $defineProperties,
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
        getOwnPropertyNames: $getOwnPropertyNames,
        getOwnPropertySymbols: $getOwnPropertySymbols
    });
    $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function() {
        var S = $Symbol();
        return _stringify([ S ]) != "[null]" || _stringify({
            a: S
        }) != "{}" || _stringify(Object(S)) != "{}";
    })), "JSON", {
        stringify: function stringify(it) {
            if (it === undefined || isSymbol(it)) return;
            var args = [ it ], i = 1, replacer, $replacer;
            while (arguments.length > i) args.push(arguments[i++]);
            replacer = args[1];
            if (typeof replacer == "function") $replacer = replacer;
            if ($replacer || !isArray(replacer)) replacer = function(key, value) {
                if ($replacer) value = $replacer.call(this, key, value);
                if (!isSymbol(value)) return value;
            };
            args[1] = replacer;
            return _stringify.apply($JSON, args);
        }
    });
    $Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
    setToStringTag($Symbol, "Symbol");
    setToStringTag(Math, "Math", true);
    setToStringTag(global.JSON, "JSON", true);
}, function(module, exports, __webpack_require__) {
    var META = __webpack_require__(41)("meta"), isObject = __webpack_require__(18), has = __webpack_require__(26), setDesc = __webpack_require__(16).f, id = 0;
    var isExtensible = Object.isExtensible || function() {
        return true;
    };
    var FREEZE = !__webpack_require__(21)(function() {
        return isExtensible(Object.preventExtensions({}));
    });
    var setMeta = function(it) {
        setDesc(it, META, {
            value: {
                i: "O" + ++id,
                w: {}
            }
        });
    };
    var fastKey = function(it, create) {
        if (!isObject(it)) return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
        if (!has(it, META)) {
            if (!isExtensible(it)) return "F";
            if (!create) return "E";
            setMeta(it);
        }
        return it[META].i;
    };
    var getWeak = function(it, create) {
        if (!has(it, META)) {
            if (!isExtensible(it)) return true;
            if (!create) return false;
            setMeta(it);
        }
        return it[META].w;
    };
    var onFreeze = function(it) {
        if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
        return it;
    };
    var meta = module.exports = {
        KEY: META,
        NEED: false,
        fastKey: fastKey,
        getWeak: getWeak,
        onFreeze: onFreeze
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(11), core = __webpack_require__(12), LIBRARY = __webpack_require__(9), wksExt = __webpack_require__(52), defineProperty = __webpack_require__(16).f;
    module.exports = function(name) {
        var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
        if (name.charAt(0) != "_" && !(name in $Symbol)) defineProperty($Symbol, name, {
            value: wksExt.f(name)
        });
    };
}, function(module, exports, __webpack_require__) {
    var getKeys = __webpack_require__(31), toIObject = __webpack_require__(33);
    module.exports = function(object, el) {
        var O = toIObject(object), keys = getKeys(O), length = keys.length, index = 0, key;
        while (length > index) if (O[key = keys[index++]] === el) return key;
    };
}, function(module, exports, __webpack_require__) {
    var getKeys = __webpack_require__(31), gOPS = __webpack_require__(60), pIE = __webpack_require__(61);
    module.exports = function(it) {
        var result = getKeys(it), getSymbols = gOPS.f;
        if (getSymbols) {
            var symbols = getSymbols(it), isEnum = pIE.f, i = 0, key;
            while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
        }
        return result;
    };
}, function(module, exports) {
    exports.f = Object.getOwnPropertySymbols;
}, function(module, exports) {
    exports.f = {}.propertyIsEnumerable;
}, function(module, exports, __webpack_require__) {
    var cof = __webpack_require__(35);
    module.exports = Array.isArray || function isArray(arg) {
        return cof(arg) == "Array";
    };
}, function(module, exports, __webpack_require__) {
    var toIObject = __webpack_require__(33), gOPN = __webpack_require__(64).f, toString = {}.toString;
    var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
    var getWindowNames = function(it) {
        try {
            return gOPN(it);
        } catch (e) {
            return windowNames.slice();
        }
    };
    module.exports.f = function getOwnPropertyNames(it) {
        return windowNames && toString.call(it) == "[object Window]" ? getWindowNames(it) : gOPN(toIObject(it));
    };
}, function(module, exports, __webpack_require__) {
    var $keys = __webpack_require__(32), hiddenKeys = __webpack_require__(42).concat("length", "prototype");
    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return $keys(O, hiddenKeys);
    };
}, function(module, exports, __webpack_require__) {
    var pIE = __webpack_require__(61), createDesc = __webpack_require__(24), toIObject = __webpack_require__(33), toPrimitive = __webpack_require__(23), has = __webpack_require__(26), IE8_DOM_DEFINE = __webpack_require__(19), gOPD = Object.getOwnPropertyDescriptor;
    exports.f = __webpack_require__(20) ? gOPD : function getOwnPropertyDescriptor(O, P) {
        O = toIObject(O);
        P = toPrimitive(P, true);
        if (IE8_DOM_DEFINE) try {
            return gOPD(O, P);
        } catch (e) {}
        if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
    };
}, function(module, exports) {}, function(module, exports, __webpack_require__) {
    __webpack_require__(57)("asyncIterator");
}, function(module, exports, __webpack_require__) {
    __webpack_require__(57)("observable");
}, function(module, exports, __webpack_require__) {
    module.exports = {
        default: __webpack_require__(70),
        __esModule: true
    };
}, function(module, exports, __webpack_require__) {
    __webpack_require__(71);
    module.exports = __webpack_require__(12).Object.keys;
}, function(module, exports, __webpack_require__) {
    var toObject = __webpack_require__(47), $keys = __webpack_require__(31);
    __webpack_require__(72)("keys", function() {
        return function keys(it) {
            return $keys(toObject(it));
        };
    });
}, function(module, exports, __webpack_require__) {
    var $export = __webpack_require__(10), core = __webpack_require__(12), fails = __webpack_require__(21);
    module.exports = function(KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY], exp = {};
        exp[KEY] = exec(fn);
        $export($export.S + $export.F * fails(function() {
            fn(1);
        }), "Object", exp);
    };
}, function(module, exports) {
    "use strict";
    exports.__esModule = true;
    exports.default = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    exports.__esModule = true;
    var _defineProperty = __webpack_require__(75);
    var _defineProperty2 = _interopRequireDefault(_defineProperty);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    exports.default = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                (0, _defineProperty2.default)(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
}, function(module, exports, __webpack_require__) {
    module.exports = {
        default: __webpack_require__(76),
        __esModule: true
    };
}, function(module, exports, __webpack_require__) {
    __webpack_require__(77);
    var $Object = __webpack_require__(12).Object;
    module.exports = function defineProperty(it, key, desc) {
        return $Object.defineProperty(it, key, desc);
    };
}, function(module, exports, __webpack_require__) {
    var $export = __webpack_require__(10);
    $export($export.S + $export.F * !__webpack_require__(20), "Object", {
        defineProperty: __webpack_require__(16).f
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MakeId = exports.SQLRecords = undefined;
    var _keys = __webpack_require__(69);
    var _keys2 = _interopRequireDefault(_keys);
    var _classCallCheck2 = __webpack_require__(73);
    var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
    var _createClass2 = __webpack_require__(74);
    var _createClass3 = _interopRequireDefault(_createClass2);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    function _insertValue(records) {
        var _this2 = this;
        this.db.transaction(function(tx) {
            var values = "";
            for (var i = 0; i < records.length; i++) {
                values += i == 0 ? "?" : ", ?";
            }
            tx.executeSql("INSERT INTO " + _this2.table.name + " (" + _this2.fields + ") VALUES (" + values + ")", records);
        });
    }
    function _deleteValue(_ref2, cb) {
        var _this3 = this;
        var field = _ref2.field, value = _ref2.value;
        function _ref3(e) {
            return cb("ok");
        }
        function _ref4(e) {
            return cb("error");
        }
        this.db.transaction(function(tx) {
            return tx.executeSql("DELETE FROM " + _this3.table.name + " WHERE " + field + " = ?", [ value ], _ref3, _ref4);
        });
    }
    function _getAllValues(cb) {
        var _this4 = this;
        var values = {};
        function _ref5(tx, results) {
            if (results.rows.length == 0) values = {}; else values = results.rows;
            if (cb) cb(values); else return values;
        }
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM " + _this4.table.name + " WHERE idRegistro = ? AND idPregunta = ?", [ _this4.app.idRegistro, _this4.app.idPregunta ], _ref5, null);
        });
    }
    function _getAllValuesAsId(cb) {
        this.getAllValues(function(rows) {
            var keys = (0, _keys2.default)(rows);
            var values = {};
            if (keys.length > 0) {
                for (var i = 0; i < keys.length; i++) {
                    values[rows[keys[i]].id] = rows[keys[i]];
                }
            }
            if (cb) cb(values); else return values;
        });
    }
    function _getValuesById(id, cb) {
        this.getValues({
            field: "id",
            value: id
        }, cb);
    }
    function _getValues(_ref6, cb) {
        var _this5 = this;
        var field = _ref6.field, value = _ref6.value;
        var val = {};
        function _ref7(tx, results) {
            if (results.rows.length == 0) val = {}; else val = results.rows;
            if (cb) cb(val); else return val;
        }
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM " + _this5.table.name + " WHERE " + field + " = ? AND idRegistro = ? AND idPregunta = ?", [ value, _this5.app.idRegistro, _this5.app.idPregunta ], _ref7, null);
        });
    }
    function _updateValue(_ref8, cb) {
        var _this6 = this;
        var field = _ref8.field, value = _ref8.value, fieldWhere = _ref8.fieldWhere, valueWhere = _ref8.valueWhere;
        var res = "error";
        function _ref9(e) {
            return res = "ok";
        }
        function _ref10(e) {
            return res = "error";
        }
        this.db.transaction(function(tx) {
            tx.executeSql("UPDATE " + _this6.table.name + " SET " + field + " = ? WHERE " + fieldWhere + " = ?", [ value, valueWhere ], _ref9, _ref10);
            if (cb) cb(res); else return res;
        });
    }
    function _ref12(res) {
        return res;
    }
    function _updateValueById(_ref11) {
        var field = _ref11.field, value = _ref11.value, id = _ref11.id;
        this.updateValue({
            field: field,
            value: value,
            fieldWhere: "id",
            valueWhere: id
        }, _ref12);
    }
    var SQLRecords = function() {
        function SQLRecords(_ref) {
            var _this = this;
            var name = _ref.name, description = _ref.description, size = _ref.size, table = _ref.table, app = _ref.app;
            (0, _classCallCheck3.default)(this, SQLRecords);
            this.db = window.openDatabase(name, "1.0.0", description || "Default description", size || 64 * 1024);
            this.table = table;
            this.fields = "";
            this.app = app || {
                idRegistro: MakeId(),
                idPregunta: MakeId()
            };
            for (var i = 0; i < this.table.fields.length; i++) {
                this.fields += i == 0 ? this.table.fields[i] : ", " + this.table.fields[i];
            }
            this.db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS " + _this.table.name + " (" + _this.fields + ")");
            });
        }
        (0, _createClass3.default)(SQLRecords, [ {
            key: "insertValue",
            value: _insertValue
        }, {
            key: "deleteValue",
            value: _deleteValue
        }, {
            key: "getAllValues",
            value: _getAllValues
        }, {
            key: "getAllValuesAsId",
            value: _getAllValuesAsId
        }, {
            key: "getValuesById",
            value: _getValuesById
        }, {
            key: "getValues",
            value: _getValues
        }, {
            key: "updateValue",
            value: _updateValue
        }, {
            key: "updateValueById",
            value: _updateValueById
        } ]);
        return SQLRecords;
    }();
    function MakeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    window.Helper = {
        SQLRecords: SQLRecords,
        MakeId: MakeId
    };
    exports.SQLRecords = SQLRecords;
    exports.MakeId = MakeId;
} ]);
(function(e) {
    var t = this["webpackHotUpdate"];
    this["webpackHotUpdate"] = function e(r, n) {
        S(r, n);
        if (t) t(r, n);
    };
    function r(e) {
        var t = document.getElementsByTagName("head")[0];
        var r = document.createElement("script");
        r.type = "text/javascript";
        r.charset = "utf-8";
        r.src = R.p + "" + e + "." + a + ".hot-update.js";
        t.appendChild(r);
    }
    function n(e) {
        if (typeof XMLHttpRequest === "undefined") return e(new Error("No browser support"));
        try {
            var t = new XMLHttpRequest();
            var r = R.p + "" + a + ".hot-update.json";
            t.open("GET", r, true);
            t.timeout = 1e4;
            t.send(null);
        } catch (t) {
            return e(t);
        }
        t.onreadystatechange = function() {
            if (t.readyState !== 4) return;
            if (t.status === 0) {
                e(new Error("Manifest request to " + r + " timed out."));
            } else if (t.status === 404) {
                e();
            } else if (t.status !== 200 && t.status !== 304) {
                e(new Error("Manifest request to " + r + " failed."));
            } else {
                try {
                    var n = JSON.parse(t.responseText);
                } catch (t) {
                    e(t);
                    return;
                }
                e(null, n);
            }
        };
    }
    var i = false;
    try {
        Object.defineProperty({}, "x", {
            get: function() {}
        });
        i = true;
    } catch (e) {}
    var o = true;
    var a = "f9dd7e28967d0bf252bb";
    var u = {};
    var s = [];
    function f(e) {
        var t = A[e];
        if (!t) return R;
        var r = function(r) {
            if (t.hot.active) {
                if (A[r]) {
                    if (A[r].parents.indexOf(e) < 0) A[r].parents.push(e);
                    if (t.children.indexOf(r) < 0) t.children.push(r);
                } else s = [ e ];
            } else {
                console.warn("[HMR] unexpected require(" + r + ") from disposed module " + e);
                s = [];
            }
            return R(r);
        };
        for (var n in R) {
            if (Object.prototype.hasOwnProperty.call(R, n)) {
                if (i) {
                    Object.defineProperty(r, n, function(e) {
                        return {
                            configurable: true,
                            enumerable: true,
                            get: function() {
                                return R[e];
                            },
                            set: function(t) {
                                R[e] = t;
                            }
                        };
                    }(n));
                } else {
                    r[n] = R[n];
                }
            }
        }
        function o(e, t) {
            if (d === "ready") p("prepare");
            h++;
            R.e(e, function() {
                try {
                    t.call(null, r);
                } finally {
                    n();
                }
                function n() {
                    h--;
                    if (d === "prepare") {
                        if (!y[e]) {
                            j(e);
                        }
                        if (h === 0 && v === 0) {
                            E();
                        }
                    }
                }
            });
        }
        if (i) {
            Object.defineProperty(r, "e", {
                enumerable: true,
                value: o
            });
        } else {
            r.e = o;
        }
        return r;
    }
    function c(e) {
        var t = {
            _acceptedDependencies: {},
            _declinedDependencies: {},
            _selfAccepted: false,
            _selfDeclined: false,
            _disposeHandlers: [],
            active: true,
            accept: function(e, r) {
                if (typeof e === "undefined") t._selfAccepted = true; else if (typeof e === "function") t._selfAccepted = e; else if (typeof e === "object") for (var n = 0; n < e.length; n++) t._acceptedDependencies[e[n]] = r; else t._acceptedDependencies[e] = r;
            },
            decline: function(e) {
                if (typeof e === "undefined") t._selfDeclined = true; else if (typeof e === "number") t._declinedDependencies[e] = true; else for (var r = 0; r < e.length; r++) t._declinedDependencies[e[r]] = true;
            },
            dispose: function(e) {
                t._disposeHandlers.push(e);
            },
            addDisposeHandler: function(e) {
                t._disposeHandlers.push(e);
            },
            removeDisposeHandler: function(e) {
                var r = t._disposeHandlers.indexOf(e);
                if (r >= 0) t._disposeHandlers.splice(r, 1);
            },
            check: _,
            apply: P,
            status: function(e) {
                if (!e) return d;
                l.push(e);
            },
            addStatusHandler: function(e) {
                l.push(e);
            },
            removeStatusHandler: function(e) {
                var t = l.indexOf(e);
                if (t >= 0) l.splice(t, 1);
            },
            data: u[e]
        };
        return t;
    }
    var l = [];
    var d = "idle";
    function p(e) {
        d = e;
        for (var t = 0; t < l.length; t++) l[t].call(null, e);
    }
    var v = 0;
    var h = 0;
    var y = {};
    var g = {};
    var m = {};
    var b;
    var w, x;
    function O(e) {
        var t = +e + "" === e;
        return t ? +e : e;
    }
    function _(e, t) {
        if (d !== "idle") throw new Error("check() is only allowed in idle status");
        if (typeof e === "function") {
            o = false;
            t = e;
        } else {
            o = e;
            t = t || function(e) {
                if (e) throw e;
            };
        }
        p("check");
        n(function(e, r) {
            if (e) return t(e);
            if (!r) {
                p("idle");
                t(null, null);
                return;
            }
            g = {};
            m = {};
            y = {};
            for (var n = 0; n < r.c.length; n++) m[r.c[n]] = true;
            x = r.h;
            p("prepare");
            b = t;
            w = {};
            var i = 0;
            {
                j(i);
            }
            if (d === "prepare" && h === 0 && v === 0) {
                E();
            }
        });
    }
    function S(e, t) {
        if (!m[e] || !g[e]) return;
        g[e] = false;
        for (var r in t) {
            if (Object.prototype.hasOwnProperty.call(t, r)) {
                w[r] = t[r];
            }
        }
        if (--v === 0 && h === 0) {
            E();
        }
    }
    function j(e) {
        if (!m[e]) {
            y[e] = true;
        } else {
            g[e] = true;
            v++;
            r(e);
        }
    }
    function E() {
        p("ready");
        var e = b;
        b = null;
        if (!e) return;
        if (o) {
            P(o, e);
        } else {
            var t = [];
            for (var r in w) {
                if (Object.prototype.hasOwnProperty.call(w, r)) {
                    t.push(O(r));
                }
            }
            e(null, t);
        }
    }
    function P(t, r) {
        if (d !== "ready") throw new Error("apply() is only allowed in ready status");
        if (typeof t === "function") {
            r = t;
            t = {};
        } else if (t && typeof t === "object") {
            r = r || function(e) {
                if (e) throw e;
            };
        } else {
            t = {};
            r = r || function(e) {
                if (e) throw e;
            };
        }
        function n(e) {
            var t = [ e ];
            var r = {};
            var n = t.slice();
            while (n.length > 0) {
                var o = n.pop();
                var e = A[o];
                if (!e || e.hot._selfAccepted) continue;
                if (e.hot._selfDeclined) {
                    return new Error("Aborted because of self decline: " + o);
                }
                if (o === 0) {
                    return;
                }
                for (var a = 0; a < e.parents.length; a++) {
                    var u = e.parents[a];
                    var s = A[u];
                    if (s.hot._declinedDependencies[o]) {
                        return new Error("Aborted because of declined dependency: " + o + " in " + u);
                    }
                    if (t.indexOf(u) >= 0) continue;
                    if (s.hot._acceptedDependencies[o]) {
                        if (!r[u]) r[u] = [];
                        i(r[u], [ o ]);
                        continue;
                    }
                    delete r[u];
                    t.push(u);
                    n.push(u);
                }
            }
            return [ t, r ];
        }
        function i(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                if (e.indexOf(n) < 0) e.push(n);
            }
        }
        var o = {};
        var f = [];
        var c = {};
        for (var l in w) {
            if (Object.prototype.hasOwnProperty.call(w, l)) {
                var v = O(l);
                var h = n(v);
                if (!h) {
                    if (t.ignoreUnaccepted) continue;
                    p("abort");
                    return r(new Error("Aborted because " + v + " is not accepted"));
                }
                if (h instanceof Error) {
                    p("abort");
                    return r(h);
                }
                c[v] = w[v];
                i(f, h[0]);
                for (var v in h[1]) {
                    if (Object.prototype.hasOwnProperty.call(h[1], v)) {
                        if (!o[v]) o[v] = [];
                        i(o[v], h[1][v]);
                    }
                }
            }
        }
        var y = [];
        for (var g = 0; g < f.length; g++) {
            var v = f[g];
            if (A[v] && A[v].hot._selfAccepted) y.push({
                module: v,
                errorHandler: A[v].hot._selfAccepted
            });
        }
        p("dispose");
        var m = f.slice();
        while (m.length > 0) {
            var v = m.pop();
            var b = A[v];
            if (!b) continue;
            var _ = {};
            var S = b.hot._disposeHandlers;
            for (var j = 0; j < S.length; j++) {
                var E = S[j];
                E(_);
            }
            u[v] = _;
            b.hot.active = false;
            delete A[v];
            for (var j = 0; j < b.children.length; j++) {
                var P = A[b.children[j]];
                if (!P) continue;
                var k = P.parents.indexOf(v);
                if (k >= 0) {
                    P.parents.splice(k, 1);
                }
            }
        }
        for (var v in o) {
            if (Object.prototype.hasOwnProperty.call(o, v)) {
                var b = A[v];
                var D = o[v];
                for (var j = 0; j < D.length; j++) {
                    var I = D[j];
                    var k = b.children.indexOf(I);
                    if (k >= 0) b.children.splice(k, 1);
                }
            }
        }
        p("apply");
        a = x;
        for (var v in c) {
            if (Object.prototype.hasOwnProperty.call(c, v)) {
                e[v] = c[v];
            }
        }
        var M = null;
        for (var v in o) {
            if (Object.prototype.hasOwnProperty.call(o, v)) {
                var b = A[v];
                var D = o[v];
                var T = [];
                for (var g = 0; g < D.length; g++) {
                    var I = D[g];
                    var E = b.hot._acceptedDependencies[I];
                    if (T.indexOf(E) >= 0) continue;
                    T.push(E);
                }
                for (var g = 0; g < T.length; g++) {
                    var E = T[g];
                    try {
                        E(o);
                    } catch (e) {
                        if (!M) M = e;
                    }
                }
            }
        }
        for (var g = 0; g < y.length; g++) {
            var V = y[g];
            var v = V.module;
            s = [ v ];
            try {
                R(v);
            } catch (e) {
                if (typeof V.errorHandler === "function") {
                    try {
                        V.errorHandler(e);
                    } catch (e) {
                        if (!M) M = e;
                    }
                } else if (!M) M = e;
            }
        }
        if (M) {
            p("fail");
            return r(M);
        }
        p("idle");
        r(null, f);
    }
    var A = {};
    function R(t) {
        if (A[t]) return A[t].exports;
        var r = A[t] = {
            exports: {},
            id: t,
            loaded: false,
            hot: c(t),
            parents: s,
            children: []
        };
        e[t].call(r.exports, r, r.exports, f(t));
        r.loaded = true;
        return r.exports;
    }
    R.m = e;
    R.c = A;
    R.p = "";
    R.h = function() {
        return a;
    };
    return f(0)(0);
})([ function(e, t, r) {
    "use strict";
    var n = r(1);
    var i = l(n);
    var o = r(69);
    var a = l(o);
    var u = r(73);
    var s = l(u);
    var f = r(74);
    var c = l(f);
    function l(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    }
    Array.prototype.equals = function(e) {
        if (!e) return false;
        if (this.length != e.length) return false;
        for (var t = 0, r = this.length; t < r; t++) {
            if (this[t] instanceof Array && e[t] instanceof Array) {
                if (!this[t].equals(e[t])) return false;
            } else if (this[t] != e[t]) {
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
        for (var e = this.length - 1; e >= 0; e--) {
            if (this[e] && this[e].parentElement) {
                this[e].parentElement.removeChild(this[e]);
            }
        }
    };
    function d(e) {
        var t = this;
        this.db.transaction(function(r) {
            var n = "";
            for (var i = 0; i < e.length; i++) {
                n += i == 0 ? "?" : ", ?";
            }
            r.executeSql("INSERT INTO " + t.table.name + " (" + t.fields + ") VALUES (" + n + ")", e);
        });
    }
    function p(e, t) {
        var r = this;
        var n = e.field, i = e.value;
        function o(e) {
            return t("ok");
        }
        function a(e) {
            return t("error");
        }
        this.db.transaction(function(e) {
            return e.executeSql("DELETE FROM " + r.table.name + " WHERE " + n + " = ?", [ i ], o, a);
        });
    }
    function v(e) {
        var t = this;
        var r = {};
        function n(t, n) {
            if (n.rows.length == 0) r = {}; else r = n.rows;
            if (e) e(r); else return r;
        }
        this.db.transaction(function(e) {
            e.executeSql("SELECT * FROM " + t.table.name + " WHERE idRegistro = ? AND idPregunta = ?", [ t.app.idRegistro, t.app.idPregunta ], n, null);
        });
    }
    function h(e) {
        this.getAllValues(function(t) {
            var r = (0, a.default)(t);
            var n = {};
            if (r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    n[t[r[i]].id] = t[r[i]];
                }
            }
            if (e) e(n); else return n;
        });
    }
    function y(e, t) {
        this.getValues({
            field: "id",
            value: e
        }, t);
    }
    function g(e, t) {
        var r = this;
        var n = e.field, i = e.value;
        var o = {};
        function a(e, r) {
            if (r.rows.length == 0) o = {}; else o = r.rows;
            if (t) t(o); else return o;
        }
        this.db.transaction(function(e) {
            e.executeSql("SELECT * FROM " + r.table.name + " WHERE " + n + " = ? AND idRegistro = ? AND idPregunta = ?", [ i, r.app.idRegistro, r.app.idPregunta ], a, null);
        });
    }
    function m(e, t) {
        var r = this;
        var n = e.field, i = e.value, o = e.fieldWhere, a = e.valueWhere;
        var u = "error";
        function s(e) {
            return u = "ok";
        }
        function f(e) {
            return u = "error";
        }
        this.db.transaction(function(e) {
            e.executeSql("UPDATE " + r.table.name + " SET " + n + " = ? WHERE " + o + " = ?", [ i, a ], s, f);
            if (t) t(u); else return u;
        });
    }
    function b(e) {
        return e;
    }
    function w(e) {
        var t = e.field, r = e.value, n = e.id;
        this.updateValue({
            field: t,
            value: r,
            fieldWhere: "id",
            valueWhere: n
        }, b);
    }
    var x = function() {
        function e(t) {
            var r = this;
            var n = t.name, i = t.description, o = t.size, a = t.table, u = t.app;
            (0, s.default)(this, e);
            this.db = window.openDatabase(n, "1.0.0", i, o);
            this.table = a;
            this.fields = "";
            this.app = u;
            for (var f = 0; f < this.table.fields.length; f++) {
                this.fields += f == 0 ? this.table.fields[f] : ", " + this.table.fields[f];
            }
            this.db.transaction(function(e) {
                e.executeSql("CREATE TABLE IF NOT EXISTS " + r.table.name + " (" + r.fields + ")");
            });
        }
        (0, c.default)(e, [ {
            key: "insertValue",
            value: d
        }, {
            key: "deleteValue",
            value: p
        }, {
            key: "getAllValues",
            value: v
        }, {
            key: "getAllValuesAsId",
            value: h
        }, {
            key: "getValuesById",
            value: y
        }, {
            key: "getValues",
            value: g
        }, {
            key: "updateValue",
            value: m
        }, {
            key: "updateValueById",
            value: w
        } ]);
        return e;
    }();
    function O(e) {
        return '<i class="material-icons md-18">' + e + "</i>";
    }
    function _() {
        var e = this.recordAudio.bind(this);
        var t = this.arguments;
        this.cordovaDir = cordova.file.externalDataDirectory;
        var r = $("" + this.arguments.selector);
        r.click(function(r) {
            return e(t);
        });
        this.strings = {
            recording: r.data("recording") || this.strings.recording,
            stoprecord: r.data("stoprecord") || this.strings.stoprecord,
            mjsrecord: r.data("mjsrecord") || this.strings.mjsrecord,
            mjsdivrecord: '<div class="mensaje alignAbsoluteCenter ' + this.arguments.idRegistro + " " + this.arguments.idPregunta + '">' + (r.data("mjsdivrecord") || this.strings.mjsdivrecord) + "</div>",
            alertmaxrecord: r.data("alertmaxrecord") || this.strings.alertmaxrecord,
            dialogconfirm: r.data("dialogconfirm") || this.strings.dialogconfirm,
            fields: r.data("fields") || this.strings.fields,
            tablename: r.data("tablename") || this.strings.tablename
        };
        this.icons = {
            playIcon: r.data("playicon") || this.icons.playIcon,
            stopIcon: r.data("stopicon") || this.icons.stopIcon,
            deleteIcon: r.data("deleteicon") || this.icons.deleteIcon
        };
        this.DB = new x({
            name: "RecordMedia",
            description: "Save records media",
            size: 64 * 1024,
            table: {
                name: this.strings.tablename,
                fields: this.strings.fields.split(",")
            },
            app: this.arguments
        });
        r.after(this.strings.mjsdivrecord);
        this.initView.bind(this)();
    }
    function S() {
        var e = this;
        $("#content-" + this.arguments.idRegistro + "_" + this.arguments.idPregunta).empty();
        this.DB.getAllValuesAsId(function(t) {
            var r = e.addAudioView.bind(e);
            var n = (0, a.default)(t);
            if (n.length > 0) {
                for (var i = 0; i < n.length; i++) {
                    t[n[i]].selector = e.arguments.selector;
                    t[n[i]].max = e.arguments.max;
                    r(t[n[i]]);
                }
            }
        });
    }
    function j(e, t) {
        $(".play." + e).html(t);
    }
    function E() {}
    function P(e) {
        console.log("Error getting pos=" + e);
    }
    function A(e) {
        var t = e.id, r = e.path, n = e.name, i = e.selector, o = e.idRegistro, a = e.idPregunta, u = e.max;
        var s = this.icons.playIcon;
        var f = this.icons.stopIcon;
        var c = this.changeIconView;
        var l = document.getElementsByClassName("range ex1-" + t)[0];
        var d = 100;
        var p = w.bind(this);
        var v = b.bind(this);
        var h = E;
        function y(e) {
            console.log("Success ", e);
            c(t, f);
        }
        function g(e) {
            c(t, s);
        }
        function m(e) {
            console.log("Status ", e);
            if (e == 4) p();
        }
        if (this.audio && this.audio.id == t && this.audio.estado != "pause") {
            p();
        } else if (this.audio && this.audio.id == t && this.audio.estado == "pause") {
            v();
        } else {
            this.audio = {};
            this.audio.media = new Media(r, y, g, m);
            v();
        }
        function b() {
            var e = this;
            this.audio.id = t;
            this.audio.estado = "play";
            this.audio.media.play();
            c(t, f);
            h = setInterval(function() {
                d = Math.round(e.audio.media.getDuration() * 10) / 10 * 100;
                d = d <= 0 ? -1 * d : d;
                l.max = d;
                e.audio.media.getCurrentPosition(function(r) {
                    var n = Math.round(r * 10) / 10 * 100;
                    if (n <= 0 || e.audio.estado == "pause") {
                        p();
                        e.DB.updateValueById({
                            field: "duration",
                            value: d / 100,
                            id: t
                        });
                    } else l.value = n;
                }, P);
                if (d == 0 || e.audio.estado == "pause") {
                    p();
                    e.DB.updateValueById({
                        field: "duration",
                        value: d / 100,
                        id: t
                    });
                }
            }, 500);
        }
        function w() {
            this.audio.estado = "pause";
            this.audio.media.pause();
            clearInterval(h);
            l.value = 0;
            c(t, s);
        }
    }
    function R() {
        console.log("error deleting the file " + error.code);
    }
    function k(e) {
        var t = this;
        var r = e.id, n = e.path, i = e.name, o = e.selector, a = e.idRegistro, u = e.idPregunta, s = e.max;
        if (confirm(this.strings.dialogconfirm + " " + i)) {
            window.resolveLocalFileSystemURL(this.cordovaDir, function(e) {
                e.getFile(i, {
                    create: true
                }, function(e) {
                    e.remove(function(e) {
                        t.DB.deleteValue({
                            field: "id",
                            value: r
                        }, function(r) {
                            if (r == "ok") {
                                t.initView();
                                console.log("File removed! ", e);
                            }
                        });
                    }, R);
                });
            });
        }
    }
    function D(e) {
        return console.log(e);
    }
    function I(e) {
        var t = this;
        var r = e.selector, n = e.idRegistro, o = e.idPregunta, u = e.max;
        var s = this.cordovaDir;
        var f = Date.now();
        var c = f + "_" + n + "_" + o + ".amr";
        var l = s + c;
        function d() {
            var e = t.addAudio.bind(t);
            t.record.recording = true;
            t.record.media = new Media(l, function(t) {
                return e({
                    id: f,
                    path: l,
                    name: c,
                    selector: r,
                    idRegistro: n,
                    idPregunta: o,
                    max: u
                });
            }, D);
            t.record.media.startRecord();
            t.startRecordView.bind(t)(r);
        }
        this.DB.getAllValuesAsId(function(e) {
            var n = e.length || ((typeof e === "undefined" ? "undefined" : (0, i.default)(e)) == "object" ? (0, 
            a.default)(e).length : 0);
            if (n >= u) {
                alert(t.strings.alertmaxrecord);
            } else {
                if (t.record.recording == true) {
                    t.record.media.stopRecord();
                    t.record.recording = false;
                    t.stopRecordView.bind(t)(r);
                } else {
                    d();
                }
            }
        });
    }
    function M(e) {
        var t = e.id, r = e.path, n = e.name, i = e.selector, o = e.idRegistro, a = e.idPregunta, u = e.max;
        this.DB.insertValue([ t, n, r, o, a, "audio", "4.0", new Date().getTime() ]);
        this.addAudioView.bind(this)({
            id: t,
            path: r,
            name: n,
            selector: i,
            idRegistro: o,
            idPregunta: a,
            max: u
        });
    }
    function T(e) {
        document.querySelector(e + "").innerHTML = this.strings.recording;
        $(".mensaje." + this.arguments.idRegistro + "." + this.arguments.idPregunta).css("visibility", "visible");
    }
    function V(e) {
        document.querySelector(e + "").innerHTML = this.strings.stoprecord;
        $(".mensaje." + this.arguments.idRegistro + "." + this.arguments.idPregunta).css("visibility", "hidden");
    }
    function H(e) {
        var t = this.playPauseAudio.bind(this);
        var r = this.removeAudio.bind(this);
        var n = $("div#content-" + e.idRegistro + "_" + e.idPregunta);
        var i = this.templateAudio.bind(this)(e);
        if (n.length <= 0) {
            $($("" + e.selector).parent().get(0)).prepend('<div id="content-' + e.idRegistro + "_" + e.idPregunta + '"></div>');
        }
        $("#content-" + e.idRegistro + "_" + e.idPregunta).prepend(i);
        $(".play." + e.id).on("click", function() {
            t(e);
        });
        $(".remove." + e.id).on("click", function() {
            r(e);
        });
    }
    function N(e) {
        return '<div class="MediaRecord-media">\n      <div class="MediaRecord-buttons-media">\n        <button data-url="' + e.path + '" class="play ' + e.id + '">' + this.icons.playIcon + '</button><input class="range ex1-' + e.id + '" type="range" value="0" min="0" max="100"/><button class="remove ' + e.id + '" data-url="' + e.path + '">' + this.icons.deleteIcon + "</button>\n      </div>\n    </div>";
    }
    var F = function() {
        function e(t) {
            var r = t.idRegistro, n = t.idPregunta, i = t.max, o = t.selector;
            (0, s.default)(this, e);
            this.arguments = {
                selector: o,
                idRegistro: r,
                idPregunta: n,
                max: i
            };
            this.audio = {};
            this.DB;
            this.cordovaDir = "";
            this.icons = {
                playIcon: this.getIcon("play_arrow"),
                stopIcon: this.getIcon("stop"),
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
        (0, c.default)(e, [ {
            key: "getIcon",
            value: O
        }, {
            key: "init",
            value: _
        }, {
            key: "initView",
            value: S
        }, {
            key: "changeIconView",
            value: j
        }, {
            key: "playPauseAudio",
            value: A
        }, {
            key: "removeAudio",
            value: k
        }, {
            key: "recordAudio",
            value: I
        }, {
            key: "addAudio",
            value: M
        }, {
            key: "startRecordView",
            value: T
        }, {
            key: "stopRecordView",
            value: V
        }, {
            key: "addAudioView",
            value: H
        }, {
            key: "templateAudio",
            value: N
        } ]);
        return e;
    }();
    function C(e) {
        var t = e.idRegistro, r = e.idPregunta, n = e.max;
        var i = this.selector;
        var o = new F({
            idRegistro: t,
            idPregunta: r,
            max: n,
            selector: i
        });
        o.init();
        return {
            element: this,
            app: o
        };
    }
    (function(e) {
        e.fn.recordMedia = C;
    })(jQuery);
}, function(e, t, r) {
    "use strict";
    t.__esModule = true;
    var n = r(2);
    var i = s(n);
    var o = r(53);
    var a = s(o);
    var u = typeof a.default === "function" && typeof i.default === "symbol" ? function(e) {
        return typeof e;
    } : function(e) {
        return e && typeof a.default === "function" && e.constructor === a.default && e !== a.default.prototype ? "symbol" : typeof e;
    };
    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    }
    t.default = typeof a.default === "function" && u(i.default) === "symbol" ? function(e) {
        return typeof e === "undefined" ? "undefined" : u(e);
    } : function(e) {
        return e && typeof a.default === "function" && e.constructor === a.default && e !== a.default.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : u(e);
    };
}, function(e, t, r) {
    e.exports = {
        default: r(3),
        __esModule: true
    };
}, function(e, t, r) {
    r(4);
    r(48);
    e.exports = r(52).f("iterator");
}, function(e, t, r) {
    "use strict";
    var n = r(5)(true);
    r(8)(String, "String", function(e) {
        this._t = String(e);
        this._i = 0;
    }, function() {
        var e = this._t, t = this._i, r;
        if (t >= e.length) return {
            value: undefined,
            done: true
        };
        r = n(e, t);
        this._i += r.length;
        return {
            value: r,
            done: false
        };
    });
}, function(e, t, r) {
    var n = r(6), i = r(7);
    e.exports = function(e) {
        return function(t, r) {
            var o = String(i(t)), a = n(r), u = o.length, s, f;
            if (a < 0 || a >= u) return e ? "" : undefined;
            s = o.charCodeAt(a);
            return s < 55296 || s > 56319 || a + 1 === u || (f = o.charCodeAt(a + 1)) < 56320 || f > 57343 ? e ? o.charAt(a) : s : e ? o.slice(a, a + 2) : (s - 55296 << 10) + (f - 56320) + 65536;
        };
    };
}, function(e, t) {
    var r = Math.ceil, n = Math.floor;
    e.exports = function(e) {
        return isNaN(e = +e) ? 0 : (e > 0 ? n : r)(e);
    };
}, function(e, t) {
    e.exports = function(e) {
        if (e == undefined) throw TypeError("Can't call method on  " + e);
        return e;
    };
}, function(e, t, r) {
    "use strict";
    var n = r(9), i = r(10), o = r(25), a = r(15), u = r(26), s = r(27), f = r(28), c = r(44), l = r(46), d = r(45)("iterator"), p = !([].keys && "next" in [].keys()), v = "@@iterator", h = "keys", y = "values";
    var g = function() {
        return this;
    };
    e.exports = function(e, t, r, m, b, w, x) {
        f(r, t, m);
        var O = function(e) {
            if (!p && e in E) return E[e];
            switch (e) {
              case h:
                return function t() {
                    return new r(this, e);
                };

              case y:
                return function t() {
                    return new r(this, e);
                };
            }
            return function t() {
                return new r(this, e);
            };
        };
        var _ = t + " Iterator", S = b == y, j = false, E = e.prototype, P = E[d] || E[v] || b && E[b], A = P || O(b), R = b ? !S ? A : O("entries") : undefined, k = t == "Array" ? E.entries || P : P, D, I, M;
        if (k) {
            M = l(k.call(new e()));
            if (M !== Object.prototype) {
                c(M, _, true);
                if (!n && !u(M, d)) a(M, d, g);
            }
        }
        if (S && P && P.name !== y) {
            j = true;
            A = function e() {
                return P.call(this);
            };
        }
        if ((!n || x) && (p || j || !E[d])) {
            a(E, d, A);
        }
        s[t] = A;
        s[_] = g;
        if (b) {
            D = {
                values: S ? A : O(y),
                keys: w ? A : O(h),
                entries: R
            };
            if (x) for (I in D) {
                if (!(I in E)) o(E, I, D[I]);
            } else i(i.P + i.F * (p || j), t, D);
        }
        return D;
    };
}, function(e, t) {
    e.exports = true;
}, function(e, t, r) {
    var n = r(11), i = r(12), o = r(13), a = r(15), u = "prototype";
    var s = function(e, t, r) {
        var f = e & s.F, c = e & s.G, l = e & s.S, d = e & s.P, p = e & s.B, v = e & s.W, h = c ? i : i[t] || (i[t] = {}), y = h[u], g = c ? n : l ? n[t] : (n[t] || {})[u], m, b, w;
        if (c) r = t;
        for (m in r) {
            b = !f && g && g[m] !== undefined;
            if (b && m in h) continue;
            w = b ? g[m] : r[m];
            h[m] = c && typeof g[m] != "function" ? r[m] : p && b ? o(w, n) : v && g[m] == w ? function(e) {
                var t = function(t, r, n) {
                    if (this instanceof e) {
                        switch (arguments.length) {
                          case 0:
                            return new e();

                          case 1:
                            return new e(t);

                          case 2:
                            return new e(t, r);
                        }
                        return new e(t, r, n);
                    }
                    return e.apply(this, arguments);
                };
                t[u] = e[u];
                return t;
            }(w) : d && typeof w == "function" ? o(Function.call, w) : w;
            if (d) {
                (h.virtual || (h.virtual = {}))[m] = w;
                if (e & s.R && y && !y[m]) a(y, m, w);
            }
        }
    };
    s.F = 1;
    s.G = 2;
    s.S = 4;
    s.P = 8;
    s.B = 16;
    s.W = 32;
    s.U = 64;
    s.R = 128;
    e.exports = s;
}, function(e, t) {
    var r = e.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
    if (typeof __g == "number") __g = r;
}, function(e, t) {
    var r = e.exports = {
        version: "2.4.0"
    };
    if (typeof __e == "number") __e = r;
}, function(e, t, r) {
    var n = r(14);
    e.exports = function(e, t, r) {
        n(e);
        if (t === undefined) return e;
        switch (r) {
          case 1:
            return function(r) {
                return e.call(t, r);
            };

          case 2:
            return function(r, n) {
                return e.call(t, r, n);
            };

          case 3:
            return function(r, n, i) {
                return e.call(t, r, n, i);
            };
        }
        return function() {
            return e.apply(t, arguments);
        };
    };
}, function(e, t) {
    e.exports = function(e) {
        if (typeof e != "function") throw TypeError(e + " is not a function!");
        return e;
    };
}, function(e, t, r) {
    var n = r(16), i = r(24);
    e.exports = r(20) ? function(e, t, r) {
        return n.f(e, t, i(1, r));
    } : function(e, t, r) {
        e[t] = r;
        return e;
    };
}, function(e, t, r) {
    var n = r(17), i = r(19), o = r(23), a = Object.defineProperty;
    t.f = r(20) ? Object.defineProperty : function e(t, r, u) {
        n(t);
        r = o(r, true);
        n(u);
        if (i) try {
            return a(t, r, u);
        } catch (e) {}
        if ("get" in u || "set" in u) throw TypeError("Accessors not supported!");
        if ("value" in u) t[r] = u.value;
        return t;
    };
}, function(e, t, r) {
    var n = r(18);
    e.exports = function(e) {
        if (!n(e)) throw TypeError(e + " is not an object!");
        return e;
    };
}, function(e, t) {
    e.exports = function(e) {
        return typeof e === "object" ? e !== null : typeof e === "function";
    };
}, function(e, t, r) {
    e.exports = !r(20) && !r(21)(function() {
        return Object.defineProperty(r(22)("div"), "a", {
            get: function() {
                return 7;
            }
        }).a != 7;
    });
}, function(e, t, r) {
    e.exports = !r(21)(function() {
        return Object.defineProperty({}, "a", {
            get: function() {
                return 7;
            }
        }).a != 7;
    });
}, function(e, t) {
    e.exports = function(e) {
        try {
            return !!e();
        } catch (e) {
            return true;
        }
    };
}, function(e, t, r) {
    var n = r(18), i = r(11).document, o = n(i) && n(i.createElement);
    e.exports = function(e) {
        return o ? i.createElement(e) : {};
    };
}, function(e, t, r) {
    var n = r(18);
    e.exports = function(e, t) {
        if (!n(e)) return e;
        var r, i;
        if (t && typeof (r = e.toString) == "function" && !n(i = r.call(e))) return i;
        if (typeof (r = e.valueOf) == "function" && !n(i = r.call(e))) return i;
        if (!t && typeof (r = e.toString) == "function" && !n(i = r.call(e))) return i;
        throw TypeError("Can't convert object to primitive value");
    };
}, function(e, t) {
    e.exports = function(e, t) {
        return {
            enumerable: !(e & 1),
            configurable: !(e & 2),
            writable: !(e & 4),
            value: t
        };
    };
}, function(e, t, r) {
    e.exports = r(15);
}, function(e, t) {
    var r = {}.hasOwnProperty;
    e.exports = function(e, t) {
        return r.call(e, t);
    };
}, function(e, t) {
    e.exports = {};
}, function(e, t, r) {
    "use strict";
    var n = r(29), i = r(24), o = r(44), a = {};
    r(15)(a, r(45)("iterator"), function() {
        return this;
    });
    e.exports = function(e, t, r) {
        e.prototype = n(a, {
            next: i(1, r)
        });
        o(e, t + " Iterator");
    };
}, function(e, t, r) {
    var n = r(17), i = r(30), o = r(42), a = r(39)("IE_PROTO"), u = function() {}, s = "prototype";
    var f = function() {
        var e = r(22)("iframe"), t = o.length, n = "<", i = ">", a;
        e.style.display = "none";
        r(43).appendChild(e);
        e.src = "javascript:";
        a = e.contentWindow.document;
        a.open();
        a.write(n + "script" + i + "document.F=Object" + n + "/script" + i);
        a.close();
        f = a.F;
        while (t--) delete f[s][o[t]];
        return f();
    };
    e.exports = Object.create || function e(t, r) {
        var o;
        if (t !== null) {
            u[s] = n(t);
            o = new u();
            u[s] = null;
            o[a] = t;
        } else o = f();
        return r === undefined ? o : i(o, r);
    };
}, function(e, t, r) {
    var n = r(16), i = r(17), o = r(31);
    e.exports = r(20) ? Object.defineProperties : function e(t, r) {
        i(t);
        var a = o(r), u = a.length, s = 0, f;
        while (u > s) n.f(t, f = a[s++], r[f]);
        return t;
    };
}, function(e, t, r) {
    var n = r(32), i = r(42);
    e.exports = Object.keys || function e(t) {
        return n(t, i);
    };
}, function(e, t, r) {
    var n = r(26), i = r(33), o = r(36)(false), a = r(39)("IE_PROTO");
    e.exports = function(e, t) {
        var r = i(e), u = 0, s = [], f;
        for (f in r) if (f != a) n(r, f) && s.push(f);
        while (t.length > u) if (n(r, f = t[u++])) {
            ~o(s, f) || s.push(f);
        }
        return s;
    };
}, function(e, t, r) {
    var n = r(34), i = r(7);
    e.exports = function(e) {
        return n(i(e));
    };
}, function(e, t, r) {
    var n = r(35);
    e.exports = Object("z").propertyIsEnumerable(0) ? Object : function(e) {
        return n(e) == "String" ? e.split("") : Object(e);
    };
}, function(e, t) {
    var r = {}.toString;
    e.exports = function(e) {
        return r.call(e).slice(8, -1);
    };
}, function(e, t, r) {
    var n = r(33), i = r(37), o = r(38);
    e.exports = function(e) {
        return function(t, r, a) {
            var u = n(t), s = i(u.length), f = o(a, s), c;
            if (e && r != r) while (s > f) {
                c = u[f++];
                if (c != c) return true;
            } else for (;s > f; f++) if (e || f in u) {
                if (u[f] === r) return e || f || 0;
            }
            return !e && -1;
        };
    };
}, function(e, t, r) {
    var n = r(6), i = Math.min;
    e.exports = function(e) {
        return e > 0 ? i(n(e), 9007199254740991) : 0;
    };
}, function(e, t, r) {
    var n = r(6), i = Math.max, o = Math.min;
    e.exports = function(e, t) {
        e = n(e);
        return e < 0 ? i(e + t, 0) : o(e, t);
    };
}, function(e, t, r) {
    var n = r(40)("keys"), i = r(41);
    e.exports = function(e) {
        return n[e] || (n[e] = i(e));
    };
}, function(e, t, r) {
    var n = r(11), i = "__core-js_shared__", o = n[i] || (n[i] = {});
    e.exports = function(e) {
        return o[e] || (o[e] = {});
    };
}, function(e, t) {
    var r = 0, n = Math.random();
    e.exports = function(e) {
        return "Symbol(".concat(e === undefined ? "" : e, ")_", (++r + n).toString(36));
    };
}, function(e, t) {
    e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
}, function(e, t, r) {
    e.exports = r(11).document && document.documentElement;
}, function(e, t, r) {
    var n = r(16).f, i = r(26), o = r(45)("toStringTag");
    e.exports = function(e, t, r) {
        if (e && !i(e = r ? e : e.prototype, o)) n(e, o, {
            configurable: true,
            value: t
        });
    };
}, function(e, t, r) {
    var n = r(40)("wks"), i = r(41), o = r(11).Symbol, a = typeof o == "function";
    var u = e.exports = function(e) {
        return n[e] || (n[e] = a && o[e] || (a ? o : i)("Symbol." + e));
    };
    u.store = n;
}, function(e, t, r) {
    var n = r(26), i = r(47), o = r(39)("IE_PROTO"), a = Object.prototype;
    e.exports = Object.getPrototypeOf || function(e) {
        e = i(e);
        if (n(e, o)) return e[o];
        if (typeof e.constructor == "function" && e instanceof e.constructor) {
            return e.constructor.prototype;
        }
        return e instanceof Object ? a : null;
    };
}, function(e, t, r) {
    var n = r(7);
    e.exports = function(e) {
        return Object(n(e));
    };
}, function(e, t, r) {
    r(49);
    var n = r(11), i = r(15), o = r(27), a = r(45)("toStringTag");
    for (var u = [ "NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList" ], s = 0; s < 5; s++) {
        var f = u[s], c = n[f], l = c && c.prototype;
        if (l && !l[a]) i(l, a, f);
        o[f] = o.Array;
    }
}, function(e, t, r) {
    "use strict";
    var n = r(50), i = r(51), o = r(27), a = r(33);
    e.exports = r(8)(Array, "Array", function(e, t) {
        this._t = a(e);
        this._i = 0;
        this._k = t;
    }, function() {
        var e = this._t, t = this._k, r = this._i++;
        if (!e || r >= e.length) {
            this._t = undefined;
            return i(1);
        }
        if (t == "keys") return i(0, r);
        if (t == "values") return i(0, e[r]);
        return i(0, [ r, e[r] ]);
    }, "values");
    o.Arguments = o.Array;
    n("keys");
    n("values");
    n("entries");
}, function(e, t) {
    e.exports = function() {};
}, function(e, t) {
    e.exports = function(e, t) {
        return {
            value: t,
            done: !!e
        };
    };
}, function(e, t, r) {
    t.f = r(45);
}, function(e, t, r) {
    e.exports = {
        default: r(54),
        __esModule: true
    };
}, function(e, t, r) {
    r(55);
    r(66);
    r(67);
    r(68);
    e.exports = r(12).Symbol;
}, function(e, t, r) {
    "use strict";
    var n = r(11), i = r(26), o = r(20), a = r(10), u = r(25), s = r(56).KEY, f = r(21), c = r(40), l = r(44), d = r(41), p = r(45), v = r(52), h = r(57), y = r(58), g = r(59), m = r(62), b = r(17), w = r(33), x = r(23), O = r(24), _ = r(29), S = r(63), j = r(65), E = r(16), P = r(31), A = j.f, R = E.f, k = S.f, D = n.Symbol, I = n.JSON, M = I && I.stringify, T = "prototype", V = p("_hidden"), H = p("toPrimitive"), N = {}.propertyIsEnumerable, F = c("symbol-registry"), C = c("symbols"), L = c("op-symbols"), B = Object[T], q = typeof D == "function", W = n.QObject;
    var $ = !W || !W[T] || !W[T].findChild;
    var U = o && f(function() {
        return _(R({}, "a", {
            get: function() {
                return R(this, "a", {
                    value: 7
                }).a;
            }
        })).a != 7;
    }) ? function(e, t, r) {
        var n = A(B, t);
        if (n) delete B[t];
        R(e, t, r);
        if (n && e !== B) R(B, t, n);
    } : R;
    var G = function(e) {
        var t = C[e] = _(D[T]);
        t._k = e;
        return t;
    };
    var J = q && typeof D.iterator == "symbol" ? function(e) {
        return typeof e == "symbol";
    } : function(e) {
        return e instanceof D;
    };
    var z = function e(t, r, n) {
        if (t === B) z(L, r, n);
        b(t);
        r = x(r, true);
        b(n);
        if (i(C, r)) {
            if (!n.enumerable) {
                if (!i(t, V)) R(t, V, O(1, {}));
                t[V][r] = true;
            } else {
                if (i(t, V) && t[V][r]) t[V][r] = false;
                n = _(n, {
                    enumerable: O(0, false)
                });
            }
            return U(t, r, n);
        }
        return R(t, r, n);
    };
    var K = function e(t, r) {
        b(t);
        var n = g(r = w(r)), i = 0, o = n.length, a;
        while (o > i) z(t, a = n[i++], r[a]);
        return t;
    };
    var X = function e(t, r) {
        return r === undefined ? _(t) : K(_(t), r);
    };
    var Q = function e(t) {
        var r = N.call(this, t = x(t, true));
        if (this === B && i(C, t) && !i(L, t)) return false;
        return r || !i(this, t) || !i(C, t) || i(this, V) && this[V][t] ? r : true;
    };
    var Y = function e(t, r) {
        t = w(t);
        r = x(r, true);
        if (t === B && i(C, r) && !i(L, r)) return;
        var n = A(t, r);
        if (n && i(C, r) && !(i(t, V) && t[V][r])) n.enumerable = true;
        return n;
    };
    var Z = function e(t) {
        var r = k(w(t)), n = [], o = 0, a;
        while (r.length > o) {
            if (!i(C, a = r[o++]) && a != V && a != s) n.push(a);
        }
        return n;
    };
    var ee = function e(t) {
        var r = t === B, n = k(r ? L : w(t)), o = [], a = 0, u;
        while (n.length > a) {
            if (i(C, u = n[a++]) && (r ? i(B, u) : true)) o.push(C[u]);
        }
        return o;
    };
    if (!q) {
        D = function e() {
            if (this instanceof D) throw TypeError("Symbol is not a constructor!");
            var t = d(arguments.length > 0 ? arguments[0] : undefined);
            var r = function(e) {
                if (this === B) r.call(L, e);
                if (i(this, V) && i(this[V], t)) this[V][t] = false;
                U(this, t, O(1, e));
            };
            if (o && $) U(B, t, {
                configurable: true,
                set: r
            });
            return G(t);
        };
        u(D[T], "toString", function e() {
            return this._k;
        });
        j.f = Y;
        E.f = z;
        r(64).f = S.f = Z;
        r(61).f = Q;
        r(60).f = ee;
        if (o && !r(9)) {
            u(B, "propertyIsEnumerable", Q, true);
        }
        v.f = function(e) {
            return G(p(e));
        };
    }
    a(a.G + a.W + a.F * !q, {
        Symbol: D
    });
    for (var te = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), re = 0; te.length > re; ) p(te[re++]);
    for (var te = P(p.store), re = 0; te.length > re; ) h(te[re++]);
    a(a.S + a.F * !q, "Symbol", {
        for: function(e) {
            return i(F, e += "") ? F[e] : F[e] = D(e);
        },
        keyFor: function e(t) {
            if (J(t)) return y(F, t);
            throw TypeError(t + " is not a symbol!");
        },
        useSetter: function() {
            $ = true;
        },
        useSimple: function() {
            $ = false;
        }
    });
    a(a.S + a.F * !q, "Object", {
        create: X,
        defineProperty: z,
        defineProperties: K,
        getOwnPropertyDescriptor: Y,
        getOwnPropertyNames: Z,
        getOwnPropertySymbols: ee
    });
    I && a(a.S + a.F * (!q || f(function() {
        var e = D();
        return M([ e ]) != "[null]" || M({
            a: e
        }) != "{}" || M(Object(e)) != "{}";
    })), "JSON", {
        stringify: function e(t) {
            if (t === undefined || J(t)) return;
            var r = [ t ], n = 1, i, o;
            while (arguments.length > n) r.push(arguments[n++]);
            i = r[1];
            if (typeof i == "function") o = i;
            if (o || !m(i)) i = function(e, t) {
                if (o) t = o.call(this, e, t);
                if (!J(t)) return t;
            };
            r[1] = i;
            return M.apply(I, r);
        }
    });
    D[T][H] || r(15)(D[T], H, D[T].valueOf);
    l(D, "Symbol");
    l(Math, "Math", true);
    l(n.JSON, "JSON", true);
}, function(e, t, r) {
    var n = r(41)("meta"), i = r(18), o = r(26), a = r(16).f, u = 0;
    var s = Object.isExtensible || function() {
        return true;
    };
    var f = !r(21)(function() {
        return s(Object.preventExtensions({}));
    });
    var c = function(e) {
        a(e, n, {
            value: {
                i: "O" + ++u,
                w: {}
            }
        });
    };
    var l = function(e, t) {
        if (!i(e)) return typeof e == "symbol" ? e : (typeof e == "string" ? "S" : "P") + e;
        if (!o(e, n)) {
            if (!s(e)) return "F";
            if (!t) return "E";
            c(e);
        }
        return e[n].i;
    };
    var d = function(e, t) {
        if (!o(e, n)) {
            if (!s(e)) return true;
            if (!t) return false;
            c(e);
        }
        return e[n].w;
    };
    var p = function(e) {
        if (f && v.NEED && s(e) && !o(e, n)) c(e);
        return e;
    };
    var v = e.exports = {
        KEY: n,
        NEED: false,
        fastKey: l,
        getWeak: d,
        onFreeze: p
    };
}, function(e, t, r) {
    var n = r(11), i = r(12), o = r(9), a = r(52), u = r(16).f;
    e.exports = function(e) {
        var t = i.Symbol || (i.Symbol = o ? {} : n.Symbol || {});
        if (e.charAt(0) != "_" && !(e in t)) u(t, e, {
            value: a.f(e)
        });
    };
}, function(e, t, r) {
    var n = r(31), i = r(33);
    e.exports = function(e, t) {
        var r = i(e), o = n(r), a = o.length, u = 0, s;
        while (a > u) if (r[s = o[u++]] === t) return s;
    };
}, function(e, t, r) {
    var n = r(31), i = r(60), o = r(61);
    e.exports = function(e) {
        var t = n(e), r = i.f;
        if (r) {
            var a = r(e), u = o.f, s = 0, f;
            while (a.length > s) if (u.call(e, f = a[s++])) t.push(f);
        }
        return t;
    };
}, function(e, t) {
    t.f = Object.getOwnPropertySymbols;
}, function(e, t) {
    t.f = {}.propertyIsEnumerable;
}, function(e, t, r) {
    var n = r(35);
    e.exports = Array.isArray || function e(t) {
        return n(t) == "Array";
    };
}, function(e, t, r) {
    var n = r(33), i = r(64).f, o = {}.toString;
    var a = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
    var u = function(e) {
        try {
            return i(e);
        } catch (e) {
            return a.slice();
        }
    };
    e.exports.f = function e(t) {
        return a && o.call(t) == "[object Window]" ? u(t) : i(n(t));
    };
}, function(e, t, r) {
    var n = r(32), i = r(42).concat("length", "prototype");
    t.f = Object.getOwnPropertyNames || function e(t) {
        return n(t, i);
    };
}, function(e, t, r) {
    var n = r(61), i = r(24), o = r(33), a = r(23), u = r(26), s = r(19), f = Object.getOwnPropertyDescriptor;
    t.f = r(20) ? f : function e(t, r) {
        t = o(t);
        r = a(r, true);
        if (s) try {
            return f(t, r);
        } catch (e) {}
        if (u(t, r)) return i(!n.f.call(t, r), t[r]);
    };
}, function(e, t) {}, function(e, t, r) {
    r(57)("asyncIterator");
}, function(e, t, r) {
    r(57)("observable");
}, function(e, t, r) {
    e.exports = {
        default: r(70),
        __esModule: true
    };
}, function(e, t, r) {
    r(71);
    e.exports = r(12).Object.keys;
}, function(e, t, r) {
    var n = r(47), i = r(31);
    r(72)("keys", function() {
        return function e(t) {
            return i(n(t));
        };
    });
}, function(e, t, r) {
    var n = r(10), i = r(12), o = r(21);
    e.exports = function(e, t) {
        var r = (i.Object || {})[e] || Object[e], a = {};
        a[e] = t(r);
        n(n.S + n.F * o(function() {
            r(1);
        }), "Object", a);
    };
}, function(e, t) {
    "use strict";
    t.__esModule = true;
    t.default = function(e, t) {
        if (!(e instanceof t)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };
}, function(e, t, r) {
    "use strict";
    t.__esModule = true;
    var n = r(75);
    var i = o(n);
    function o(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    }
    t.default = function() {
        function e(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || false;
                n.configurable = true;
                if ("value" in n) n.writable = true;
                (0, i.default)(e, n.key, n);
            }
        }
        return function(t, r, n) {
            if (r) e(t.prototype, r);
            if (n) e(t, n);
            return t;
        };
    }();
}, function(e, t, r) {
    e.exports = {
        default: r(76),
        __esModule: true
    };
}, function(e, t, r) {
    r(77);
    var n = r(12).Object;
    e.exports = function e(t, r, i) {
        return n.defineProperty(t, r, i);
    };
}, function(e, t, r) {
    var n = r(10);
    n(n.S + n.F * !r(20), "Object", {
        defineProperty: r(16).f
    });
} ]);
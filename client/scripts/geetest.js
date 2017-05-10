/*! gt-curtain - v5.1.0 - 2015-10-16
 * Copyright (c) 2015 ; Licensed  */
"use strict";
! function(a, b) {
  a.Geetest = b(a, a.jQuery || a.Zepto || a.ender || a.$), "function" == typeof define && define.amd ? define("Geetest", ["jquery"], function(c) {
    return b(a, c)
  }) : "undefined" != typeof exports && (exports = b(a))
}(this, function(a, b) {
  var c = {};
  c.serial = function(a, b) {
    var c = a.length,
      d = [!1],
      e = 1,
      f = function(g, h) {
        return h ? (d = [!0], void b.apply(null, d)) : (d[e] = g, e += 1, void(e > c ? b.apply(null, d) : a[e - 1](f)))
      };
    a[0](f)
  }, c.parallel = function(a, b) {
    for (var c = a.length, d = [!1], e = 0, f = function(a) {
      return function(f, g) {
        if (-1 !== e) {
          if (g) return d = [!0], b.apply(null, d), d = [], void(e = -1);
          e += 1, d[a] = f, e === c && b.apply(null, d)
        }
      }
    }, g = 1; c >= g; g += 1) a[g - 1](f(g), g)
  };
  var d = {},
    e = {},
    f = function(a) {
      return e[a] && e[a].content
    },
    g = function(a, b, c) {
      b in e ? "loaded" === e[b].status ? c(e[b].content) : "loading" === e[b].status ? h._once(b + "Loaded", function() {
        c(e[b].content)
      }) : t("module " + b + " lost!") : (e[b] = {
        status: "loading"
      }, C(a, "static/js/" + b.toLowerCase() + "." + v[b] + ".js", function(d) {
        return d ? void t("module " + b + " can not loaded") : void g(a, b, c)
      }))
    };
  d._define = function(a, b, c) {
    var d;
    if (s(b)) {
      for (var g = [], i = 0; i < b.length; i++) g[i] = f(b[i]);
      d = c.apply(null, g)
    } else d = b();
    return e[a] = {}, e[a].status = "loaded", e[a].content = d, h._broadcast(a + "Loaded"), d
  };
  var h = {};
  h._list = {}, h._list.global = {}, h._addItem = function(a) {
    h._list[a] = {}
  }, h._on = function(a, b, c) {
    return c ? (h._list[c][a] || (h._list[c][a] = []), void h._list[c][a].push({
      once: !1,
      callback: b
    })) : (h._list.global[a] || (h._list.global[a] = []), void h._list.global[a].push({
      once: !1,
      callback: b
    }))
  }, h._once = function(a, b, c) {
    c ? (h._list[c][a] || (h._list[c][a] = []), h._list[c][a].push({
      once: !0,
      callback: b
    })) : (h._list.global[a] || (h._list.global[a] = []), h._list.global[a].push({
      once: !0,
      callback: b
    }))
  }, h._remove = function(a, b, c) {
    var d;
    d = c ? h._list[c][a] : h._list.global[a], d.splice(m(b, d), 1)
  }, h._destroy = function(a, b) {
    n(h._list, b)
  }, h._emit = function(a, b) {
    var c, d = h._list[b][a];
    if (d)
      for (var e = 0; e < d.length; e++) c = d[e], c && (c.callback.call(K._get("self", b)), c.once && (h._remove(a, c, b), e -= 1))
  }, h._broadcast = function(a) {
    var b, c = h._list.global[a];
    if (c)
      for (var d = 0; d < c.length; d++) b = c[d], b && (b.callback(), b.once && (h._remove(a, b), d -= 1))
  };
  var i = function(a, b) {
      var c = b || {};
      for (var d in a) a.hasOwnProperty(d) && (c[d] = a[d]);
      return c
    },
    j = function(a) {
      var b = [];
      for (var c in a) a.hasOwnProperty(c) && b.push(c + "=" + a[c]);
      return b.join("&")
    },
    k = function(a) {
      return "function" == typeof a
    },
    l = function() {
      return parseInt(1e4 * Math.random()) + (new Date).valueOf()
    },
    m = function(a, b, c) {
      var d, e = Array.prototype.indexOf;
      if (b) {
        if (e) return e.call(b, a, c);
        for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
          if (c in b && b[c] === a) return c
      }
      return -1
    },
    n = function(a, b) {
      a[b] = void 0;
      try {
        delete a[b]
      } catch (c) {}
    },
    o = function(a, b) {
      try {
        a.innerHTML = b
      } catch (c) {
        a.innerText = b
      }
    },
    p = function(a, b) {
      return Array.prototype.slice.call(a, b)
    },
    q = function(a, b) {
      if (a === b) return !0;
      if (null == a || null == b) return !1;
      if (a.length != b.length) return !1;
      for (var c = 0; c < a.length; ++c)
        if (a[c] !== b[c]) return !1;
      return !0
    },
    r = function(a, b) {
      for (var c = [], d = 0; d < a.length; d++) c.push(a[d] - b[d]);
      return c
    },
    s = function(a) {
      return Array.isArray ? Array.isArray(a) : "[object Array]" === Object.prototype.toString.call(a)
    },
    t = function(a) {
      console && console.log(a)
    },
    u = {
      challenge: "",
      type: "slide",
      fullbg: "",
      bg: "",
      slice: "",
      xpos: 0,
      ypos: 0,
      height: 116,
      link: "javascript:;",
      https: !1,
      logo: !0,
      product: "float",
      id: "",
      theme: "golden",
      theme_version: "3.0.15",
      lang: "zh-cn",
      clean: !1,
      protocol: "http://",
      apiserver: "api.geetest.com/",
      staticservers: ["static.geetest.com/", "dn-staticdown.qbox.me/"],
      retry: 0
    },
    v = {
      loaded_theme: {},
      loaded_skin: {},
      loaded_sprite: {},
      mobileSkins: {},
      mobileSprites: {},
      feedback: "http://www.geetest.com/contact/#report",
      homepage: "http://www.geetest.com",
      Canvas: "5.0.5",
      Curtain: "5.0.2",
      Offline: "5.0.2",
      Fullpage: "5.0.2"
    },
    w = function(a, b) {
      for (var c in a) a.hasOwnProperty(c) && (a[c] = "undefined" != typeof b[c] ? b[c] : a[c])
    },
    x = function(a, b) {
      return w(v, a), b.config ? i(a, i(b.config)) : i(a, i(u))
    },
    y = function(a) {
      for (var b = document.styleSheets, c = 0, d = b.length; d > c; c += 1) {
        var e = "rules" in b[c];
        try {
          if (b[c].href && b[c].href.indexOf(a) > -1 && s(b[c].rules) && b[c].rules.length > 0 || !e) return !0
        } catch (f) {
          return !1
        }
      }
      return !1
    },
    z = function(a, b) {
      var c = document.createElement("img");
      c.onerror = function() {
        b(!0, c), c.onerror = null
      }, c.onload = c.onreadystatechange = function() {
        c.readyState && "loaded" !== c.readyState && "complete" !== c.readyState || (b(!1, c), c.onload = c.onreadystatechange = null)
      }, c.src = a
    },
    A = function(a, b) {
      var c = document.createElement("link");
      c.setAttribute("rel", "stylesheet"), c.setAttribute("href", a), c.onerror = function() {
        b(!0), c.onerror = null
      }, c.onload = c.onreadystatechange = function() {
        b(y(a) ? !1 : !0), c.onload = null
      }, document.getElementsByTagName("head")[0].appendChild(c)
    },
    B = function(a, b) {
      var c = document.createElement("script");
      c.charset = "UTF-8", c.async = !1, c.onerror = function() {
        b(!0), c.onerror = null
      }, c.onload = c.onreadystatechange = function() {
        c.readyState && "loaded" !== c.readyState && "complete" !== c.readyState || (b(!1, null), c.onload = c.onreadystatechange = null, c.parentNode.removeChild(c))
      }, c.src = a, document.getElementsByTagName("head")[0].appendChild(c)
    },
    C = function(a, b, c) {
      var d = a.config.staticservers,
        e = a.config.protocol,
        f = d.length,
        g = 0;
      "function" != typeof c && (c = function() {});
      var h = function(a, b) {
          return a ? (g += 1, void i(b)) : void c(!1, b)
        },
        i = function(a) {
          return g >= f ? void c(!0, a) : void(b.indexOf(".js") > -1 ? B(e + d[g] + b, h) : b.indexOf(".png") > -1 || b.indexOf(".jpg") > -1 || b.indexOf(".webp") > -1 ? z(e + d[g] + b, h) : b.indexOf(".css") > -1 ? A(e + d[g] + b, h) : (t("no such resource: " + b), c(!0, a)))
        };
      i(null)
    },
    D = function(a, b, c) {
      a = c.config.protocol + a.replace(/http:\/\/|https:\/\//, "");
      var d = "geetest_" + l();
      if (c && "function" == typeof c.$) {
        var e = c.$(".gt_slice");
        M._addClass(e, "wait")
      }
      window[d] = function(a) {
        e && M._removeClass(e, "wait"), a.error && (h._emit("error", c.id), h._emit("statusChange", c.id), n(window, d)), b.call(c, a, c)
      }, B(a + "&callback=" + d, function(b) {
        b && t("GeeTest Error: request " + a + " can not access")
      })
    },
    E = document.createElement("img");
  E.onload = E.onerror = function() {
    var a = ".jpg";
    2 === E.height && (a = ".webp"), v.webp = a, h._broadcast("WebPLoaded")
  }, E.src = "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";
  var F = /msie 6/i.test(navigator.userAgent),
    G = -1,
    H = function() {
      return G = "transition" in document.body.style || "webkitTransition" in document.body.style || "mozTransition" in document.body.style || "msTransition" in document.body.style
    };
  document && document.body && H(), F && (v.webp = ".jpg");
  var I = function(a, b) {
      if (!(this instanceof I)) return new I(a, b);
      var c = this;
      return c.id = l(), h._addItem(c.id), K._addItem(c.id, c), c.config = x(a, c), c.config.protocol = c.config.https ? "https://" : "http://", b || a.offline ? (J(a, c), c.bindOn("#" + a.popupbtnid)) : D(c.config.apiserver + "get.php?" + j(a), J, c), c
    },
    J = function(a, b) {
      return a ? (-1 == G && H(), void c.parallel([function(c) {
        a.offline ? g(b, "Offline", function(a) {
          c(a)
        }) : c(null)
      }, function(c) {
        a.fullpage ? g(b, "Fullpage", function(a) {
          c(a)
        }) : c(null)
      }], function(d, e, f) {
        f && f._init(), a.offline ? b.config = x(e._init(b), b) : b.config = x(a, b), h._on("success", la.onSuccess, b.id), h._on("refresh", la.onRefresh, b.id), h._on("fail", la.onFail, b.id), h._on("forbidden", la.onForbidden, b.id), h._on("abuse", la.onAbuse, b.id), h._on("error", la.onError, b.id), h._once("DOMReady", la.onReady, b.id), c.serial([function(a) {
          b.config.mobile ? g(b, "Canvas", function(b) {
            a(b)
          }) : "curtain" === b.config.type ? g(b, "Curtain", function(b) {
            a(b)
          }) : a(null)
        }], function() {
          v.loaded_theme[b.config.theme] ? (K._put("loaded", !0, b.id), h._emit("loaded", b.id)) : (v.loaded_theme[b.config.theme] = !0, C(b, "static/" + b.config.theme + "/style" + (b.config.https ? "_https" : "") + "." + b.config.theme_version + ".css", function() {
            K._put("loaded", !0, b.id), h._emit("loaded", b.id)
          }), b.config.mobile && (C(b, "static/" + b.config.theme + "/skin." + b.config.theme_version + ".js", function(a) {
            return a ? void t("canvas " + b.config.theme + " skin.js can not loaded") : (v.mobileSkins[b.config.theme] = window.GeeTestSkins[b.config.theme], void h._broadcast(b.config.theme + "SkinLoaded"))
          }), C(b, "static/" + b.config.theme + "/sprite." + b.config.theme_version + ".png", function(a, c) {
            return a ? void t("canvas " + b.config.theme + " sprite.png can not loaded") : (v.mobileSprites[b.config.theme] = c, void h._broadcast(b.config.theme + "SpriteLoaded"))
          })))
        })
      })) : !1
    },
    K = {};
  K._list = {}, K._addItem = function(a, b) {
    K._list[a] = {}, K._list[a].self = b
  }, K._put = function(a, b, c) {
    return K._list[c][a] = b, b
  }, K._get = function(a, b) {
    return K._list[b][a]
  };
  var L = {
      "zh-cn": {
        loading: "加载中...",
        slide: ">>> 拖动滑块完成验证 >>>",
        curtain: "点击上图按钮并沿道路拖动到终点处",
        curtain_knob: "移动到此开始验证",
        refresh: "刷新验证",
        help: "帮助反馈",
        fail: ["验证失败:", "拖动滑块将悬浮图像正确拼合"],
        success: ["验证成功:", "sec 秒的速度超过 score% 的用户"],
        abuse: ["尝试过多:", "系统正在自动刷新图片"],
        forbidden: ["再来一次:", "哇哦～怪物吃了拼图 count 秒后重试"],
        error: ["出现错误:", "哎哟，服务器也被怪物吃掉了"]
      },
      en: {
        loading: "loading...",
        slide: "Drag the button to verify",
        curtain: "Drag the button along the road",
        curtain_knob: "Move here to verify",
        refresh: "Refresh",
        help: "Support",
        fail: ["Fail:", "Drag the button to fill the image"],
        success: ["Success:", "Take secs and defeat score% users"],
        abuse: ["Excessive:", "Server is refreshing the image"],
        forbidden: ["Try Again:", "Wow~ Monster eats the image"],
        error: ["Server Error:", "Server is down"]
      }
    },
    M = {};
  M._Json2Html = function na(a, b, c) {
    var d, e = document.createElement("div");
    if (b = b || e.cloneNode(), "string" == typeof a) return void b.appendChild(document.createTextNode(a));
    for (d in a)
      if (a.hasOwnProperty(d)) {
        var f, g = "" === d.split(".")[0] ? "div" : d.split(".")[0];
        "input" === g ? (f = document.createElement(g), f.className = d.split(".")[1], f.type = "hidden", f.name = d.split(".")[1]) : (f = document.createElement(g), f.className = d.split(".")[1]), b.appendChild(f), c(f), na(a[d], f, c)
      }
    return b.childNodes ? b : null
  }, M._json = function(a) {
    return a = a || v.lang, {
      ".gt_widget": {
        ".gt_holder_top": {},
        ".gt_box_holder": {
          ".gt_box": {
            ".gt_loading": {},
            "a.gt_bg": {
              ".gt_cut_bg": {},
              ".gt_slice": {}
            },
            "a.gt_fullbg": {
              ".gt_cut_fullbg": {},
              ".gt_flash": {},
              ".gt_ie_success": {}
            },
            "a.gt_curtain": {
              ".gt_curtain_bg_wrap": {
                ".gt_curtain_bg": {
                  ".gt_cut_curtain": {}
                }
              },
              ".gt_curtain_button": {}
            },
            "a.gt_box_tips": {}
          },
          ".gt_info": {
            ".gt_info_tip": {
              ".gt_info_icon": {},
              ".gt_info_text": {}
            }
          }
        },
        ".gt_bottom": {
          "a.gt_refresh_button": {
            ".gt_refresh_tips": L[a].refresh
          },
          "a.gt_help_button": {
            ".gt_help_tips": L[a].help
          },
          "a.gt_logo_button": {}
        }
      },
      ".gt_input": {
        "input.geetest_challenge": {},
        "input.geetest_validate": {},
        "input.geetest_seccode": {}
      },
      ".gt_slider": {
        ".gt_guide_tip": L[a].slide,
        ".gt_slider_knob": {},
        ".gt_curtain_tip": L[a].curtain,
        ".gt_curtain_knob": L[a].curtain_knob,
        ".gt_ajax_tip": {}
      }
    }
  }, M._after = function(a, b) {
    return a.parentNode.insertBefore(b, a.nextSibling), b
  }, M._parseSelector = function(a) {
    return "string" == typeof a ? 0 == a.indexOf("#") ? a = document.getElementById(a.replace("#", "")) : "querySelector" in document ? a = document.querySelector(a) : k(window.jQuery) && (a = window.jQuery(a)[0]) : a.length && (a = a[0]), a
  }, M._fixOverflow = function(a) {
    var b = function(a, b) {
      var c;
      return a.currentStyle ? c = a.currentStyle[b] : window.getComputedStyle && (c = window.getComputedStyle(a, null).getPropertyValue(b)), c
    };
    try {
      for (var c = a; a.parentNode != document.body && c.offsetTop - a.parentNode.offsetTop < 160;) a = a.parentNode, "hidden" == b(a, "overflow") && (a.style.overflow = "visible")
    } catch (d) {}
  }, M._getElementLeft = function(a) {
    for (var b = a.offsetLeft, c = a.offsetParent; null !== c;) b += c.offsetLeft, c = c.offsetParent;
    return b
  }, M._getElementTop = function(a) {
    for (var b = a.offsetTop, c = a.offsetParent; null !== c;) b += c.offsetTop, c = c.offsetParent;
    return b
  }, M._setPosition = function(a, b) {
    a.style.top = M._getElementTop(b) - 160 + "px", a.style.left = M._getElementLeft(b) + "px"
  }, M._append = function(a, b) {
    var c = this;
    a = M._parseSelector(a), M._buildSelector(c);
    var d = c.$;
    if (c.config.mobile) {
      var e = f("Canvas");
      c.dom = e._init(c), c.zoom(c.config.width + "px"), e._loadImg(c), e._bindEvent(c)
    } else {
      if ("popup" !== c.config.product) c.dom = M._Json2Html(M._json(c.config.lang), !1, d);
      else {
        var g = f("Popup");
        c.dom = M._Json2Html(g._json(c.config.lang), !1, d)
      }
      if (c.zoom(1), M._setType(c, !0), M._setLink(c), M._setBaseLink(c), M._loadImg(c, !0), X._bindEvent(c), "curtain" === c.config.type) {
        var i = f("Curtain");
        i._bindEvent(c)
      }
      d(".gt_flash").style.height = c.config.height - 22 + "px"
    }
    if (c.dom.style["touch-action"] = "none", c.dom.style["ms-touch-action"] = "none", ga(c), c.dom.id = "geetest_" + c.id, c.config.mobile ? c.dom.className = "gt_mobile_holder " + c.config.product + " " + c.config.lang : c.dom.className = "gt_holder " + c.config.product + " " + c.config.lang, "float" != c.config.product || c.config.mobile || ba(c), "popup" == c.config.product) {
      document.body.appendChild(c.dom);
      var j = d(".gt_input");
      b ? M._after(a, j) : a.appendChild(j)
    } else b ? M._after(a, c.dom) : a.appendChild(c.dom);
    if ("float" === c.config.product && !c.config.mobile)
      if (c.config.sandbox) {
        var k = d(".gt_widget");
        c.dom.removeChild(k);
        var l = document.createElement("div");
        l.className = c.dom.className + " gt_clone", l.appendChild(k), document.getElementsByTagName("body")[0].appendChild(l), M._setPosition(l, c.dom), K._put("floatDom", l, c.id)
      } else setTimeout(function() {
        M._fixOverflow(c.dom)
      }, 2e3);
    K._put("DOMReady", !0, c.id), h._emit("DOMReady", c.id)
  }, M._setType = function(a, b) {
    var c = a.$;
    if (N._hide(c(".gt_curtain")), N._hide(c(".gt_curtain_button")), N._hide(c(".gt_curtain_tip")), N._hide(c(".gt_curtain_knob")), "slide" == a.config.type) X._show(a, b);
    else {
      var d = f("Curtain");
      X._hide(a, b), d._show(a, b)
    }
  }, M._setBaseLink = function(a) {
    var b = a.$,
      c = b(".gt_logo_button");
    a.config.logo ? (c.href = v.homepage, c.target = "_blank") : M._addClass(c, "no_logo"), a.config.clean && M._addClass(b(".gt_widget"), "clean");
    var d = b(".gt_help_button");
    d.href = v.feedback, d.target = "_blank"
  }, M._setLink = function(a) {
    var b = a.config.link || "javascript:;",
      c = a.$(".gt_fullbg"),
      d = a.$(".gt_box_tips"),
      e = a.config.link ? "_blank" : "_self";
    c.href = d.href = b, c.target = d.target = e
  }, M._addClass = function(a, b) {
    if (a) {
      for (var c = b.split(" "), d = a.className.split(" "), e = 0, f = c.length; f > e; e++) - 1 == m(c[e], d) && d.push(c[e]);
      a.className = d.join(" ")
    }
  }, M._removeClass = function(a, c) {
    if (a) {
      "string" == typeof a && (a = b(a));
      for (var d, e = c.split(" "), f = a.className.split(" "), g = 0, h = e.length; h > g; g++) d = m(e[g], f), -1 != d && f.splice(d, 1);
      a.className = f.join(" ")
    }
  }, M._hasClass = function(a, b) {
    var c = a.className.split(" ");
    return -1 != m(b, c)
  }, M._getImages = function(a, b, d) {
    var e = function() {
      for (var e = new Date, f = [], g = [], h = 0, i = b.length; i > h; h += 1) f[h] = function(c) {
        return function(d) {
          C(a, b[c].replace(".jpg", v.webp), function(a, b) {
            if (a) {
              if (0 !== c) return void d(null, !0);
              b = {
                src: null
              }
            }
            return !F && b.src && b.src.indexOf(".webp") > -1 && (!b.width || b.width < 10) ? (v.webp = ".jpg", void d(null, !0)) : (g[c] = b, void d(null))
          })
        }
      }(h);
      c.parallel(f, function(b) {
        if (b) return a.config.retry >= 3 && t("can not loaded imgs"), a.config.retry += 1, void a.refresh();
        a.config.retry = 0;
        var c = F ? -2 : (new Date).getTime() - e.getTime();
        d(g, c)
      })
    };
    v.webp ? e() : h._once("WebPLoaded", e)
  }, M._loadImg = function(a, b) {
    var c = a.$,
      d = a.config.height;
    c(".gt_box_holder").style.height = d + "px", F && (c(".gt_cut_fullbg").style.height = d + "px", c(".gt_cut_bg").style.height = d + "px", c(".gt_curtain_bg_wrap").style.height = d + "px", c(".gt_curtain_bg").style.height = d + "px", c(".gt_cut_curtain").style.height = d + "px");
    var e = a.config.type;
    if ("slide" == e) M._getImages(a, [a.config.fullbg, a.config.bg, a.config.slice], function(d, e) {
      O._render(d[0].src, d[1].src, a, b), K._put("imgload", e, a.id);
      var f = c(".gt_slice");
      F ? f.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + d[2].src + '")' : (f.style.backgroundImage = "url(" + d[2].src + ")", f.style.width = (d[2].width || 60) + "px", f.style.height = (d[2].height || 60) + "px"), f.style.top = a.config.ypos + "px", setTimeout(function() {
        K._put("status", "ready", a.id), ja._show("ready", a), h._emit("statusChange", a.id)
      }, 400)
    });
    else {
      var f = 900;
      b && (f = 0), M._getImages(a, [a.config.fullbg, a.config.bg], function(d, e) {
        var g = c(".gt_curtain_button");
        K._put("imgload", e, a.id), g.style.top = a.config.ypos + "px", g.style.left = a.config.xpos + "px", O._render(d[0].src, d[1].src, a, b), setTimeout(function() {
          K._put("status", "ready", a.id), ja._show("ready", a), h._emit("statusChange", a.id)
        }, f)
      })
    }
  }, I.prototype.appendTo = function(a, b) {
    return K._get("loaded", this.id) ? M._append.call(this, a, b) : h._once("loaded", function() {
      M._append.call(this, a, b)
    }, this.id), this
  }, M._buildSelector = function(a) {
    var b = [];
    a.$ = function(a) {
      if ("string" == typeof a) {
        for (var c = 0, d = b.length; d > c; c++)
          for (var e = b[c].className.split(" "), f = 0, g = e.length; g > f; f++)
            if (e[f] == a.split(".")[1]) return b[c];
        return !1
      }
      b.push(a)
    }
  };
  var N = function() {
      var a = M._addClass,
        b = M._removeClass,
        c = function(c, d, e) {
          var f = function() {
            G && d ? (a(c, "gt_animate"), setTimeout(function() {
              a(c, "gt_hide")
            }), setTimeout(function() {
              b(c, "gt_show")
            }, 20), setTimeout(function() {
              b(c, "gt_animate")
            }, d)) : (b(c, "gt_show"), a(c, "gt_hide"))
          };
          return e ? setTimeout(f, e) : void f()
        },
        d = function(c, d, e) {
          var f = function() {
            G && d ? (a(c, "gt_animate"), setTimeout(function() {
              b(c, "gt_hide")
            }), setTimeout(function() {
              a(c, "gt_show")
            }, 20), setTimeout(function() {
              b(c, "gt_animate")
            }, d + 20)) : (b(c, "gt_hide"), a(c, "gt_show"))
          };
          return e ? setTimeout(f, e) : void f()
        },
        e = function(c, d, e, f, g) {
          var h = function() {
            G && d ? (a(c, "gt_animate"), "function" == typeof f && f(), "function" == typeof g && setTimeout(g, 0), setTimeout(function() {
              b(c, "gt_animate")
            }, d)) : "function" == typeof g && g()
          };
          return e ? setTimeout(h, e) : void h()
        };
      return {
        _hide: c,
        _show: d,
        _move: e
      }
    }(),
    O = function() {
      var a = function() {
          for (var a, b = "6_11_7_10_4_12_3_1_0_5_2_9_8".split("_"), c = [], d = 0, e = 52; e > d; d++) a = 2 * parseInt(b[parseInt(d % 26 / 2)]) + d % 2, parseInt(d / 2) % 2 || (a += d % 2 ? -1 : 1), a += 26 > d ? 26 : 0, c.push(a);
          return c
        },
        b = function(a) {
          var b = a(".gt_fullbg"),
            c = a(".gt_cut_fullbg"),
            d = a(".gt_bg"),
            e = a(".gt_cut_bg"),
            f = a(".gt_slice"),
            g = a(".gt_curtain");
          b.style.backgroundImage = "none", d.style.backgroundImage = "none", g.style.backgroundImage = "none", f.style.backgroundImage = "none", N._hide(b), N._hide(d), N._hide(g), N._hide(f), N._hide(c), N._hide(e)
        },
        c = function(a, b) {
          var c = 300,
            d = 600;
          b && (c = d = 0);
          var e = a.$;
          N._show(e(".gt_fullbg"), c), "slide" == a.config.type ? (N._show(e(".gt_bg"), 0, c), N._show(e(".gt_slice"), 0, c)) : (N._show(e(".gt_curtain"), d), N._show(e(".gt_curtain_button"), d))
        },
        d = function(b, c, d, e, f) {
          var g = 8 !== c.split("/")[5].length;
          if (!g) return void(d.style.backgroundImage = "url(" + c + ")");
          var h, i, j, k = [];
          if (K._get(b + "Arr", f.id))
            for (k = K._get(b + "Arr", f.id), h = 0, i = k.length; i > h; h++) k[h].style.backgroundImage = "url(" + c + ")";
          else {
            K._put(b + "Arr", k, f.id);
            var l, m = a(),
              n = document.createElement("div");
            for (n.className = "gt_cut_" + b + "_slice", h = 0, i = m.length; i > h; h++) j = "-" + (m[h] % 26 * 12 + 1) + "px " + (m[h] > 25 ? -f.config.height / 2 : 0) + "px", l = n.cloneNode(), l.style.backgroundImage = "url(" + c + ")", k.push(l), e.appendChild(l), l.style.backgroundPosition = j
          }
          N._show(f.$(".gt_cut_" + b))
        },
        e = function(a, e, f, g) {
          var h = f.$;
          b(h), a && d("fullbg", a, h(".gt_fullbg"), h(".gt_cut_fullbg"), f), "slide" == f.config.type ? d("bg", e, h(".gt_bg"), h(".gt_cut_bg"), f) : d("curtain", e, h(".gt_curtain_bg"), h(".gt_cut_curtain"), f), setTimeout(function() {
            c(f, g)
          }, 100)
        },
        f = function(b, c, d) {
          var e = document.createElement("canvas");
          e.width = 260, e.height = d;
          for (var f, g, h = e.getContext("2d"), i = e.cloneNode(!0), j = i.getContext("2d"), k = a(), l = 0, m = d / 2, n = 0, o = k.length; o > n; n++) f = k[n] % 26 * 12 + 1, g = k[n] > 25 ? m : 0, n > 25 && (l = m), h.drawImage(b, f, g, 10, m, n % 26 * 10, l, 10, m), j.drawImage(c, f, g, 10, m, n % 26 * 10, l, 10, m);
          return {
            fullbg: e,
            bg: i
          }
        };
      return {
        _render: e,
        _clear: b,
        _parseMess: f
      }
    }(),
    P = "move",
    Q = "down",
    R = "up",
    S = "scroll",
    T = "blur",
    U = "focus",
    V = "unload",
    W = {};
  W.evts = {
    down: ["mousedown", "touchstart", "pointerdown", "MSPointerDown"],
    move: ["mousemove", "touchmove", "pointermove", "MSPointerMove"],
    up: ["mouseup", "touchend", "pointerup", "MSPointerUp"],
    scroll: [S],
    click: ["click"],
    blur: [T],
    focus: [U],
    unload: [V]
  }, W._list = [], W._get = function(a, b) {
    for (var c, d = 0, e = W._list.length; e > d; d++)
      if (c = W._list[d], c.dom == a && c.event == b) return c;
    return c = {
      dom: a,
      event: b,
      handlerList: [],
      _handler: function() {}
    }, W._list.push(c), c
  }, W._addEvent = function(a, b, c) {
    for (var d, e = W.evts[b], f = W._get(a, b), g = 0, h = e.length; h > g; g++) f.handlerList.length && (d = f._handler, window.addEventListener ? a.removeEventListener(e[g], d, !1) : window.attachEvent && a.detachEvent("on" + e[g], d)), window.addEventListener ? (f.handlerList.push(c), f._handler = function(b) {
      for (var c = 0, d = f.handlerList.length; d > c; c++) f.handlerList[c](b).call(a)
    }, a.addEventListener(e[g], c, !1)) : window.attachEvent && a.attachEvent("on" + e[g], c)
  };
  var X = {};
  X._show = function(a) {
    var b = a.$;
    X._move(0, b, !0), N._show(b(".gt_guide_tip"), 500), N._show(b(".gt_slider_knob"), 500)
  }, X._hide = function(a) {
    var b = a.$;
    N._hide(b(".gt_bg"), 500), N._hide(b(".gt_slider_knob"), 500), N._hide(b(".gt_guide_tip"), 500), setTimeout(function() {
      X._move(0, b, 0)
    }, 500)
  }, X._handler = function(a) {
    var b = this,
      c = b.$,
      d = c(".gt_slice"),
      e = c(".gt_slider_knob");
    if (a.type) return ia._show("fail", b, 3e3), ja._show("lock", b), N._show(c(".gt_fullbg"), 300), void setTimeout(function() {
      fa(a, b)
    }, 500);
    if (a.success) {
      var f = c(".gt_flash");
      K._put("score", a.score, b.id), ia._show("success", b), ja._show("success", b), G || N._show(c(".gt_ie_success")), N._show(f, 1500), N._hide(f, 0, 1600), N._show(c(".gt_fullbg"), 1500), ka._write(a.validate, b), h._emit("success", b.id), setTimeout(function() {
        K._put("status", "success", b.id), h._emit("statusChange", b.id)
      }, 400)
    } else "fail" == a.message ? (ia._show("fail", b), ja._show("fail", b), N._hide(d, 100), N._show(d, 100, 100), N._hide(d, 100, 200), N._show(d, 100, 300), N._move(d, 400, 500, !1, function() {
      X._move(0, c, !0)
    }), N._move(e, 400, 500), h._emit("fail", b.id), setTimeout(function() {
      K._put("status", "ready", b.id), ja._show("ready", b), h._emit("statusChange", b.id), N._show(c(".gt_guide_tip"), 500)
    }, 1e3)) : "forbidden" == a.message ? (ia._show("forbidden", b), ja._show("forbidden", b), h._emit("forbidden", b.id), setTimeout(function() {
      K._put("status", "auto", b.id), b.refresh()
    }, 4e3)) : "abuse" == a.message && (ia._show("abuse", b), ja._show("fail", b), h._emit("abuse", b.id), setTimeout(function() {
      K._put("status", "auto", b.id), b.refresh()
    }, 1500))
  }, X._move = function(a, b, c) {
    var d = b(".gt_slider_knob"),
      e = b(".gt_slice");
    return a = 2 > a ? 2 : a > 198 ? 198 : a, c && (a = 0), "webkitTransform" in document.body.style || "transform" in document.body.style ? void(d.style.webkitTransform = d.style.transform = e.style.webkitTransform = e.style.transform = "translate(" + a + "px, 0px)") : (d.style.left = a + "px", void(e.style.left = a + "px"))
  }, X._downBuilder = function(a) {
    var b = a.$;
    return function(c) {
      var d = K._get("status", a.id);
      if ("ready" == d && "slide" == a.config.type && 2 != c.button) {
        if (a.config.fullpage) {
          var e = f("Fullpage");
          e._send(a), e._pause()
        }
        "pointerdown" !== c.type || K._get("pointerdown", a.id) || K._put("pointerdown", !0, a.id), K._put("startTime", new Date, a.id), K._put("status", "moving", a.id), h._emit("statusChange", a.id), c.preventDefault ? c.preventDefault() : c.returnValue = !1;
        var g = b(".gt_slider_knob");
        M._addClass(b(".gt_slice"), "moving"), M._addClass(g, "moving");
        var i = K._get("scale", a.id),
          j = (c.clientX || c.changedTouches && c.changedTouches[0].clientX) / i,
          k = (c.clientY || c.changedTouches && c.changedTouches[0].clientY) / i,
          l = g.getBoundingClientRect();
        K._put("startX", j, a.id), K._put("startY", k, a.id), ha._init([Math.round(l.left - j), Math.round(l.top - k), 0], a.id), ha._push([0, 0, 0], a.id), N._hide(b(".gt_fullbg"), 300), N._hide(b(".gt_guide_tip"), 500)
      }
    }
  }, X._moveBuilder = function(a) {
    var b = a.$;
    return function(c) {
      var d = K._get("status", a.id);
      if ("moving" == d && "slide" == a.config.type && (!K._get("pointerdown", a.id) || "pointermove" === c.type)) {
        c.preventDefault ? c.preventDefault() : c.returnValue = !1;
        var e = K._get("startX", a.id),
          f = K._get("startY", a.id),
          g = K._get("scale", a.id),
          h = (c.changedTouches && c.changedTouches[0].clientX || c.clientX) / g - e,
          i = f - (c.changedTouches && c.changedTouches[0].clientY || c.clientY) / g,
          j = parseInt(h);
        X._move(j, b), ha._push([Math.round(h), Math.round(i), (new Date).getTime() - K._get("startTime", a.id)], a.id)
      }
    }
  }, X._upBuilder = function(a) {
    var b = a.$;
    return function(c) {
      var d = K._get("status", a.id);
      if ("moving" == d && "slide" == a.config.type && (!K._get("pointerdown", a.id) || "pointerup" === c.type)) {
        if (a.config.fullpage) {
          var e = f("Fullpage");
          e._resume()
        }
        d = K._put("status", "lock", a.id), ja._show("lock", a), M._removeClass(b(".gt_slice"), "moving"), M._removeClass(b(".gt_slider_knob"), "moving");
        var g = K._get("startX", a.id),
          h = K._get("startY", a.id),
          i = K._get("scale", a.id),
          k = (c.changedTouches && c.changedTouches[0].clientX || c.clientX) / i - g,
          l = h - (c.changedTouches && c.changedTouches[0].clientY || c.clientY) / i,
          m = new Date;
        K._put("endTime", m, a.id), ha._push([Math.round(k), Math.round(l), m.getTime() - K._get("startTime", a.id)], a.id);
        var n = parseInt(k),
          o = ha._encode(a.id);
        if (a.config.offline) {
          var p = f("Offline");
          return void X._handler.call(a, p.ajax(n, K._get("endTime", a.id).getTime() - K._get("startTime", a.id), a))
        }
        D(a.config.apiserver + "ajax.php?" + j({
            challenge: a.config.challenge,
            userresponse: X._getResponse(n, a.config.challenge),
            passtime: K._get("endTime", a.id).getTime() - K._get("startTime", a.id),
            imgload: K._get("imgload", a.id),
            a: o
          }), X._handler, a)
      }
    }
  }, X._bindEvent = function(a) {
    var b = a.$,
      c = b(".gt_slider_knob");
    W._addEvent(c, Q, X._downBuilder(a)), W._addEvent(document, P, X._moveBuilder(a)), W._addEvent(document, R, X._upBuilder(a))
  }, X._getResponse = function(a, b) {
    for (var c = b.slice(32), d = [], e = 0; e < c.length; e++) {
      var f = c.charCodeAt(e);
      d[e] = f > 57 ? f - 87 : f - 48
    }
    c = 36 * d[0] + d[1];
    var g = Math.round(a) + c;
    b = b.slice(0, 32);
    var h, i = [
        [],
        [],
        [],
        [],
        []
      ],
      j = {},
      k = 0;
    e = 0;
    for (var l = b.length; l > e; e++) h = b.charAt(e), j[h] || (j[h] = 1, i[k].push(h), k++, k = 5 == k ? 0 : k);
    for (var m, n = g, o = 4, p = "", q = [1, 2, 5, 10, 50]; n > 0;) n - q[o] >= 0 ? (m = parseInt(Math.random() * i[o].length, 10), p += i[o][m], n -= q[o]) : (i.splice(o, 1), q.splice(o, 1), o -= 1);
    return p
  };
  var Y = function(a) {
      return function() {
        Z(a)
      }
    },
    Z = function(a) {
      for (var b = 250, c = 800, d = K._get("status", a.id), e = "ready" == d || "success" == d || "error" == d, g = K._get("in", a.id), h = a.$(".gt_widget"), i = K._get("hideDelay", a.id) || [], j = 0, k = i.length; k > j; j++) clearTimeout(i[j]);
      i = [];
      var l;
      if (e && !g) {
        if (M._hasClass(h, "gt_hide")) return;
        if ("curtain" == a.config.type) {
          var m = f("Curtain");
          l = m.setFloat(!1, a, c), i = i.concat(l)
        }
        i.push(N._hide(h, 400, c)), K._put("hideDelay", i, a.id)
      }
      if (!e || g) {
        if (M._hasClass(h, "gt_show")) return;
        if (b = e ? b : 0, "curtain" == a.config.type) {
          var m = f("Curtain");
          l = m.setFloat(!0, a, b), i = i.concat(l)
        }
        i.push(N._show(h, 400, b)), K._put("hideDelay", i, a.id)
      }
    },
    $ = function(a, b) {
      if (!a || null == a || "undefined" == typeof a) return !1;
      if (b.compareDocumentPosition) {
        var c = b.compareDocumentPosition(a);
        return !(20 !== c && 0 !== c)
      }
      if (b.contains) return b.contains(a);
      for (; a != b && a;) a = a.parentNode;
      return a ? !0 : !1
    },
    _ = function(a) {
      return function(b) {
        aa(b, a)
      }
    },
    aa = function(a, b) {
      var c = a.target || a.srcElement,
        d = K._get("in", b.id),
        e = $(c, b.dom);
      d != e && (b.config.sandbox && M._setPosition(K._get("floatDom", b.id), b.dom), K._put("in", e, b.id), h._emit("hoverChange", b.id))
    },
    ba = function(a) {
      var b = a.$;
      K._put("in", !1, a.id), N._hide(b(".gt_widget")), W._addEvent(document, "move", _(a)), W._addEvent(document, "up", _(a)), h._on("statusChange", Y(a), a.id), h._on("hoverChange", Y(a), a.id)
    },
    ca = {};
  ca._json = function(a, b) {
    return a = a || v.lang, {
      ".gt_mask": {},
      ".gt_popup_wrap": {
        ".gt_popup_header": {
          ".gt_popup_ready": "请先完成下方验证",
          ".gt_popup_finish": "页面将在2秒后跳转",
          ".gt_popup_cross": {}
        },
        ".gt_popup_box": b ? b._json(a) : M._json(a)
      }
    }
  }, ca._show = function(a) {
    var b = a.$;
    N._show(a.dom, 400), "success" == K._get("status", a.id) && a.refresh(), N._hide(b(".gt_popup_finish")), N._show(b(".gt_popup_ready"))
  }, ca._hide = function(a) {
    N._hide(a.dom, 400)
  }, ca.bindOn = function(a) {
    var b = this,
      c = b.$;
    if (!K._get("DOMReady", b.id)) return void h._once("DOMReady", function() {
      ca.bindOn.call(b, a)
    }, b.id);
    if ("popup" === b.config.product) {
      var d = K._get("enablePopup", b.id);
      void 0 == d && K._put("enablePopup", !0, b.id);
      var e = M._parseSelector(a);
      if (!e) return void setTimeout(function() {
        ca.bindOn.call(b, a)
      }, 100);
      K._put("popup_btn", e, b.id);
      var f = e.cloneNode(!0);
      W._addEvent(f, "click", function(a) {
        a.preventDefault ? a.preventDefault() : a.returnValue = !1;
        var c = K._get("enablePopup", b.id);
        c && ca._show(b)
      }), W._addEvent(c(".gt_mask"), "click", function() {
        ca._hide(b)
      }), W._addEvent(c(".gt_popup_cross"), "click", function() {
        ca._hide(b)
      }), f.href = "javascript:;", f.id = e.id, e.style.display = "none", e.id = "origin_" + e.id, M._after(e, f), h._on("success", function() {
        N._show(c(".gt_popup_finish")), N._hide(c(".gt_popup_ready")), setTimeout(function() {
          ca._hide(b), e.click()
        }, 1e3)
      }, b.id)
    }
  }, I.prototype.bindOn = function(a) {
    return K._get("loaded", this.id) ? ca.bindOn.call(this, a) : h._once("loaded", function() {
      ca.bindOn.call(this, a)
    }, this.id), this
  }, I.prototype.enable = function() {
    K._put("enablePopup", !0, this.id)
  }, I.prototype.disable = function() {
    K._put("enablePopup", !1, this.id)
  };
  var da = function(a) {
      return function() {
        ea(a)
      }
    },
    ea = function(a) {
      if (a.config.retry > 3) return void t("can not loaded imgs");
      var b = K._get("status", a.id);
      if ("ready" === b || "success" === b || "auto" === b) {
        if (h._emit("statusChange", a.id), K._put("status", "lock", a.id), ka._clear(a), !a.config.mobile) {
          var c = a.$;
          O._clear(a.$), N._hide(c(".gt_ie_success")), ja._show("lock", a)
        }
        if (a.config.offline) {
          var d = f("Offline");
          return void fa(d._init(a), a)
        }
        D(a.config.apiserver + "refresh.php?" + j({
            challenge: a.config.challenge,
            gt: a.config.gt
          }), function(b) {
          fa(b, a)
        }, a)
      }
    },
    fa = function(a, b) {
      if (h._emit("refresh", b.id), w(b.config, a), b.config.mobile) {
        var c = f("Canvas");
        c._loading(b), c._loadImg(b)
      } else M._setType(b), M._setLink(b), M._loadImg(b);
      clearTimeout(K._get("autoRefresh", b.id)), K._put("autoRefresh", setTimeout(function() {
        b.refresh()
      }, 54e4), b.id)
    };
  I.prototype.refresh = function() {
    ea(this)
  };
  var ga = function(a) {
      a.config.mobile || W._addEvent(a.$(".gt_refresh_button"), "click", da(a)), K._put("autoRefresh", setTimeout(function() {
        a.refresh()
      }, 54e4), a.id), h._on("success", function() {
        clearTimeout(K._get("autoRefresh", a.id))
      }, a.id)
    },
    ha = function() {
      var a = function(a, b) {
          K._put("arr", [a], b)
        },
        b = function(a, b) {
          K._get("arr", b).push(a)
        },
        c = function(a) {
          for (var b = [], c = 0; c < a.length - 1; c++) {
            var d = [];
            d[0] = Math.round(a[c + 1][0] - a[c][0]), d[1] = Math.round(a[c + 1][1] - a[c][1]), d[2] = Math.round(a[c + 1][2] - a[c][2]), (0 !== d[0] || 0 !== d[1] || 0 !== d[2]) && b.push(d)
          }
          return b
        },
        d = function(a) {
          var b = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr",
            c = b.length,
            d = "",
            e = Math.abs(a),
            f = parseInt(e / c);
          f >= c && (f = c - 1), f && (d = b.charAt(f)), e %= c;
          var g = "";
          return 0 > a && (g += "!"), d && (g += "$"), g + d + b.charAt(e)
        },
        e = function(a) {
          for (var b = [
            [1, 0],
            [2, 0],
            [1, -1],
            [1, 1],
            [0, 1],
            [0, -1],
            [3, 0],
            [2, -1],
            [2, 1]
          ], c = "stuvwxyz~", d = 0, e = b.length; e > d; d++)
            if (a[0] == b[d][0] && a[1] == b[d][1]) return c[d];
          return 0
        },
        f = function(a) {
          for (var b, f = c(K._get("arr", a)), g = [], h = [], i = [], j = 0, k = f.length; k > j; j++) b = e(f[j]), b ? h.push(b) : (g.push(d(f[j][0])), h.push(d(f[j][1]))), i.push(d(f[j][2]));
          return g.join("") + "!!" + h.join("") + "!!" + i.join("")
        };
      return {
        _encode: f,
        _push: b,
        _init: a
      }
    }(),
    ia = {};
  ia._render = function(a, b, c, d) {
    var e = i(L[c][b]);
    if (d)
      for (var f in d) d.hasOwnProperty(f) && (e[1] = e[1].replace(f, d[f]));
    var g = document.createElement("span");
    g.className = "gt_info_type", o(g, e[0]);
    var h = document.createElement("span");
    h.className = "gt_info_content", o(h, e[1]), o(a, ""), a.appendChild(g), a.appendChild(h)
  }, ia._show = function(a, b, c) {
    var d = b.$;
    "undefined" == typeof c && (c = 2e3);
    var e = d(".gt_info"),
      f = d(".gt_info_tip");
    f.className = "gt_info_tip " + a;
    var g = K._get("infoHide", b.id);
    g && clearTimeout(g);
    var h, i = 3,
      j = function() {
        ia._render(k, a, b.config.lang, {
          count: i
        }), i--, -1 == i && clearInterval(h)
      },
      k = d(".gt_info_text"),
      l = {};
    if ("success" == a) {
      var m = (K._get("endTime", b.id).getTime() - K._get("startTime", b.id)) / 1e3;
      l.sec = m.toFixed(1), l.score = 100 - K._get("score", b.id)
    } else "forbidden" == a && (j(), h = setInterval(j, 1e3), c = 4e3);
    "forbidden" != a && ia._render(k, a, b.config.lang, l), N._show(e, 200), c && K._put("infoHide", N._hide(e, 300, c), b.id)
  };
  var ja = {};
  ja._show = function(a, b) {
    var c = b.$;
    c(".gt_ajax_tip").className = "gt_ajax_tip " + a
  };
  var ka = {};
  ka._set = function(a, b) {
    var c = b.$,
      d = a ? b.config.challenge : "",
      e = a ? a.split("|")[0] : "",
      f = a ? a.split("|")[0] + "|jordan" : "";
    K._put("geetest_challenge", d, b.id), K._put("geetest_validate", e, b.id), K._put("geetest_seccode", f, b.id), c(".geetest_challenge").value = d, c(".geetest_validate").value = e, c(".geetest_seccode").value = f
  }, ka._write = function(a, b) {
    ka._set(a, b)
  }, ka._clear = function(a) {
    ka._set(!1, a)
  }, I.prototype.getValidate = function() {
    var a = {
      geetest_challenge: K._get("geetest_challenge", this.id),
      geetest_validate: K._get("geetest_validate", this.id),
      geetest_seccode: K._get("geetest_seccode", this.id)
    };
    return a.geetest_challenge ? a : !1
  };
  var la = {};
  la.onStatusChange = function(a, b) {
    var c = K._get("onStatusChange", b.id);
    "function" == typeof c && c.call(b, a);
    var d = "Success" == a ? 1 : 0;
    "function" == typeof window.gt_custom_ajax && (b.config.mobile ? window.gt_custom_ajax(d, b.dom.id, a) : window.gt_custom_ajax(d, b.$, a))
  }, la.onSuccess = function() {
    var a = this,
      b = K._get("onSuccess", a.id);
    "function" == typeof b && b.call(a), la.onStatusChange("Success", a)
  }, la.onRefresh = function() {
    var a = this,
      b = K._get("onRefresh", a.id);
    "function" == typeof b && b.call(a), "function" == typeof window.gt_custom_refresh && window.gt_custom_refresh(a.$)
  }, la.onFail = function() {
    var a = K._get("onFail", this.id);
    "function" == typeof a && a.call(this), la.onStatusChange("Fail", this)
  }, la.onForbidden = function() {
    la.onStatusChange("Forbidden", this)
  }, la.onAbuse = function() {
    la.onStatusChange("Abuse", this)
  }, la.onError = function() {
    var a = this;
    a.config.mobile ? h._emit("CanvasError", a.id) : (K._put("status", "error", a.id), ja._show("error", a), ia._show("error", a, !1)), clearTimeout(K._get("autoRefresh", a.id));
    var b = K._get("onError", a.id);
    "function" == typeof b && b.call(a), "function" == typeof window.gt_custom_error && window.gt_custom_error(a, a.$)
  }, la.onReady = function() {
    var a = K._get("onReady", this.id);
    "function" == typeof a && a.call(this), "function" == typeof window.onGeetestLoaded && window.onGeetestLoaded(this)
  }, I.prototype.onSuccess = function(a) {
    return K._put("onSuccess", a, this.id), this
  }, I.prototype.onFail = function(a) {
    return K._put("onFail", a, this.id), this
  }, I.prototype.onRefresh = function(a) {
    return K._put("onRefresh", a, this.id), this
  }, I.prototype.onError = function(a) {
    return K._put("onError", a, this.id), this
  }, I.prototype.onStatusChange = function(a) {
    return K._put("onStatusChange", a, this.id), this
  }, I.prototype.onReady = function(a) {
    return K._put("onReady", a, this.id), this
  }, I.prototype.getPasstime = function() {
    return K._get("endTime", this.id) - K._get("startTime", this.id)
  };
  var ma = function(a) {
    var b = K._get("scale", a.id) || 1;
    if (a.config.mobile) {
      var c = a.$(".gt_canvas");
      if (c.style.width = b * c.width + "px", c.style.height = b * c.height + "px", "popup" === a.config.product) {
        var d = a.$(".gt_popup_wrap");
        d.style.marginLeft = "-" + c.width * b / 2 + "px", d.style.marginTop = "-" + c.height * b / 2 + "px"
      }
    } else {
      var e, f = a.$;
      "popup" === a.config.product ? (e = f(".gt_popup_wrap"), "undefined" == typeof e.style.zoom ? K._put("scale", 1, a.id) : e.style.zoom = String(b)) : (e = a.dom, "undefined" == typeof e.style.zoom ? K._put("scale", 1, a.id) : e.style.zoom = String(b))
    }
  };
  return I.prototype.zoom = function(a) {
    var b = this;
    if (!K._get("loaded", b.id)) return h._once("loaded", function() {
      b.zoom(a)
    }, b.id), this;
    var c, d, e = 260,
      f = 520;
    if ("number" == typeof a) c = a;
    else if ("string" == typeof a) {
      if (a.indexOf("px") > -1) d = parseInt(a);
      else if (a.indexOf("%") > -1) {
        var g = window.getComputedStyle(b.dom.parentNode);
        d = parseInt(g.getPropertyValue("width")) * parseInt(a) / 100
      } else d = parseInt(a);
      b.config.mobile ? (c = d / f, c = isNaN(c) ? .5 : c) : (c = d / e, c = isNaN(c) ? 1 : c)
    } else c = b.config.mobile ? .5 : 1;
    return K._put("scale", c, b.id), ma(b), this
  }, I.define = function(a, b, c) {
    d._define(a, b, c)
  }, d._define("Event", function() {
    return h
  }), d._define("Animate", function() {
    return N
  }), d._define("Browser", function() {
    return {
      getCSS3: H
    }
  }), d._define("Request", function() {
    return D
  }), d._define("Data", function() {
    return K
  }), d._define("Decoder", function() {
    return O
  }), d._define("Dom", function() {
    return M
  }), d._define("DomEvent", function() {
    return W
  }), d._define("Info", function() {
    return ia
  }), d._define("Input", function() {
    return ka
  }), d._define("Lang", function() {
    return L
  }), d._define("Popup", function() {
    return ca
  }), d._define("Slide", function() {
    return X
  }), d._define("Tip", function() {
    return ja
  }), d._define("Tool", function() {
    return {
      copy: i,
      toParam: j,
      isFunction: k,
      random: l,
      inArray: m,
      removeProperty: n,
      setText: o,
      slice: p,
      arrayEqual: q,
      diff: r,
      isArray: s,
      zoom: ma
    }
  }), d._define("Analyse", function() {
    return ha
  }), d._define("Global", function() {
    return v
  }), d._define("Flow", function() {
    return c
  }), d._define("Modules", function() {
    return e
  }), d._define("Flow", function() {
    return c
  }), I
});

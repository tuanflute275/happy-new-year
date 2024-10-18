let app = {
  start: function () {
    app.check();
  },
  check: function () {
    if (app.has(document.querySelector("body"))) {
      let t = document.createElement("a");
      (t.className = "avnendv-ad"),
        (t.style.display = "none"),
        t.setAttribute("target", "_blank"),
        t.setAttribute("href", "https://tuanflute275.github.io/introduce/"),
        (t.innerHTML = `
        <div class="hire-me">@tuanflute275<br/>Hire Me!</div>
         <div style="text-align: center;">
         <img src="assets/img/avatar.jpg" alt="avatar">
         <img src="assets/img/qr.png" alt="avatar">
         </div>
      `),
        document.querySelector("body").appendChild(t);
    } else setTimeout(app.check, 100);
  },
};
(app.startUps = []),
  (app.has = function (t) {
    let a = !0;
    for (let p = 0; p <= arguments.length - 1; p++) {
      let e = arguments[p];
      (null != e && "" !== e) || (a = !1);
    }
    return a;
  }),
  (function () {
    if (!0 === app.has(app.api)) {
      let t;
      (t = function (a) {
        if (app.has(a) && !app.has(a.length)) {
          for (let p in a)
            if (!0 === app.has(a[p]))
              for (let e in (t(a[p]), a[p]))
                !(function (t, p) {
                  let e = a[t][p];
                  p.split("Callback").length > 1 &&
                    "function" == typeof e &&
                    ((a[t][p.split("Callback").shift() + "Multi"] =
                      async function (
                        e,
                        n,
                        s,
                        r,
                        i,
                        l,
                        o,
                        c,
                        f,
                        u,
                        h,
                        y,
                        d,
                        b,
                        g,
                        v,
                        $,
                        _
                      ) {
                        return new Promise(function (C, U) {
                          app.has(e) || (e = 1);
                          let w = 0,
                            k;
                          for (let m = 0; m <= e - 1; m++)
                            !(async function (U) {
                              let m = await a[t][p.split("Callback").shift()](
                                n,
                                async function (t, a, p, e, n) {
                                  if ("function" == typeof s) {
                                    let r = await s(t, a, p, e, n);
                                    return (
                                      !0 !== r ||
                                        app.has(k) ||
                                        (console.log("MULTI INDEX:", U),
                                        (k = U)),
                                      r
                                    );
                                  }
                                },
                                r,
                                i,
                                l,
                                o,
                                c,
                                f,
                                u,
                                h,
                                y,
                                d,
                                b,
                                g,
                                v,
                                $,
                                _
                              );
                              (w += 1), (k === U || w >= e) && C(m);
                            })(m);
                        });
                      }),
                    (a[t][p.split("Callback").shift()] = async function (
                      e,
                      n,
                      s,
                      r,
                      i,
                      l,
                      o,
                      c,
                      f,
                      u,
                      h,
                      y,
                      d,
                      b,
                      g,
                      v,
                      $
                    ) {
                      "function" != typeof n &&
                        (($ = g),
                        (v = b),
                        (g = d),
                        (b = y),
                        (d = h),
                        (y = u),
                        (h = f),
                        (u = c),
                        (f = o),
                        (c = l),
                        (o = i),
                        (l = r),
                        (i = s),
                        (r = n),
                        (s = e));
                      let _, C;
                      await a[t][p](
                        async function (t, a) {
                          let p =
                            "function" == typeof n ? await n(t, a) : void 0;
                          return (
                            app.has(p) && app.has(p.length)
                              ? (app.has(_) || (_ = []), (_ = _.concat(p)))
                              : (_ = t),
                            p
                          );
                        },
                        function (t, a) {
                          C = { error: t, errorText: a };
                        },
                        s,
                        r,
                        i,
                        l,
                        o,
                        c,
                        f,
                        u,
                        h,
                        y,
                        d,
                        b,
                        g,
                        v,
                        $
                      );
                      let U = {};
                      return "function" != typeof n
                        ? _
                        : ((U[e] = _), (U.error = C), U);
                    }));
                })(p, e);
        }
      })(app.api);
    }
    "function" == typeof app.start && app.start();
    for (let a = 0; a <= app.startUps.length - 1; a++)
      "function" == typeof app.startUps[a] && app.startUps[a]();
    for (let p = 0; p <= app.startUps.length - 1; p++)
      "function" != typeof app.startUps[p] &&
        setTimeout(app.startUps[p].callback, app.startUps[p].time);
  })();

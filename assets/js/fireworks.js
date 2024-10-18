"use strict";
console.clear();
const IS_MOBILE = window.innerWidth <= 640,
  IS_DESKTOP = window.innerWidth > 800,
  IS_HEADER = IS_DESKTOP && window.innerHeight < 300,
  IS_HIGH_END_DEVICE = (() => {
    let e = navigator.hardwareConcurrency;
    if (!e) return !1;
    let t = window.innerWidth <= 1024 ? 4 : 8;
    return e >= t;
  })(),
  MAX_WIDTH = 7680,
  MAX_HEIGHT = 4320,
  GRAVITY = 0.9;
let simSpeed = 1;
function getDefaultScaleFactor() {
  return IS_MOBILE ? 0.9 : IS_HEADER ? 0.75 : 1;
}
let stageW,
  stageH,
  quality = 1,
  isLowQuality = !1,
  isNormalQuality = !0,
  isHighQuality = !1;
const QUALITY_LOW = 1,
  QUALITY_NORMAL = 2,
  QUALITY_HIGH = 3,
  SKY_LIGHT_NONE = 0,
  SKY_LIGHT_DIM = 1,
  SKY_LIGHT_NORMAL = 2,
  COLOR = {
    Red: "#ff0043",
    Green: "#14fc56",
    Blue: "#1e7fff",
    Purple: "#e60aff",
    Gold: "#ffbf36",
    White: "#ffffff",
  },
  INVISIBLE = "_INVISIBLE_",
  PI_2 = 2 * Math.PI,
  PI_HALF = 0.5 * Math.PI,
  trailsStage = new Stage("trails-canvas"),
  mainStage = new Stage("main-canvas"),
  stages = [trailsStage, mainStage];
function fullscreenEnabled() {
  return fscreen.fullscreenEnabled;
}
function isFullscreen() {
  return !!fscreen.fullscreenElement;
}
function toggleFullscreen() {
  fullscreenEnabled() &&
    (isFullscreen()
      ? fscreen.exitFullscreen()
      : fscreen.requestFullscreen(document.documentElement));
}
fscreen.addEventListener("fullscreenchange", () => {
  store.setState({ fullscreen: isFullscreen() });
});
const store = {
  _listeners: new Set(),
  _dispatch(e) {
    this._listeners.forEach((t) => t(this.state, e));
  },
  state: {
    paused: !0,
    menuOpen: !1,
    openHelpTopic: null,
    fullscreen: isFullscreen(),
    config: {
      quality: String(IS_HIGH_END_DEVICE ? 3 : 2),
      shell: "Random",
      size: IS_DESKTOP ? "3" : IS_HEADER ? "1.2" : "2",
      autoLaunch: !0,
      finale: !1,
      skyLighting: "2",
      hideControls: IS_HEADER,
      longExposure: !1,
      scaleFactor: getDefaultScaleFactor(),
    },
  },
  setState(e) {
    let t = this.state;
    (this.state = Object.assign({}, this.state, e)), this._dispatch(t);
  },
  subscribe(e) {
    return this._listeners.add(e), () => this._listeners.remove(e);
  },
};
function togglePause(e) {
  let t = store.state.paused,
    r;
  (r = "boolean" == typeof e ? e : !t),
    t !== r && store.setState({ paused: r });
}
function updateConfig(e) {
  (e = e || getConfigFromDOM()),
    store.setState({ config: Object.assign({}, store.state.config, e) }),
    configDidUpdate();
}
function configDidUpdate() {
  store.state.config,
    (isLowQuality = 1 === (quality = qualitySelector())),
    (isNormalQuality = 2 === quality),
    (isHighQuality = 3 === quality),
    0 === skyLightingSelector() &&
      (appNodes.canvasContainer.style.backgroundColor = "transparent"),
    (Spark.drawWidth = 3 === quality ? 0.75 : 1);
}
const isRunning = (e = store.state) => !e.paused && !e.menuOpen,
  qualitySelector = () => +store.state.config.quality,
  shellNameSelector = () => store.state.config.shell,
  shellSizeSelector = () => +store.state.config.size,
  finaleSelector = () => store.state.config.finale,
  skyLightingSelector = () => +store.state.config.skyLighting,
  scaleFactorSelector = () => store.state.config.scaleFactor,
  nodeKeyToHelpKey = {
    shellTypeLabel: "shellType",
    shellSizeLabel: "shellSize",
    qualityLabel: "quality",
    skyLightingLabel: "skyLighting",
    scaleFactorLabel: "scaleFactor",
    autoLaunchLabel: "autoLaunch",
    finaleModeLabel: "finaleMode",
    hideControlsLabel: "hideControls",
    fullscreenLabel: "fullscreen",
    longExposureLabel: "longExposure",
  },
  appNodes = {
    stageContainer: ".stage-container__firework",
    canvasContainer: ".canvas-container__firework",
  };
function getConfigFromDOM() {
  return {
    quality: appNodes.quality.value,
    shell: appNodes.shellType.value,
    size: appNodes.shellSize.value,
    autoLaunch: appNodes.autoLaunch.checked,
    finale: appNodes.finaleMode.checked,
    skyLighting: appNodes.skyLighting.value,
    longExposure: appNodes.longExposure.checked,
    hideControls: appNodes.hideControls.checked,
    scaleFactor: parseFloat(appNodes.scaleFactor.value),
  };
}
Object.keys(appNodes).forEach((e) => {
  appNodes[e] = document.querySelector(appNodes[e]);
}),
  fullscreenEnabled() || appNodes.fullscreenFormOption.classList.add("remove");
const updateConfigNoEvent = () => updateConfig(),
  COLOR_NAMES = Object.keys(COLOR),
  COLOR_CODES = COLOR_NAMES.map((e) => COLOR[e]),
  COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE],
  COLOR_CODE_INDEXES = COLOR_CODES_W_INVIS.reduce(
    (e, t, r) => ((e[t] = r), e),
    {}
  ),
  COLOR_TUPLES = {};
function randomColorSimple() {
  return COLOR_CODES[(Math.random() * COLOR_CODES.length) | 0];
}
COLOR_CODES.forEach((e) => {
  COLOR_TUPLES[e] = {
    r: parseInt(e.substr(1, 2), 16),
    g: parseInt(e.substr(3, 2), 16),
    b: parseInt(e.substr(5, 2), 16),
  };
});
let lastColor;
function randomColor(e) {
  let t = e && e.notSame,
    r = e && e.notColor,
    l = e && e.limitWhite,
    o = randomColorSimple();
  if (
    (l && o === COLOR.White && 0.6 > Math.random() && (o = randomColorSimple()),
    t)
  )
    for (; o === lastColor; ) o = randomColorSimple();
  else if (r) for (; o === r; ) o = randomColorSimple();
  return (lastColor = o), o;
}
function whiteOrGold() {
  return 0.5 > Math.random() ? COLOR.Gold : COLOR.White;
}
function makePistilColor(e) {
  return e === COLOR.White || e === COLOR.Gold
    ? randomColor({ notColor: e })
    : whiteOrGold();
}
const crysanthemumShell = (e = 1) => {
    let t = 0.25 > Math.random(),
      r = 0.72 > Math.random(),
      l = r
        ? randomColor({ limitWhite: !0 })
        : [randomColor(), randomColor({ notSame: !0 })],
      o = r && 0.42 > Math.random(),
      a = o && makePistilColor(l),
      i =
        r && (0.2 > Math.random() || l === COLOR.White)
          ? a || randomColor({ notColor: l, limitWhite: !0 })
          : null,
      s = !o && l !== COLOR.White && 0.42 > Math.random(),
      n = t ? 1.1 : 1.25;
    return (
      isLowQuality && (n *= 0.8),
      isHighQuality && (n = 1.2),
      {
        shellSize: e,
        spreadSize: 300 + 100 * e,
        starLife: 900 + 200 * e,
        starDensity: n,
        color: l,
        secondColor: i,
        glitter: t ? "light" : "",
        glitterColor: whiteOrGold(),
        pistil: o,
        pistilColor: a,
        streamers: s,
      }
    );
  },
  ghostShell = (e = 1) => {
    let t = crysanthemumShell(e);
    t.starLife *= 1.5;
    let r = randomColor({ notColor: COLOR.White });
    t.streamers = !0;
    let l = 0.42 > Math.random();
    return (
      l && makePistilColor(r),
      (t.color = INVISIBLE),
      (t.secondColor = r),
      (t.glitter = ""),
      t
    );
  },
  strobeShell = (e = 1) => {
    let t = randomColor({ limitWhite: !0 });
    return {
      shellSize: e,
      spreadSize: 280 + 92 * e,
      starLife: 1100 + 200 * e,
      starLifeVariation: 0.4,
      starDensity: 1.1,
      color: t,
      glitter: "light",
      glitterColor: COLOR.White,
      strobe: !0,
      strobeColor: 0.5 > Math.random() ? COLOR.White : null,
      pistil: 0.5 > Math.random(),
      pistilColor: makePistilColor(t),
    };
  },
  palmShell = (e = 1) => {
    let t = randomColor(),
      r = 0.5 > Math.random();
    return {
      shellSize: e,
      color: t,
      spreadSize: 250 + 75 * e,
      starDensity: r ? 0.15 : 0.4,
      starLife: 1800 + 200 * e,
      glitter: r ? "thick" : "heavy",
    };
  },
  ringShell = (e = 1) => {
    let t = randomColor(),
      r = 0.75 > Math.random();
    return {
      shellSize: e,
      ring: !0,
      color: t,
      spreadSize: 300 + 100 * e,
      starLife: 900 + 200 * e,
      starCount: 2.2 * PI_2 * (e + 1),
      pistil: r,
      pistilColor: makePistilColor(t),
      glitter: r ? "" : "light",
      glitterColor: t === COLOR.Gold ? COLOR.Gold : COLOR.White,
      streamers: 0.3 > Math.random(),
    };
  },
  crossetteShell = (e = 1) => {
    let t = randomColor({ limitWhite: !0 });
    return {
      shellSize: e,
      spreadSize: 300 + 100 * e,
      starLife: 750 + 160 * e,
      starLifeVariation: 0.4,
      starDensity: 0.85,
      color: t,
      crossette: !0,
      pistil: 0.5 > Math.random(),
      pistilColor: makePistilColor(t),
    };
  },
  floralShell = (e = 1) => ({
    shellSize: e,
    spreadSize: 300 + 120 * e,
    starDensity: 0.12,
    starLife: 500 + 50 * e,
    starLifeVariation: 0.5,
    color:
      0.65 > Math.random()
        ? "random"
        : 0.15 > Math.random()
        ? randomColor()
        : [randomColor(), randomColor({ notSame: !0 })],
    floral: !0,
  }),
  fallingLeavesShell = (e = 1) => ({
    shellSize: e,
    color: INVISIBLE,
    spreadSize: 300 + 120 * e,
    starDensity: 0.12,
    starLife: 500 + 50 * e,
    starLifeVariation: 0.5,
    glitter: "medium",
    glitterColor: COLOR.Gold,
    fallingLeaves: !0,
  }),
  willowShell = (e = 1) => ({
    shellSize: e,
    spreadSize: 300 + 100 * e,
    starDensity: 0.6,
    starLife: 3e3 + 300 * e,
    glitter: "willow",
    glitterColor: COLOR.Gold,
    color: INVISIBLE,
  }),
  crackleShell = (e = 1) => {
    let t = 0.75 > Math.random() ? COLOR.Gold : randomColor();
    return {
      shellSize: e,
      spreadSize: 380 + 75 * e,
      starDensity: isLowQuality ? 0.65 : 1,
      starLife: 600 + 100 * e,
      starLifeVariation: 0.32,
      glitter: "light",
      glitterColor: COLOR.Gold,
      color: t,
      crackle: !0,
      pistil: 0.65 > Math.random(),
      pistilColor: makePistilColor(t),
    };
  },
  horsetailShell = (e = 1) => {
    let t = randomColor();
    return {
      shellSize: e,
      horsetail: !0,
      color: t,
      spreadSize: 250 + 38 * e,
      starDensity: 0.9,
      starLife: 2500 + 300 * e,
      glitter: "medium",
      glitterColor: 0.5 > Math.random() ? whiteOrGold() : t,
      strobe: t === COLOR.White,
    };
  };
function randomShellName() {
  return 0.5 > Math.random()
    ? "Crysanthemum"
    : shellNames[(Math.random() * (shellNames.length - 1) + 1) | 0];
}
function randomShell(e) {
  return IS_HEADER ? randomFastShell()(e) : shellTypes[randomShellName()](e);
}
function shellFromConfig(e) {
  return shellTypes[shellNameSelector()](e);
}
const fastShellBlacklist = ["Falling Leaves", "Floral", "Willow"];
function randomFastShell() {
  let e = "Random" === shellNameSelector(),
    t = e ? randomShellName() : shellNameSelector();
  if (e) for (; fastShellBlacklist.includes(t); ) t = randomShellName();
  return shellTypes[t];
}
const shellTypes = {
    Random: randomShell,
    Crackle: crackleShell,
    Crossette: crossetteShell,
    Crysanthemum: crysanthemumShell,
    "Falling Leaves": fallingLeavesShell,
    Floral: floralShell,
    Ghost: ghostShell,
    "Horse Tail": horsetailShell,
    Palm: palmShell,
    Ring: ringShell,
    Strobe: strobeShell,
    Willow: willowShell,
  },
  shellNames = Object.keys(shellTypes);
function init() {
  togglePause(!1), configDidUpdate();
}
function fitShellPositionInBoundsH(e) {
  return 0.64 * e + 0.18;
}
function fitShellPositionInBoundsV(e) {
  return 0.75 * e;
}
function getRandomShellPositionH() {
  return fitShellPositionInBoundsH(Math.random());
}
function getRandomShellPositionV() {
  return fitShellPositionInBoundsV(Math.random());
}
function getRandomShellSize() {
  let e = shellSizeSelector(),
    t = Math.min(2.5, e),
    r = Math.random() * t,
    l = 0 === t ? Math.random() : 1 - r / t,
    o = Math.random() * (1 - 0.65 * l) * 0.5;
  return {
    size: e - r,
    x: fitShellPositionInBoundsH(0.5 > Math.random() ? 0.5 - o : 0.5 + o),
    height: fitShellPositionInBoundsV(l),
  };
}
function launchShellFromConfig(e) {
  let t = new Shell(shellFromConfig(shellSizeSelector())),
    r = mainStage.width,
    l = mainStage.height;
  t.launch(
    e ? e.x / r : getRandomShellPositionH(),
    e ? 1 - e.y / l : getRandomShellPositionV()
  );
}
function seqRandomShell() {
  let e = getRandomShellSize(),
    t = new Shell(shellFromConfig(e.size));
  t.launch(e.x, e.height);
  let r = t.starLife;
  return t.fallingLeaves && (r = 4600), 900 + 600 * Math.random() + r;
}
function seqRandomFastShell() {
  let e = randomFastShell(),
    t = getRandomShellSize(),
    r = new Shell(e(t.size));
  return r.launch(t.x, t.height), 900 + 600 * Math.random() + r.starLife;
}
function seqTwoRandom() {
  let e = getRandomShellSize(),
    t = getRandomShellSize(),
    r = new Shell(shellFromConfig(e.size)),
    l = new Shell(shellFromConfig(t.size)),
    o = 0.2 * Math.random() - 0.1;
  r.launch(0.3 + (0.2 * Math.random() - 0.1), e.height),
    setTimeout(() => {
      l.launch(0.7 + o, t.height);
    }, 100);
  let a = Math.max(r.starLife, l.starLife);
  return (
    (r.fallingLeaves || l.fallingLeaves) && (a = 4600),
    900 + 600 * Math.random() + a
  );
}
function seqTriple() {
  let e = randomFastShell(),
    t = shellSizeSelector(),
    r = Math.max(0, t - 1.25),
    l = new Shell(e(t));
  return (
    l.launch(0.5 + (0.08 * Math.random() - 0.04), 0.7),
    setTimeout(() => {
      let t = new Shell(e(r));
      t.launch(0.2 + (0.08 * Math.random() - 0.04), 0.1);
    }, 1e3 + 400 * Math.random()),
    setTimeout(() => {
      let t = new Shell(e(r));
      t.launch(0.8 + (0.08 * Math.random() - 0.04), 0.1);
    }, 1e3 + 400 * Math.random()),
    4e3
  );
}
function seqPyramid() {
  let e = IS_DESKTOP ? 7 : 4,
    t = shellSizeSelector(),
    r = Math.max(0, t - 3),
    l = 0.78 > Math.random() ? crysanthemumShell : ringShell,
    o = randomShell;
  function a(e, a) {
    let i = "Random" === shellNameSelector(),
      s = i ? (a ? o : l) : shellTypes[shellNameSelector()],
      n = new Shell(s(a ? t : r));
    n.launch(e, a ? 0.75 : 0.42 * (e <= 0.5 ? e / 0.5 : (1 - e) / 0.5));
  }
  let i = 0,
    s = 0;
  for (; i <= e; ) {
    if (i === e)
      setTimeout(() => {
        a(0.5, !0);
      }, s);
    else {
      let n = (i / e) * 0.5,
        $ = 30 * Math.random() + 30;
      setTimeout(() => {
        a(n, !1);
      }, s),
        setTimeout(() => {
          a(1 - n, !1);
        }, s + $);
    }
    i++, (s += 200);
  }
  return 3400 + 250 * e;
}
function seqSmallBarrage() {
  seqSmallBarrage.lastCalled = Date.now();
  let e = IS_DESKTOP ? 11 : 5,
    t = IS_DESKTOP ? 3 : 1,
    r = Math.max(0, shellSizeSelector() - 2),
    l = 0.78 > Math.random() ? crysanthemumShell : ringShell,
    o = randomFastShell();
  function a(e, t) {
    let a = "Random" === shellNameSelector(),
      i = a ? (t ? o : l) : shellTypes[shellNameSelector()],
      s = new Shell(i(r));
    s.launch(e, 0.75 * ((Math.cos(5 * e * Math.PI + PI_HALF) + 1) / 2));
  }
  let i = 0,
    s = 0;
  for (; i < e; ) {
    if (0 === i) a(0.5, !1), (i += 1);
    else {
      let n = (i + 1) / e / 2,
        $ = 30 * Math.random() + 30,
        d = i === t;
      setTimeout(() => {
        a(0.5 + n, d);
      }, s),
        setTimeout(() => {
          a(0.5 - n, d);
        }, s + $),
        (i += 2);
    }
    s += 200;
  }
  return 3400 + 120 * e;
}
(seqSmallBarrage.cooldown = 15e3), (seqSmallBarrage.lastCalled = Date.now());
const sequences = [
  seqRandomShell,
  seqTwoRandom,
  seqTriple,
  seqPyramid,
  seqSmallBarrage,
];
let isFirstSeq = !0;
const finaleCount = 32;
let currentFinaleCount = 0;
function startSequence() {
  if (isFirstSeq) {
    if (((isFirstSeq = !1), IS_HEADER)) return seqTwoRandom();
    {
      let e = new Shell(crysanthemumShell(shellSizeSelector()));
      return e.launch(0.5, 0.5), 2400;
    }
  }
  if (finaleSelector())
    return (seqRandomFastShell(), currentFinaleCount < 32)
      ? (currentFinaleCount++, 170)
      : ((currentFinaleCount = 0), 6e3);
  let t = Math.random();
  return t < 0.08 &&
    Date.now() - seqSmallBarrage.lastCalled > seqSmallBarrage.cooldown
    ? seqSmallBarrage()
    : t < 0.1
    ? seqPyramid()
    : t < 0.6 && !IS_HEADER
    ? seqRandomShell()
    : t < 0.8
    ? seqTwoRandom()
    : t < 1
    ? seqTriple()
    : void 0;
}
let activePointerCount = 0,
  isUpdatingSpeed = !1;
function handlePointerStart(e) {
  activePointerCount++,
    (!(e.y < 50) ||
      !(e.x > mainStage.width / 2 - 25) ||
      !(e.x < mainStage.width / 2 + 25)) &&
      isRunning() &&
      (updateSpeedFromEvent(e)
        ? (isUpdatingSpeed = !0)
        : e.onCanvas && launchShellFromConfig(e));
}
function handlePointerEnd(e) {
  activePointerCount--, (isUpdatingSpeed = !1);
}
function handlePointerMove(e) {
  isRunning() && isUpdatingSpeed && updateSpeedFromEvent(e);
}
function handleResize() {
  let e = window.innerWidth,
    t = window.innerHeight,
    r = Math.min(e, 7680),
    l = e <= 420 ? t : Math.min(t, 4320);
  (appNodes.stageContainer.style.width = r + "px"),
    (appNodes.stageContainer.style.height = l + "px"),
    stages.forEach((e) => e.resize(r, l));
  let o = scaleFactorSelector();
  (stageW = r / o), (stageH = l / o);
}
mainStage.addEventListener("pointerstart", handlePointerStart),
  mainStage.addEventListener("pointerend", handlePointerEnd),
  mainStage.addEventListener("pointermove", handlePointerMove),
  handleResize(),
  window.addEventListener("resize", handleResize);
let currentFrame = 0,
  speedBarOpacity = 0,
  autoLaunchTime = 0;
function updateSpeedFromEvent(e) {
  if (isUpdatingSpeed || e.y >= mainStage.height - 44) {
    let t = (e.x - 16) / (mainStage.width - 32);
    return (simSpeed = Math.min(Math.max(t, 0), 1)), (speedBarOpacity = 1), !0;
  }
  return !1;
}
function updateGlobals(e, t) {
  currentFrame++,
    !isUpdatingSpeed &&
      (speedBarOpacity -= t / 30) < 0 &&
      (speedBarOpacity = 0),
    store.state.config.autoLaunch &&
      (autoLaunchTime -= e) <= 0 &&
      (autoLaunchTime = 1.25 * startSequence());
}
function update(e, t) {
  if (!isRunning()) return;
  let r = e * simSpeed,
    l = simSpeed * t;
  updateGlobals(r, t);
  let o = 1 - (1 - Star.airDrag) * l,
    a = 1 - (1 - Star.airDragHeavy) * l,
    i = 1 - (1 - Spark.airDrag) * l,
    s = (r / 1e3) * 0.9;
  COLOR_CODES_W_INVIS.forEach((e) => {
    let t = Star.active[e];
    for (let n = t.length - 1; n >= 0; n -= 1) {
      let $ = t[n];
      if ($.updateFrame !== currentFrame) {
        if ((($.updateFrame = currentFrame), ($.life -= r), $.life <= 0))
          t.splice(n, 1), Star.returnInstance($);
        else {
          let d = Math.pow($.life / $.fullLife, 0.5),
            h = 1 - d;
          if (
            (($.prevX = $.x),
            ($.prevY = $.y),
            ($.x += $.speedX * l),
            ($.y += $.speedY * l),
            $.heavy
              ? (($.speedX *= a), ($.speedY *= a))
              : (($.speedX *= o), ($.speedY *= o)),
            ($.speedY += s),
            $.spinRadius &&
              (($.spinAngle += $.spinSpeed * l),
              ($.x += Math.sin($.spinAngle) * $.spinRadius * l),
              ($.y += Math.cos($.spinAngle) * $.spinRadius * l)),
            $.sparkFreq)
          )
            for ($.sparkTimer -= r; $.sparkTimer < 0; )
              ($.sparkTimer += 0.75 * $.sparkFreq + $.sparkFreq * h * 4),
                Spark.add(
                  $.x,
                  $.y,
                  $.sparkColor,
                  Math.random() * PI_2,
                  Math.random() * $.sparkSpeed * d,
                  0.8 * $.sparkLife +
                    Math.random() * $.sparkLifeVariation * $.sparkLife
                );
          $.life < $.transitionTime &&
            ($.secondColor &&
              !$.colorChanged &&
              (($.colorChanged = !0),
              ($.color = $.secondColor),
              t.splice(n, 1),
              Star.active[$.secondColor].push($),
              $.secondColor === INVISIBLE && ($.sparkFreq = 0)),
            $.strobe &&
              ($.visible = Math.floor($.life / $.strobeFreq) % 3 == 0));
        }
      }
    }
    let c = Spark.active[e];
    for (let S = c.length - 1; S >= 0; S -= 1) {
      let u = c[S];
      (u.life -= r),
        u.life <= 0
          ? (c.splice(S, 1), Spark.returnInstance(u))
          : ((u.prevX = u.x),
            (u.prevY = u.y),
            (u.x += u.speedX * l),
            (u.y += u.speedY * l),
            (u.speedX *= i),
            (u.speedY *= i),
            (u.speedY += s));
    }
  }),
    render(l);
}
function render(e) {
  let { dpr: t } = mainStage,
    r = stageW,
    l = stageH,
    o = trailsStage.ctx,
    a = mainStage.ctx;
  0 !== skyLightingSelector() && colorSky(e);
  let i = scaleFactorSelector();
  for (
    o.scale(t * i, t * i),
      a.scale(t * i, t * i),
      o.globalCompositeOperation = "source-over",
      o.fillStyle = `rgba(0, 0, 0, ${
        store.state.config.longExposure ? 0.0025 : 0.175 * e
      })`,
      o.fillRect(0, 0, r, l),
      a.clearRect(0, 0, r, l);
    BurstFlash.active.length;

  ) {
    let s = BurstFlash.active.pop(),
      n = o.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
    n.addColorStop(0.024, "rgba(255, 255, 255, 1)"),
      n.addColorStop(0.125, "rgba(255, 160, 20, 0.2)"),
      n.addColorStop(0.32, "rgba(255, 140, 20, 0.11)"),
      n.addColorStop(1, "rgba(255, 120, 20, 0)"),
      (o.fillStyle = n),
      o.fillRect(s.x - s.radius, s.y - s.radius, 2 * s.radius, 2 * s.radius),
      BurstFlash.returnInstance(s);
  }
  (o.globalCompositeOperation = "lighten"),
    (o.lineWidth = Star.drawWidth),
    (o.lineCap = isLowQuality ? "square" : "round"),
    (a.strokeStyle = "#fff"),
    (a.lineWidth = 1),
    a.beginPath(),
    COLOR_CODES.forEach((e) => {
      let t = Star.active[e];
      (o.strokeStyle = e),
        o.beginPath(),
        t.forEach((e) => {
          e.visible &&
            (o.moveTo(e.x, e.y),
            o.lineTo(e.prevX, e.prevY),
            a.moveTo(e.x, e.y),
            a.lineTo(e.x - 1.6 * e.speedX, e.y - 1.6 * e.speedY));
        }),
        o.stroke();
    }),
    a.stroke(),
    (o.lineWidth = Spark.drawWidth),
    (o.lineCap = "butt"),
    COLOR_CODES.forEach((e) => {
      let t = Spark.active[e];
      (o.strokeStyle = e),
        o.beginPath(),
        t.forEach((e) => {
          o.moveTo(e.x, e.y), o.lineTo(e.prevX, e.prevY);
        }),
        o.stroke();
    }),
    speedBarOpacity &&
      ((a.globalAlpha = speedBarOpacity),
      (a.fillStyle = COLOR.Blue),
      a.fillRect(0, l - 6, r * simSpeed, 6),
      (a.globalAlpha = 1)),
    o.setTransform(1, 0, 0, 1, 0, 0),
    a.setTransform(1, 0, 0, 1, 0, 0);
}
const currentSkyColor = { r: 0, g: 0, b: 0 },
  targetSkyColor = { r: 0, g: 0, b: 0 };
function colorSky(e) {
  let t = 15 * skyLightingSelector(),
    r = 0;
  (targetSkyColor.r = 0),
    (targetSkyColor.g = 0),
    (targetSkyColor.b = 0),
    COLOR_CODES.forEach((e) => {
      let t = COLOR_TUPLES[e],
        l = Star.active[e].length;
      (r += l),
        (targetSkyColor.r += t.r * l),
        (targetSkyColor.g += t.g * l),
        (targetSkyColor.b += t.b * l);
    });
  let l = Math.pow(Math.min(1, r / 500), 0.3),
    o = Math.max(1, targetSkyColor.r, targetSkyColor.g, targetSkyColor.b);
  (targetSkyColor.r = (targetSkyColor.r / o) * t * l),
    (targetSkyColor.g = (targetSkyColor.g / o) * t * l),
    (targetSkyColor.b = (targetSkyColor.b / o) * t * l),
    (currentSkyColor.r += ((targetSkyColor.r - currentSkyColor.r) / 10) * e),
    (currentSkyColor.g += ((targetSkyColor.g - currentSkyColor.g) / 10) * e),
    (currentSkyColor.b += ((targetSkyColor.b - currentSkyColor.b) / 10) * e),
    (appNodes.canvasContainer.style.backgroundColor = `rgb(${
      0 | currentSkyColor.r
    }, ${0 | currentSkyColor.g}, ${0 | currentSkyColor.b})`);
}
function createParticleArc(e, t, r, l, o) {
  let a = t / r,
    i = e + t - 0.5 * a;
  if (i > e) for (let s = e; s < i; s += a) o(s + Math.random() * a * l);
  else for (let n = e; n > i; n += a) o(n + Math.random() * a * l);
}
function createBurst(e, t, r = 0, l = PI_2) {
  let o = 2 * (0.5 * Math.sqrt(e / Math.PI)) * Math.PI,
    a = o / 2;
  for (let i = 0; i <= a; i++) {
    let s = (i / a) * PI_HALF,
      n = Math.cos(s),
      $ = o * n,
      d = $ * (l / PI_2),
      h = PI_2 / $,
      c = Math.random() * h + r,
      S = 0.33 * h;
    for (let u = 0; u < d; u++) {
      let p = Math.random() * S;
      t(h * u + c + p, n);
    }
  }
}
function crossetteEffect(e) {
  createParticleArc(Math.random() * PI_HALF, PI_2, 4, 0.5, (t) => {
    Star.add(e.x, e.y, e.color, t, 0.6 * Math.random() + 0.75, 600);
  });
}
function floralEffect(e) {
  let t = 12 + 6 * quality;
  createBurst(t, (t, r) => {
    Star.add(
      e.x,
      e.y,
      e.color,
      t,
      2.4 * r,
      1e3 + 300 * Math.random(),
      e.speedX,
      e.speedY
    );
  }),
    BurstFlash.add(e.x, e.y, 46);
}
function fallingLeavesEffect(e) {
  createBurst(7, (t, r) => {
    let l = Star.add(
      e.x,
      e.y,
      INVISIBLE,
      t,
      2.4 * r,
      2400 + 600 * Math.random(),
      e.speedX,
      e.speedY
    );
    (l.sparkColor = COLOR.Gold),
      (l.sparkFreq = 144 / quality),
      (l.sparkSpeed = 0.28),
      (l.sparkLife = 750),
      (l.sparkLifeVariation = 3.2);
  }),
    BurstFlash.add(e.x, e.y, 46);
}
function crackleEffect(e) {
  let t = isHighQuality ? 32 : 16;
  createParticleArc(0, PI_2, t, 1.8, (t) => {
    Spark.add(
      e.x,
      e.y,
      COLOR.Gold,
      t,
      2.4 * Math.pow(Math.random(), 0.45),
      300 + 200 * Math.random()
    );
  });
}
mainStage.addEventListener("ticker", update);
class Shell {
  constructor(e) {
    if (
      (Object.assign(this, e),
      (this.starLifeVariation = e.starLifeVariation || 0.125),
      (this.color = e.color || randomColor()),
      (this.glitterColor = e.glitterColor || this.color),
      !this.starCount)
    ) {
      let t = e.starDensity || 1,
        r = this.spreadSize / 54;
      this.starCount = Math.max(6, r * r * t);
    }
  }
  launch(e, t) {
    let r = stageW,
      l = stageH,
      o = l - 0.45 * l,
      a = l,
      i = Math.pow(0.04 * (a - (o - t * (o - 50))), 0.64),
      s = (this.comet = Star.add(
        e * (r - 120) + 60,
        a,
        "string" == typeof this.color && "random" !== this.color
          ? this.color
          : COLOR.White,
        Math.PI,
        i * (this.horsetail ? 1.2 : 1),
        i * (this.horsetail ? 100 : 400)
      ));
    (s.heavy = !0),
      (s.spinRadius = MyMath.random(0.32, 0.85)),
      (s.sparkFreq = 32 / quality),
      isHighQuality && (s.sparkFreq = 8),
      (s.sparkLife = 320),
      (s.sparkLifeVariation = 3),
      ("willow" === this.glitter || this.fallingLeaves) &&
        ((s.sparkFreq = 20 / quality),
        (s.sparkSpeed = 0.5),
        (s.sparkLife = 500)),
      this.color === INVISIBLE && (s.sparkColor = COLOR.Gold),
      Math.random() > 0.4 &&
        !this.horsetail &&
        ((s.secondColor = INVISIBLE),
        (s.transitionTime = 700 * Math.pow(Math.random(), 1.5) + 500)),
      (s.onDeath = (e) => this.burst(e.x, e.y));
  }
  burst(e, t) {
    let r = this.spreadSize / 96,
      l,
      o,
      a,
      i,
      s,
      n = 0.25,
      $ = !1;
    this.crossette &&
      (o = (e) => {
        $ || ($ = !0), crossetteEffect(e);
      }),
      this.crackle &&
        (o = (e) => {
          $ || ($ = !0), crackleEffect(e);
        }),
      this.floral && (o = floralEffect),
      this.fallingLeaves && (o = fallingLeavesEffect),
      "light" === this.glitter
        ? ((a = 400), (i = 0.3), (s = 300), (n = 2))
        : "medium" === this.glitter
        ? ((a = 200), (i = 0.44), (s = 700), (n = 2))
        : "heavy" === this.glitter
        ? ((a = 80), (i = 0.8), (s = 1400), (n = 2))
        : "thick" === this.glitter
        ? ((a = 16), (i = isHighQuality ? 1.65 : 1.5), (s = 1400), (n = 3))
        : "streamer" === this.glitter
        ? ((a = 32), (i = 1.05), (s = 620), (n = 2))
        : "willow" === this.glitter &&
          ((a = 120), (i = 0.34), (s = 1400), (n = 3.8)),
      (a /= quality);
    let d = ($, d) => {
      let h = this.spreadSize / 1800,
        c = Star.add(
          e,
          t,
          l || randomColor(),
          $,
          d * r,
          this.starLife +
            Math.random() * this.starLife * this.starLifeVariation,
          this.horsetail ? this.comet && this.comet.speedX : 0,
          this.horsetail ? this.comet && this.comet.speedY : -h
        );
      this.secondColor &&
        ((c.transitionTime = this.starLife * (0.05 * Math.random() + 0.32)),
        (c.secondColor = this.secondColor)),
        this.strobe &&
          ((c.transitionTime = this.starLife * (0.08 * Math.random() + 0.46)),
          (c.strobe = !0),
          (c.strobeFreq = 20 * Math.random() + 40),
          this.strobeColor && (c.secondColor = this.strobeColor)),
        (c.onDeath = o),
        this.glitter &&
          ((c.sparkFreq = a),
          (c.sparkSpeed = i),
          (c.sparkLife = s),
          (c.sparkLifeVariation = n),
          (c.sparkColor = this.glitterColor),
          (c.sparkTimer = Math.random() * c.sparkFreq));
    };
    if ("string" == typeof this.color) {
      if (((l = "random" === this.color ? null : this.color), this.ring)) {
        let h = Math.random() * Math.PI,
          c = 0.85 * Math.pow(Math.random(), 2) + 0.15;
        createParticleArc(0, PI_2, this.starCount, 0, (o) => {
          let $ = Math.sin(o) * r * c,
            d = Math.cos(o) * r,
            S = MyMath.pointDist(0, 0, $, d),
            u = MyMath.pointAngle(0, 0, $, d) + h,
            p = Star.add(
              e,
              t,
              l,
              u,
              S,
              this.starLife +
                Math.random() * this.starLife * this.starLifeVariation
            );
          this.glitter &&
            ((p.sparkFreq = a),
            (p.sparkSpeed = i),
            (p.sparkLife = s),
            (p.sparkLifeVariation = n),
            (p.sparkColor = this.glitterColor),
            (p.sparkTimer = Math.random() * p.sparkFreq));
        });
      } else createBurst(this.starCount, d);
    } else if (Array.isArray(this.color)) {
      if (0.5 > Math.random()) {
        let S = Math.random() * Math.PI,
          u = Math.PI;
        (l = this.color[0]),
          createBurst(this.starCount, d, S, u),
          (l = this.color[1]),
          createBurst(this.starCount, d, S + Math.PI, u);
      } else
        (l = this.color[0]),
          createBurst(this.starCount / 2, d),
          (l = this.color[1]),
          createBurst(this.starCount / 2, d);
    } else
      throw Error(
        "Invalid shell color. Expected string or array of strings, but got: " +
          this.color
      );
    if (this.pistil) {
      let p = new Shell({
        spreadSize: 0.5 * this.spreadSize,
        starLife: 0.6 * this.starLife,
        starLifeVariation: this.starLifeVariation,
        starDensity: 1.4,
        color: this.pistilColor,
        glitter: "light",
        glitterColor:
          this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White,
      });
      p.burst(e, t);
    }
    if (this.streamers) {
      let m = new Shell({
        spreadSize: 0.9 * this.spreadSize,
        starLife: 0.8 * this.starLife,
        starLifeVariation: this.starLifeVariation,
        starCount: Math.floor(Math.max(6, this.spreadSize / 45)),
        color: COLOR.White,
        glitter: "streamer",
      });
      m.burst(e, t);
    }
    BurstFlash.add(e, t, this.spreadSize / 4);
  }
}
const BurstFlash = {
  active: [],
  _pool: [],
  _new: () => ({}),
  add(e, t, r) {
    let l = this._pool.pop() || this._new();
    return (l.x = e), (l.y = t), (l.radius = r), this.active.push(l), l;
  },
  returnInstance(e) {
    this._pool.push(e);
  },
};
function createParticleCollection() {
  let e = {};
  return (
    COLOR_CODES_W_INVIS.forEach((t) => {
      e[t] = [];
    }),
    e
  );
}
const Star = {
    drawWidth: 3,
    airDrag: 0.98,
    airDragHeavy: 0.992,
    active: createParticleCollection(),
    _pool: [],
    _new: () => ({}),
    add(e, t, r, l, o, a, i, s) {
      let n = this._pool.pop() || this._new();
      return (
        (n.visible = !0),
        (n.heavy = !1),
        (n.x = e),
        (n.y = t),
        (n.prevX = e),
        (n.prevY = t),
        (n.color = r),
        (n.speedX = Math.sin(l) * o + (i || 0)),
        (n.speedY = Math.cos(l) * o + (s || 0)),
        (n.life = a),
        (n.fullLife = a),
        (n.spinAngle = Math.random() * PI_2),
        (n.spinSpeed = 0.8),
        (n.spinRadius = 0),
        (n.sparkFreq = 0),
        (n.sparkSpeed = 1),
        (n.sparkTimer = 0),
        (n.sparkColor = r),
        (n.sparkLife = 750),
        (n.sparkLifeVariation = 0.25),
        (n.strobe = !1),
        this.active[r].push(n),
        n
      );
    },
    returnInstance(e) {
      e.onDeath && e.onDeath(e),
        (e.onDeath = null),
        (e.secondColor = null),
        (e.transitionTime = 0),
        (e.colorChanged = !1),
        this._pool.push(e);
    },
  },
  Spark = {
    drawWidth: 0,
    airDrag: 0.9,
    active: createParticleCollection(),
    _pool: [],
    _new: () => ({}),
    add(e, t, r, l, o, a) {
      let i = this._pool.pop() || this._new();
      return (
        (i.x = e),
        (i.y = t),
        (i.prevX = e),
        (i.prevY = t),
        (i.color = r),
        (i.speedX = Math.sin(l) * o),
        (i.speedY = Math.cos(l) * o),
        (i.life = a),
        this.active[r].push(i),
        i
      );
    },
    returnInstance(e) {
      this._pool.push(e);
    },
  };
IS_HEADER ? init() : setTimeout(init, 0);

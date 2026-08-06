const canvas = document.getElementById("canvasSnow"),
  ctx = canvas.getContext("2d"),
  things = [],
  thingsCount = window.innerWidth > 1024 ? 170 : 45,
  mouse = { x: -100, y: -100 },
  minDist = 125;
function sizeCanvas() {
  canvas &&
    ((canvas.width = window.innerWidth),
    (canvas.height = document.querySelector("body").offsetHeight));
}
sizeCanvas();
// Trộn 2 loại hoa Tết rơi: hoa đào (hồng, miền Bắc) và hoa mai (vàng, miền Nam).
// Cả 2 ảnh đều vuông (tỉ lệ 1:1) nên dùng chung 1 công thức width=height.
const imageDao = new Image();
imageDao.src = "assets/img/hoa_dao.png";
const imageMai = new Image();
imageMai.src = "assets/img/hoa_mai.png";

for (let i = 0; i < thingsCount; i++) {
  let a = Math.random() * 0.5 + 0.5,
    t = (Math.floor(16 * Math.random()) + 12) * (a + 0.15),
    n = 3 * Math.random() + 0.5;
  things.push({
    width: t,
    height: t,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - t,
    speed: n,
    vY: n,
    vX: 0,
    d: 1.2 * Math.random() - 0.6,
    stepSize: Math.random() / 20,
    step: 0,
    angle: 180 * Math.random() - 90,
    rad: Math.random(),
    opacity: a,
    _ratate: Math.random(),
    type: Math.random() < 0.45 ? "mai" : "dao",
  });
}
function drawThings() {
  things.map((a) => {
    ctx.beginPath(), (a.rad = (a.angle * Math.PI) / 180), ctx.save();
    let t = a.x + a.width / 2,
      e = a.y + a.height / 2;
    (ctx.globalAlpha = a.opacity),
      ctx.setTransform(
        Math.cos(a.rad),
        Math.sin(a.rad),
        -Math.sin(a.rad),
        Math.cos(a.rad),
        t - t * Math.cos(a.rad) + e * Math.sin(a.rad),
        e - t * Math.sin(a.rad) - e * Math.cos(a.rad)
      ),
      ctx.drawImage(a.type === "mai" ? imageMai : imageDao, a.x, a.y, a.width, a.height),
      ctx.restore();
  });
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height), drawThings();
}
function update() {
  things.map((a) => {
    let t = Math.sqrt((a.x - mouse.x) ** 2 + (a.y - mouse.y) ** 2);
    if (t < 125) {
      let e = (mouse.x - a.x) / t,
        n = (mouse.y - a.y) / t,
        s = 2 * (125 / (t * t));
      (a.vX -= s * e), (a.vY -= s * n), a.d * e > 0 && (a.d = 0 - a.d);
    } else
      (a.vX *= 0.98),
        a.vY < a.speed && (a.vY = a.speed),
        (a.vX += Math.cos((a.step += 0.05 * Math.random())) * a.stepSize);
    (a.y += a.vY), (a.x += a.vX + a.d);
    let d = Math.random() + 0.2;
    0 == a._ratate ? (a.angle += d) : (a.angle -= d),
      a.y > canvas.height && reset(a),
      (a.x > canvas.width || a.x < 0 - a.width) && reset(a);
  });
}
function reset(a) {
  (a.opacity = Math.random() * 0.5 + 0.5),
    (a.width = (Math.floor(16 * Math.random()) + 12) * (a.opacity + 0.15)),
    (a.height = a.width),
    (a.x = Math.floor(Math.random() * canvas.width)),
    (a.y = 0 - a.height),
    (a.speed = 3 * Math.random() + 0.5),
    (a.vY = a.speed),
    (a.vX = 0),
    (a._ratate = Math.random());
}
function tick() {
  if (window.isLiteMode) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(tick);
    return;
  }
  canvas && (draw(), update(), requestAnimationFrame(tick));
}
window.addEventListener("resize", sizeCanvas), tick();

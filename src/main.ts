const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  x: number;
  y: number;
  radius: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.ctx = ctx;
  }
  render() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

class Projectile {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  ctx: CanvasRenderingContext2D;
  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    velocity: {
      x: number;
      y: number;
    },
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.ctx = ctx;
  }
  render() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
  update() {
    this.render();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
let animateId: number | false;
const player = new Player(
  canvas.width / 2,
  canvas.height / 2,
  50,
  "white",
  ctx,
);
player.render();
const projectiles: Projectile[] = [];
const enemies: Enemy[] = [];

window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2,
  );
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  };
  projectiles.push(
    new Projectile(
      canvas.width / 2,
      canvas.height / 2,
      10,
      "red",
      velocity,
      ctx,
    ),
  );
  if (animateId !== false) animate();
});

class Enemy {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  ctx: CanvasRenderingContext2D;
  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    velocity: {
      x: number;
      y: number;
    },
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.ctx = ctx;
  }
  render() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
  update() {
    this.render();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 10) + 10;
    const x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    const y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const color = "green";
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity, ctx));
    if (animateId !== false) animate();
  }, 1000);
}

spawnEnemies();

function animate() {
  animateId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render();
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(projectileIndex, 1);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distance - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(typeof animateId !== "boolean" ? animateId : 0);
      animateId = false;
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y,
      );
      if (distance - enemy.radius - projectile.radius < 1) {
        enemies.splice(enemyIndex, 1);
        projectiles.splice(projectileIndex, 1);
      }
    });
  });
}

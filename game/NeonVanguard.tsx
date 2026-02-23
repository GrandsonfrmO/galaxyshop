import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../context/AppContext';
import { Play, Shield, RefreshCw, Skull, Pause } from 'lucide-react';

const POOL_SIZE_PROJ = 300;
const POOL_SIZE_PARTICLES = 250;
const PLAYER_DRAG_SPEED = 0.15;
const PLAYER_FIRE_RATE = 160;
const SCREEN_SHAKE_DECAY = 0.9;
const STAR_COUNT = 150;

type Vector2 = { x: number; y: number };
type EntityType = 'PLAYER' | 'TIE_FIGHTER' | 'TIE_INTERCEPTOR' | 'TIE_BOMBER' | 'TIE_DEFENDER' | 'STAR_DESTROYER' | 'ASTEROID' | 'BONUS_R2' | 'BONUS_WEAPON' | 'BONUS_TORPEDO' | 'BONUS_RAPID';

interface GameObject {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  type?: EntityType;
  hp: number;
  maxHp: number;
  iframe: number;
  scoreValue?: number;
  lastShot?: number;
  fireRate?: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Pool<T extends GameObject> {
  items: T[];
  constructor(size: number, factory: () => T) {
    this.items = new Array(size).fill(null).map(factory);
  }
  get(): T | null {
    return this.items.find(i => !i.active) || null;
  }
  reset() {
    this.items.forEach(i => i.active = false);
  }
}

const audioCtxRef = { current: null as AudioContext | null };

const getAudioContext = () => {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtxRef.current;
};

const checkAABBCollision = (a: HitBox, b: HitBox): boolean => {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

const MISSIONS = [
  { title: "PATROUILLE TATOOINE", text: "Secteur calme. Interceptez les éclaireurs TIE isolés." },
  { title: "CHAMP D'ASTÉROÏDES", text: "Attention pilote ! Navigation dangereuse. Évitez les impacts." },
  { title: "ESCADRONS D'ÉLITE", text: "Intercepteurs TIE détectés. Ils sont rapides. Restez sur vos gardes." },
  { title: "BLOCUS IMPÉRIAL", text: "Bombardiers en approche. Protégez la flotte rebelle." },
  { title: "PROTOTYPE DÉFENSEUR", text: "Alerte ! Nouveaux TIE Defenders détectés. Puissance de feu extrême." },
  { title: "LE DESTROYER", text: "Destroyer Stellaire en vue ! Visez le générateur de bouclier central !" },
];

export const NeonVanguard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameScore, gameLives, gameWave, incrementScore, playerDied, resetGame, nextWave, takeDamage, gainLife } = useStore();

  const gameState = useRef<'MENU' | 'BRIEFING' | 'PLAYING' | 'GAMEOVER'>('MENU');
  const frameId = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const lastShot = useRef<number>(0);
  const screenShake = useRef<number>(0);
  const stars = useRef<Star[]>([]);
  const pointer = useRef<Vector2>({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
  const player = useRef<GameObject>({
    active: true, x: 0, y: 0, vx: 0, vy: 0, width: 40, height: 40, rotation: 0,
    color: '#fff', type: 'PLAYER', hp: 100, maxHp: 100, iframe: 0
  });
  const enemies = useRef<GameObject[]>([]);
  const waveTimer = useRef<number>(0);
  const bossSpawned = useRef<boolean>(false);
  const weaponLevel = useRef<number>(1);
  const rapidFireUntil = useRef<number>(0);

  const projectilePool = useRef(new Pool<GameObject & { isEnemy: boolean }>(POOL_SIZE_PROJ, () => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, width: 4, height: 20, rotation: 0,
    color: '#f00', hp: 1, maxHp: 1, iframe: 0, isEnemy: false
  })));

  const particlePool = useRef(new Pool<GameObject & { life: number; maxLife: number; size: number }>(POOL_SIZE_PARTICLES, () => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, width: 0, height: 0, rotation: 0,
    color: '#fff', hp: 1, maxHp: 1, iframe: 0, life: 1, maxLife: 1, size: 2
  })));

  const [uiState, setUiState] = useState<'MENU' | 'BRIEFING' | 'HUD' | 'GAMEOVER'>('MENU');
  const [briefingData, setBriefingData] = useState({ title: '', text: '' });
  const [isPaused, setIsPaused] = useState(false);

  const playSound = (type: string) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'laser_xwing') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start();
        osc.stop(now + 0.15);
      } else if (type === 'laser_enemy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start();
        osc.stop(now + 0.1);
      } else if (type === 'explosion') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start();
        osc.stop(now + 0.3);
      } else if (type === 'bonus') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start();
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio context errors are non-critical
    }
  };

  const spawnProjectile = (x: number, y: number, vx: number, vy: number, isEnemy: boolean) => {
    const p = projectilePool.current.get();
    if (p) {
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = vx;
      p.vy = vy;
      p.isEnemy = isEnemy;
      p.color = isEnemy ? '#00FF00' : '#FF0044';
    }
  };

  const spawnParticle = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const p = particlePool.current.get();
      if (p) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4;
        p.active = true;
        p.x = x;
        p.y = y;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.color = color;
        p.life = 1.0;
        p.size = Math.random() * 2 + 1;
      }
    }
  };

  const spawnEnemy = (w: number, currentWave: number) => {
    const rand = Math.random();
    let type: EntityType = 'TIE_FIGHTER';
    let hp = 2;
    let width = 35;
    let score = 100;
    let fireRate = 2000;

    const speedBoost = Math.min((currentWave - 1) * 0.3, 5);
    const baseSpeed = 3 + speedBoost;

    if (currentWave >= 2 && rand > 0.65) {
      type = 'TIE_INTERCEPTOR';
      hp = 2;
      width = 35;
      score = 200;
      fireRate = 1500;
    }

    let vy = baseSpeed;
    if (type === 'TIE_INTERCEPTOR') vy = baseSpeed * 1.4;

    enemies.current.push({
      active: true,
      x: Math.random() * (w - 60) + 30,
      y: -50,
      vx: (Math.random() - 0.5) * 1.5,
      vy: vy,
      width,
      height: width,
      rotation: Math.random() * Math.PI * 2,
      color: '#fff',
      type,
      hp,
      maxHp: hp,
      iframe: 0,
      scoreValue: score,
      lastShot: 0,
      fireRate: fireRate
    } as any);
  };

  const drawXWing = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Fuselage principal
    ctx.fillStyle = '#00FF88';
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size / 3, -size / 3);
    ctx.lineTo(size / 3, size / 2);
    ctx.lineTo(-size / 3, size / 2);
    ctx.lineTo(-size / 3, -size / 3);
    ctx.closePath();
    ctx.fill();
    
    // Ailes gauche et droite
    ctx.fillStyle = '#00CCFF';
    // Aile gauche
    ctx.beginPath();
    ctx.moveTo(-size / 3, -size / 4);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size / 3, size / 4);
    ctx.closePath();
    ctx.fill();
    
    // Aile droite
    ctx.beginPath();
    ctx.moveTo(size / 3, -size / 4);
    ctx.lineTo(size, 0);
    ctx.lineTo(size / 3, size / 4);
    ctx.closePath();
    ctx.fill();
    
    // Cockpit
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Moteurs (glow)
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    ctx.arc(-size / 4, size / 2, size / 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size / 4, size / 2, size / 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawTie = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Panneaux solaires
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-size / 2, 0, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size / 2, 0, size / 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Cockpit central
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Connecteurs
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size / 2, 0);
    ctx.lineTo(size / 2, 0);
    ctx.stroke();
    
    ctx.restore();
  };

  const update = (dt: number, width: number, height: number) => {
    const currentWave = gameWave;
    const currentScore = gameScore;

    if (screenShake.current > 0) screenShake.current *= SCREEN_SHAKE_DECAY;
    if (screenShake.current < 0.5) screenShake.current = 0;

    const targetX = Math.max(25, Math.min(width - 25, pointer.current.x));
    const targetY = Math.max(50, Math.min(height - 50, pointer.current.y));
    player.current.x += (targetX - player.current.x) * PLAYER_DRAG_SPEED;
    player.current.y += (targetY - player.current.y) * PLAYER_DRAG_SPEED;

    if (gameState.current === 'PLAYING' && !isPaused && performance.now() - lastShot.current > PLAYER_FIRE_RATE) {
      playSound('laser_xwing');
      
      // Tir basique
      spawnProjectile(player.current.x - 20, player.current.y - 10, 0, -20, false);
      spawnProjectile(player.current.x + 20, player.current.y - 10, 0, -20, false);
      
      // Tir supplémentaire selon le niveau d'arme
      if (weaponLevel.current >= 2) {
        spawnProjectile(player.current.x - 10, player.current.y - 5, -2, -20, false);
        spawnProjectile(player.current.x + 10, player.current.y - 5, 2, -20, false);
      }
      
      if (weaponLevel.current >= 3) {
        spawnProjectile(player.current.x, player.current.y, 0, -22, false);
      }
      
      // Cadence de tir réduite avec le bonus rapide
      const fireRateModifier = rapidFireUntil.current > performance.now() ? 0.5 : 1.0;
      lastShot.current = performance.now() - (PLAYER_FIRE_RATE * (1 - fireRateModifier));
    }
    
    // Réinitialiser le bonus rapide s'il a expiré
    if (rapidFireUntil.current < performance.now()) {
      rapidFireUntil.current = 0;
    }

    if (gameState.current === 'PLAYING' && !isPaused) {
      waveTimer.current += dt;
      const difficulty = 1.0 + (currentWave - 1) * 0.2;
      const baseInterval = 2000;
      const spawnInterval = Math.max(250, baseInterval / difficulty);
      const maxEnemies = 2 + Math.floor(currentWave * 1.5);

      if (waveTimer.current > spawnInterval) {
        if (enemies.current.filter(e => !e.type?.startsWith('BONUS')).length < maxEnemies) {
          spawnEnemy(width, currentWave);
          waveTimer.current = 0;
        }
      }

      for (let i = enemies.current.length - 1; i >= 0; i--) {
        const e = enemies.current[i];
        e.y += e.vy;
        e.x += e.vx;

        // Les ennemis tirent
        if (!e.lastShot) e.lastShot = 0;
        if (!e.fireRate) e.fireRate = 2000;
        if (performance.now() - e.lastShot > e.fireRate && e.y > 0 && e.y < height) {
          spawnProjectile(e.x, e.y + e.height / 2, 0, 8, true);
          e.lastShot = performance.now();
        }

        const playerHitbox: HitBox = {
          x: player.current.x - player.current.width / 2,
          y: player.current.y - player.current.height / 2,
          width: player.current.width,
          height: player.current.height
        };

        const enemyHitbox: HitBox = {
          x: e.x - e.width / 2,
          y: e.y - e.height / 2,
          width: e.width,
          height: e.height
        };

        if (checkAABBCollision(playerHitbox, enemyHitbox)) {
          screenShake.current = 20;
          spawnParticle(player.current.x, player.current.y, '#f00', 30);
          playSound('explosion');
          playerDied();
          takeDamage(20);
          e.hp = 0;
        }

        if (e.y > height + 100 || e.hp <= 0) {
          if (e.hp <= 0) {
            incrementScore(e.scoreValue || 100);
            spawnParticle(e.x, e.y, '#FFA500', 15);
            
            // Spawn bonus aléatoire
            if (Math.random() < 0.15) {
              const bonusType = Math.random() < 0.5 ? 'BONUS_WEAPON' : 'BONUS_RAPID';
              enemies.current.push({
                active: true,
                x: e.x,
                y: e.y,
                vx: 0,
                vy: 2,
                width: 20,
                height: 20,
                rotation: 0,
                color: bonusType === 'BONUS_WEAPON' ? '#FFD700' : '#00FF00',
                type: bonusType as EntityType,
                hp: 1,
                maxHp: 1,
                iframe: 0,
                scoreValue: 0
              });
            }
          }
          enemies.current.splice(i, 1);
        }
      }

      if (currentScore >= currentWave * 2000) {
        gameState.current = 'BRIEFING';
        setUiState('BRIEFING');
        const mission = MISSIONS[(currentWave - 1) % MISSIONS.length] || MISSIONS[0];
        setBriefingData(mission);
        nextWave();
      }
    }

    projectilePool.current.items.forEach(p => {
      if (!p.active) return;
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -50 || p.y > height + 50) {
        p.active = false;
        return;
      }

      if (!p.isEnemy) {
        // Projectiles du joueur contre les ennemis
        for (const e of enemies.current) {
          if (!e.type?.startsWith('BONUS') && Math.abs(p.x - e.x) < e.width / 2 && Math.abs(p.y - e.y) < e.height / 2) {
            e.hp--;
            p.active = false;
            spawnParticle(p.x, p.y, '#00FF00', 3);
            break;
          }
        }
      } else {
        // Projectiles ennemis contre le joueur
        const playerHitbox: HitBox = {
          x: player.current.x - player.current.width / 2,
          y: player.current.y - player.current.height / 2,
          width: player.current.width,
          height: player.current.height
        };
        
        const projectileHitbox: HitBox = {
          x: p.x - 2,
          y: p.y - 10,
          width: 4,
          height: 20
        };
        
        if (checkAABBCollision(playerHitbox, projectileHitbox) && player.current.iframe <= 0) {
          screenShake.current = 10;
          spawnParticle(player.current.x, player.current.y, '#FF0000', 10);
          takeDamage(10);
          player.current.iframe = 120;
          p.active = false;
        }
      }
    });

    // Collecte des bonus
    for (let i = enemies.current.length - 1; i >= 0; i--) {
      const e = enemies.current[i];
      if (e.type?.startsWith('BONUS')) {
        const playerHitbox: HitBox = {
          x: player.current.x - player.current.width / 2,
          y: player.current.y - player.current.height / 2,
          width: player.current.width,
          height: player.current.height
        };
        
        const bonusHitbox: HitBox = {
          x: e.x - e.width / 2,
          y: e.y - e.height / 2,
          width: e.width,
          height: e.height
        };
        
        if (checkAABBCollision(playerHitbox, bonusHitbox)) {
          if (e.type === 'BONUS_WEAPON') {
            weaponLevel.current = Math.min(weaponLevel.current + 1, 3);
            incrementScore(500);
          } else if (e.type === 'BONUS_RAPID') {
            rapidFireUntil.current = performance.now() + 5000;
            incrementScore(300);
          }
          spawnParticle(e.x, e.y, '#FFD700', 20);
          enemies.current.splice(i, 1);
        } else if (e.y > height) {
          enemies.current.splice(i, 1);
        }
      }
    }

    if (player.current.iframe > 0) {
      player.current.iframe--;
    }

    particlePool.current.items.forEach(p => {
      if (p.active) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) p.active = false;
      }
    });

    stars.current.forEach(star => {
      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, width, height);

    stars.current.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    if (screenShake.current > 0) {
      const dx = (Math.random() - 0.5) * screenShake.current;
      const dy = (Math.random() - 0.5) * screenShake.current;
      ctx.translate(dx, dy);
    }

    if (gameState.current === 'PLAYING') {
      // Clignotement lors de l'invulnérabilité
      if (player.current.iframe > 0 && Math.floor(player.current.iframe / 10) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }
      drawXWing(ctx, player.current.x, player.current.y, 30);
      ctx.globalAlpha = 1.0;
    }

    enemies.current.forEach(e => {
      if (e.type?.startsWith('BONUS')) {
        // Dessiner les bonus
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(0, 0, e.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, e.width / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        
        // Symbole
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.type === 'BONUS_WEAPON' ? 'W' : 'R', 0, 0);
        ctx.restore();
      } else {
        drawTie(ctx, e.x, e.y, e.width);
      }
    });

    projectilePool.current.items.forEach(p => {
      if (p.active) {
        ctx.fillStyle = p.color;
        if (p.isEnemy) {
          // Projectiles ennemis - style différent
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
          // Traînée
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y - 8, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        } else {
          // Projectiles du joueur
          ctx.fillRect(p.x - 2, p.y - 10, 4, 20);
        }
      }
    });

    particlePool.current.items.forEach(p => {
      if (p.active) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    });

    ctx.restore();
  };

  const gameLoop = useCallback((time: number) => {
    const dt = time - lastTime.current;
    lastTime.current = time;

    if (gameState.current === 'PLAYING' && !isPaused) {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          update(dt, width, height);
          draw(ctx, width, height);
        }
      }
    } else if (gameState.current === 'PLAYING' && isPaused && canvasRef.current) {
      const { width, height } = canvasRef.current;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) draw(ctx, width, height);
    }

    frameId.current = requestAnimationFrame(gameLoop);
  }, [isPaused]);

  const init = () => {
    resetGame();
    projectilePool.current.reset();
    particlePool.current.reset();
    enemies.current = [];
    weaponLevel.current = 1;
    rapidFireUntil.current = 0;
    gameState.current = 'MENU';
    setUiState('MENU');
    bossSpawned.current = false;
    setIsPaused(false);

    stars.current = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      player.current.x = window.innerWidth / 2;
      player.current.y = window.innerHeight - 100;
    }

    init();
    frameId.current = requestAnimationFrame(gameLoop);

    const handleMouseMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameLoop]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {uiState === 'MENU' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-cyan-400 mb-8">NEON VANGUARD</h1>
            <p className="text-gray-300 mb-8">Defend the galaxy from the Imperial forces</p>
            <button
              onClick={() => {
                gameState.current = 'PLAYING';
                setUiState('HUD');
              }}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition"
            >
              <Play className="inline mr-2" size={20} /> START GAME
            </button>
          </div>
        </div>
      )}

      {uiState === 'BRIEFING' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-red-500 mb-6">{briefingData.title}</h2>
            <p className="text-gray-300 text-lg mb-8">{briefingData.text}</p>
            <button
              onClick={() => {
                gameState.current = 'PLAYING';
                setUiState('HUD');
              }}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition"
            >
              <Play className="inline mr-2" size={20} /> ENGAGE
            </button>
          </div>
        </div>
      )}

      {uiState === 'HUD' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 text-cyan-400 font-mono">
            <div className="text-sm">SCORE</div>
            <div className="text-2xl font-bold">{gameScore.toString().padStart(6, '0')}</div>
          </div>
          <div className="absolute top-4 right-4 text-red-500 font-mono">
            <div className="text-sm">VAGUE</div>
            <div className="text-2xl font-bold">{gameWave}</div>
          </div>
          <div className="absolute bottom-4 left-4 text-blue-400 font-mono">
            <div className="text-sm">BOUCLIERS</div>
            <div className="flex gap-1">
              {Array(gameLives).fill(0).map((_, i) => (
                <Shield key={i} size={20} className="fill-blue-400" />
              ))}
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-mono">
            <div className="text-sm">ARME</div>
            <div className="text-lg font-bold">LVL {weaponLevel.current}</div>
            {rapidFireUntil.current > performance.now() && (
              <div className="text-green-400 text-sm animate-pulse">TIR RAPIDE ACTIF</div>
            )}
          </div>
          <div className="absolute bottom-4 right-4 text-yellow-400 font-mono pointer-events-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded transition"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          </div>
        </div>
      )}

      {uiState === 'GAMEOVER' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-red-600 mb-6 flex items-center justify-center gap-3">
              <Skull size={40} /> GAME OVER
            </h2>
            <p className="text-gray-300 text-2xl mb-8">Final Score: {gameScore}</p>
            <button
              onClick={() => {
                init();
                gameState.current = 'MENU';
                setUiState('MENU');
              }}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition"
            >
              <RefreshCw className="inline mr-2" size={20} /> RESTART
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

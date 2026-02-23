/**
 * PATCHES À APPLIQUER AU FICHIER NeonVanguard.tsx
 * Copier-coller ces sections dans le fichier original
 */

// ============================================
// PATCH 1: AUDIO CONTEXT RÉUTILISABLE
// ============================================
// À ajouter après les imports, avant le composant:

const audioCtxRef = { current: null as AudioContext | null };

const getAudioContext = () => {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtxRef.current;
};

// REMPLACER la fonction playSound par:
const playSound = (type: 'laser_xwing' | 'laser_tie' | 'explosion' | 'r2d2' | 'torpedo' | 'alarm' | 'powerup') => {
  const ctx = getAudioContext(); // ✅ Réutilise le contexte
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;

  if (type === 'laser_xwing') {
      const isRapid = performance.now() < rapidFireUntil.current;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isRapid ? 800 : 600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(); osc.stop(now + 0.15);
  } else if (type === 'laser_tie') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(); osc.stop(now + 0.1);
  } else if (type === 'explosion') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(); osc.stop(now + 0.4);
  } else if (type === 'r2d2' || type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.linearRampToValueAtTime(1800, now + 0.1);
      osc.frequency.linearRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(); osc.stop(now + 0.2);
  }
};

// ============================================
// PATCH 2: COLLISION DETECTION AABB
// ============================================
// À ajouter après les types, avant le composant:

interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const checkAABBCollision = (a: HitBox, b: HitBox): boolean => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

// REMPLACER dans la fonction update(), section collision ennemis:
// ANCIEN CODE:
// const dist = Math.hypot(e.x - player.current.x, e.y - player.current.y);
// const hitRadius = e.type === 'ASTEROID' ? e.width/2 : (e.width + player.current.width) / 2;
// if (dist < hitRadius) {

// NOUVEAU CODE:
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
  // ... reste du code collision
}

// ============================================
// PATCH 3: FEEDBACK VISUEL
// ============================================

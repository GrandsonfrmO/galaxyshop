/**
 * Smooth Animation Presets
 * Optimized for fluid UI interactions
 */

// Spring animation for natural, smooth motion
export const SPRING_SMOOTH = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

// Faster spring for snappy interactions
export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 25,
  mass: 0.8,
};

// Very smooth spring for modals and overlays
export const SPRING_VERY_SMOOTH = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 35,
  mass: 1.2,
};

// Easing animations for transitions
export const EASING_SMOOTH = {
  type: 'tween' as const,
  duration: 0.3,
  ease: 'easeInOut' as const,
};

export const EASING_FAST = {
  type: 'tween' as const,
  duration: 0.15,
  ease: 'easeOut' as const,
};

// Modal animations
export const MODAL_ENTER = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 20 },
  transition: SPRING_VERY_SMOOTH,
};

// Sidebar animations
export const SIDEBAR_ENTER = {
  initial: { x: -300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: SPRING_SMOOTH,
};

// Dropdown animations
export const DROPDOWN_ENTER = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: EASING_FAST,
};

// Button hover animation
export const BUTTON_HOVER = {
  scale: 1.02,
  transition: SPRING_SNAPPY,
};

// Button tap animation
export const BUTTON_TAP = {
  scale: 0.98,
  transition: EASING_FAST,
};

// Fade animations
export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: EASING_SMOOTH,
};

// Slide animations
export const SLIDE_UP = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: SPRING_SMOOTH,
};

export const SLIDE_DOWN = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: SPRING_SMOOTH,
};

export const SLIDE_LEFT = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: SPRING_SMOOTH,
};

export const SLIDE_RIGHT = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: SPRING_SMOOTH,
};

// Stagger container for list animations
export const STAGGER_CONTAINER = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
};

// Stagger item
export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: SPRING_SMOOTH,
};

// Rotate animation
export const ROTATE_SMOOTH = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Pulse animation
export const PULSE = {
  animate: { scale: [1, 1.05, 1] },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Bounce animation
export const BOUNCE = {
  animate: { y: [0, -10, 0] },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

import type { Variants } from 'framer-motion'

// Easing curves
export const easeOutExpo = [0.16, 1, 0.3, 1] as const
export const easeInOutExpo = [0.87, 0, 0.13, 1] as const

// The site-wide reveal: a short rise and fade, the same curve the hero copy uses.
export const reveal: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: easeOutExpo } },
}

export const revealGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// Trigger when the element's top clears the bottom 10% of the viewport — independent of
// its height, so tall lists on phones don't sit invisible until a quarter is on screen.
export const inView = { once: true, margin: '0px 0px -10% 0px' } as const

// Fade up animation
export const fadeUpVariant: Variants = {
  hidden: { 
    y: 40, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: easeOutExpo 
    }
  }
}

// Fade in animation
export const fadeInVariant: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: easeOutExpo 
    }
  }
}

// Scale up animation
export const scaleUpVariant: Variants = {
  hidden: { 
    scale: 0.95, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: easeOutExpo 
    }
  }
}

// Slide from left
export const slideFromLeftVariant: Variants = {
  hidden: { 
    x: -60, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: easeOutExpo 
    }
  }
}

// Slide from right
export const slideFromRightVariant: Variants = {
  hidden: { 
    x: 60, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: easeOutExpo 
    }
  }
}

// Stagger container
export const staggerContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
}

// Stagger container with faster timing
export const staggerContainerFastVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
}

// Word by word reveal for headlines
export const wordRevealContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
}

export const wordRevealVariant: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: easeOutExpo 
    }
  }
}

// Character by character reveal
export const charRevealContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    }
  }
}

export const charRevealVariant: Variants = {
  hidden: { 
    y: '110%',
    rotateX: -90,
  },
  visible: { 
    y: 0,
    rotateX: 0,
    transition: { 
      duration: 0.4, 
      ease: easeOutExpo 
    }
  }
}

// Card hover animation
export const cardHoverVariant = {
  rest: { 
    scale: 1,
    y: 0,
  },
  hover: { 
    scale: 1.02,
    y: -8,
    transition: { 
      duration: 0.3, 
      ease: easeOutExpo 
    }
  }
}

// Button hover
export const buttonHoverVariant = {
  rest: { 
    scale: 1 
  },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2, 
      ease: easeOutExpo 
    }
  },
  tap: { 
    scale: 0.98 
  }
}

// Line draw animation (for SVG paths)
export const lineDrawVariant: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: { 
      duration: 1.5, 
      ease: easeInOutExpo 
    }
  }
}

// Viewport settings for scroll-triggered animations
export const defaultViewport = {
  once: true,
  amount: 0.2,
  margin: '-50px',
}

export const earlyViewport = {
  once: true,
  amount: 0.1,
  margin: '-100px',
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useTransform, useScroll, useMotionValueEvent } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

const photos = [
  { id: 1, src: '/Akshu/1.jpg', caption: 'Your breathtaking smile... ✨' },
  { id: 2, src: '/Akshu/2.jpg', caption: 'Every moment with you is a dream. 💖' },
  { id: 4, src: '/Akshu/4.png', caption: 'You light up my entire world 🌟' },
  { id: 5, src: '/Akshu/5.png', caption: 'That gorgeous look in your eyes... 👀' },
  { id: 6, src: '/Akshu/6.jpg', caption: 'My heart beats only for you. 💓' },
  { id: 8, src: '/Akshu/8.png', caption: 'The prettiest girl in the universe 🌸' },
  { id: 9, src: '/Akshu/9.jpg', caption: 'Forever and always, you and me. 🔒' },
  { id: 10, src: '/Akshu/10.jpg', caption: 'My daily dose of happiness. 😊' },
  { id: 11, src: '/Akshu/11.png', caption: 'Captured perfection 📸' },
  { id: 12, src: '/Akshu/12.jpg', caption: 'You are my sunshine ☀️' },
  { id: 13, src: '/Akshu/13.jpg', caption: 'Looking absolutely magical ✨' },
  { id: 14, src: '/Akshu/14.jpg', caption: 'Your laugh is my favorite song 🎵' },
  { id: 15, src: '/Akshu/15.png', caption: 'My forever valentine ❤️' },
  { id: 16, src: '/Akshu/16.png', caption: 'You make my soul happy. 🌈' },
  { id: 17, src: '/Akshu/17.png', caption: 'The girl who stole my heart 💘' }
];

const herWordsList = [
  {
    gujarati: "Tmari darek vato hve gmva lagi chhe, prem vadi darek reel save thva lagi chhe, tmara sathe ni chat maa hve typing ni speed vdhva lagi chhe, ane dekhay jaay ne kyak name to aapoaap smile aava lagi chhe, divs bhle gme tetlo kaam ma hoy...pn rato hve tmari thva lagi chheee!!!!❤️🫶🏻🫣",
    caption: "— Her Heartfelt Confession"
  },
  {
    english: "I love how you hold me, I love how you tell me I'm beautiful, I love how you look at me funny when say something stupid. I love how you make me happy, I love how we talk about being together forever ❤️💖 I love how you think have cute feet. I love how you get mad when someone says something to upset me.. i love everything about you....❤️🫶🏻",
    caption: "— Reasons Why She Loves"
  },
  {
    english: "Firstly, I love you so much...\nSecondly, Whatever happens dont forget the first thing..🫀💫❣️",
    caption: "— The Ultimate Promise"
  }
];


function GalleryPhoto({ photo, i, total, scrollYProgress }) {
  // Each photo owns one equal slice of the total scroll range, so only the
  // photo whose slice we're currently in (plus a brief crossfade sliver
  // shared with its immediate neighbor) is ever visible. This replaces the
  // old wide overlapping "plateau" windows that caused many photos to sit
  // fully opaque on screen simultaneously (the stacking look).
  const gap = 1 / total;
  const start = i * gap;

  // Width of the enter/exit transition, shared with the neighboring photo.
  // Small relative to gap => a clean one-at-a-time handoff instead of a pile.
  const overlap = gap * 0.35;

  const enterStart = start - overlap;
  const enterEnd = start + overlap;
  const exitStart = start + gap - overlap;
  const exitEnd = start + gap + overlap;

  const input = [enterStart, enterEnd, exitStart, exitEnd];

  // Alternate direction per photo so consecutive images don't fly the same
  // way (keeps it feeling dynamic rather than repetitive).
  const dir = i % 2 === 0 ? 1 : -1;

  // Depth (3D dolly): arrives from far away, holds at center, then rushes
  // past the viewer (scales up, comes toward camera) as it exits.
  const z = useTransform(scrollYProgress, input, [-1400, 0, 0, 700]);
  const scale = useTransform(scrollYProgress, input, [0.55, 1, 1, 1.35]);
  const opacity = useTransform(scrollYProgress, input, [0, 1, 1, 0]);

  // Horizontal travel: enters from one side, exits the other side — a true
  // "current image leaves the screen, next one enters" motion.
  const x = useTransform(scrollYProgress, input, [dir * 500, 0, 0, dir * -500]);
  const y = useTransform(scrollYProgress, input, [60, 0, 0, -60]);

  const rotateX = useTransform(scrollYProgress, input, [10, 0, 0, -10]);
  const rotateY = useTransform(scrollYProgress, input, [dir * 45, 0, 0, dir * -45]);
  const rotateZ = useTransform(scrollYProgress, input, [dir * 6, 0, 0, dir * -6]);

  return (
    <motion.div
      style={{
        x, y, z, scale, opacity, rotateX, rotateY, rotateZ,
        willChange: "transform, opacity",
      }}
      className="absolute w-[280px] sm:w-[400px] bg-white p-4 pb-12 rounded-sm shadow-2xl border border-zinc-200 z-10"
    >
      <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden rounded-sm mb-4">
        <img
          src={photo.src}
          alt={`Memory ${photo.id}`}
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23db2777"/><text x="50%" y="55%" font-size="30" text-anchor="middle">\u2764\ufe0f</text></svg>';
          }}
        />
      </div>
      <p className="font-cursive text-zinc-900 text-center text-lg sm:text-2xl leading-tight select-none font-bold">
        {photo.caption}
      </p>
    </motion.div>
  );
}

function Cinematic3DScrollGallery({ photos }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const gap = 1 / photos.length;
    let idx = Math.floor(latest / gap);
    if (idx >= photos.length) idx = photos.length - 1;
    if (idx < 0) idx = 0;
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  // Extract a keyword from the caption for the massive background text
  const getKeyword = (caption) => {
    const words = caption.replace(/[^a-zA-Z ]/g, '').split(' ');
    const longWord = words.find(w => w.length > 4);
    return (longWord || words[0] || 'LOVE').toUpperCase();
  };

  const activeKeyword = getKeyword(photos[activeIndex]?.caption || 'LOVE');

  // FIX: Rendering all 17 photos at once means 17 * 6 = 102 live scroll-bound
  // transforms plus 17 shadow-heavy DOM nodes are painted/composited on
  // every single scroll frame, even the ones fully off-screen. On mobile
  // this is expensive enough to stall the main thread, which is exactly
  // what shows up as the scroll "freezing" then "jumping". Only mount
  // photos near the currently active one — motion values are driven purely
  // by scrollYProgress, so remounting as they enter range causes no visual
  // discontinuity, they just pick up the correct position immediately.
  const RENDER_RADIUS = 1;
  const visiblePhotos = useMemo(
    () => photos.filter((_, i) => Math.abs(i - activeIndex) <= RENDER_RADIUS),
    [photos, activeIndex]
  );

  return (
    // FIX: 'vh' is the mobile browser's *large* viewport height, which
    // changes as the address bar hides/shows mid-scroll. Since this
    // container's height defines the total scroll distance that
    // scrollYProgress is calculated against, a mid-scroll resize here
    // desyncs the progress value — freezing the animation until it
    // resettles, then snapping. 'svh' is fixed for the session, so the
    // scroll distance never shifts under the user.
    <section ref={containerRef} className="relative w-full h-[1200svh] bg-black">
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center pointer-events-none"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {/* Massive Background Text */}
        <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKeyword}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-[15vw] sm:text-[12vw] font-title font-bold text-center text-pink-500/20 drop-shadow-[0_0_20px_rgba(219,39,119,0.5)] select-none leading-none w-full"
            >
              {activeKeyword}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D Photo Deck — only nearby photos are mounted (see RENDER_RADIUS above) */}
        {visiblePhotos.map((photo) => {
          const i = photos.indexOf(photo);
          return (
            <GalleryPhoto
              key={photo.id}
              photo={photo}
              i={i}
              total={photos.length}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scene, setScene] = useState(1); // Scene controls
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [sealParticles, setSealParticles] = useState([]);
  const [letterVisible, setLetterVisible] = useState(false);
  const [letterDissolved, setLetterDissolved] = useState(false);

  // Scene 2 states
  const [heartPulse, setHeartPulse] = useState(false);
  const [showHeroText, setShowHeroText] = useState(false);



  // Scene 6 (Dodge game) states
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [emojiTrails, setEmojiTrails] = useState([]);
  const [yesSelected, setYesSelected] = useState(false);
  const [flashPink, setFlashPink] = useState(false);
  const [finalLetterVisible, setFinalLetterVisible] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);
  const fallingIntervalRef = useRef(null);
  const yesTappedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Web Audio Synth Fallback for reliable offline execution in Termux
  const playSynthNote = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log(e);
    }
  };

  // Scene 1: Tap seal handler
  const handleTapSeal = () => {
    if (envelopeOpened) return;

    // Play synth click note
    playSynthNote();

    // 1. Frame 0-300ms: Wax seal scales up, glows white, bursts to 30 tiny red heart particles
    setEnvelopeOpened(true);
    const particles = Array.from({ length: 30 }).map((_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const distance = Math.random() * 120 + 80;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: Math.random() * 0.6 + 0.6
      };
    });
    setSealParticles(particles);

    // 2. Frame 300-800ms: Top flap rotates open (handled via CSS/staggered state)
    // 3. Frame 800-1500ms: Glowing letter slides out, scales, envelope drops opacity to 0
    setTimeout(() => {
      setLetterVisible(true);
    }, 800);

    // 4. Frame 1500ms: Letter dissolves, pitch-black background transitions to gradient
    setTimeout(() => {
      setLetterDissolved(true);
      setScene(2);
    }, 2200); // 800ms + 1400ms buffer for reading
  };

  // Scene 2 timers
  useEffect(() => {
    if (scene !== 2) return;

    // Frame 1000-1500ms: Heart pulses, canvas-confetti bursts
    const heartTimer = setTimeout(() => {
      setHeartPulse(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#facc15', '#db2777', '#ffffff'] // Gold, deep pink, white
      });
    }, 1000);

    // Frame 1500ms+: Text stagger drop
    const textTimer = setTimeout(() => {
      setShowHeroText(true);
    }, 1500);

    return () => {
      clearTimeout(heartTimer);
      clearTimeout(textTimer);
    };
  }, [scene]);



  // Scene 6: Dodge NO button
  const handleNoDodge = () => {
    if (!containerRef.current || !noBtnRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = noBtnRef.current.getBoundingClientRect();

    const limitX = (containerRect.width / 2) - btnRect.width;
    const limitY = (containerRect.height / 2) - btnRect.height;

    let newX = (Math.random() - 0.5) * limitX * 2;
    let newY = (Math.random() - 0.5) * limitY * 2;

    if (Math.abs(newX - noBtnPosition.x) < 40) newX += newX > 0 ? 50 : -50;
    if (Math.abs(newY - noBtnPosition.y) < 25) newY += newY > 0 ? 35 : -35;

    // Strict clamping inside container bounds
    newX = Math.max(-limitX, Math.min(limitX, newX));
    newY = Math.max(-limitY, Math.min(limitY, newY));

    setNoBtnPosition({ x: newX, y: newY });
    playSynthNote();

    // Leave a fading trail of "💨" and "😂"
    const trailId = Date.now() + Math.random();
    const emojis = ["💨", "😂"];
    const newTrail = {
      id: trailId,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: newX,
      y: newY
    };
    setEmojiTrails(prev => [...prev, newTrail]);

    // Remove trail after 500ms
    setTimeout(() => {
      setEmojiTrails(prev => prev.filter(t => t.id !== trailId));
    }, 500);
  };

  // Scene 6: YES button tap sequence
  const handleYesTap = () => {
    // Guard against double-fire from touch + click on mobile
    if (yesTappedRef.current) return;
    yesTappedRef.current = true;

    setYesSelected(true);
    setFlashPink(true);

    // Explode into a massive heart icon
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#db2777', '#facc15', '#ffffff']
    });

    // Flash pink for 100ms
    setTimeout(() => {
      setFlashPink(false);
    }, 100);

    // Clear any previous interval, then start infinite slow-falling confetti
    if (fallingIntervalRef.current) clearInterval(fallingIntervalRef.current);
    fallingIntervalRef.current = setInterval(() => {
      confetti({
        particleCount: 4,
        angle: 270,
        spread: 60,
        origin: { x: Math.random(), y: -0.1 },
        colors: ['#db2777', '#facc15']
      });
    }, 350);

    // Float down final overlay & blur site
    setTimeout(() => {
      setFinalLetterVisible(true);
    }, 600);
  };



  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-pink-600 selection:text-white font-sans">



      {/* SCENE 1: The Envelope & The Awakening */}
      <AnimatePresence>
        {scene === 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Sealed Envelope Container */}
            <div className="relative w-80 sm:w-[400px] h-56 sm:h-[260px] flex items-center justify-center perspective-1000 z-10">

              <motion.div
                className="relative w-full h-full preserve-3d"
                animate={envelopeOpened ? { rotateX: 10 } : {}}
                transition={{ duration: 0.8 }}
              >

                {/* 1. Rising Glowing Letter Card */}
                {letterVisible && (
                  <motion.div
                    initial={{ y: 0, scale: 0.9, opacity: 1 }}
                    animate={letterDissolved ? { opacity: 0, scale: 1.2 } : { y: -160, scale: 1.05, zIndex: 60 }}
                    transition={{
                      y: { type: 'spring', stiffness: 80, damping: 15 },
                      opacity: { duration: 0.5 }
                    }}
                    className="absolute inset-x-4 top-4 h-full bg-gradient-to-br from-white to-zinc-100 text-zinc-950 p-6 rounded-lg shadow-[0_0_35px_rgba(255,255,255,0.8)] border border-white/60 flex flex-col justify-center space-y-4 z-[60]"
                  >
                    <h3 className="font-title text-xl font-bold text-center text-pink-600 tracking-wide">
                      A Special Message ✨
                    </h3>
                    <p className="font-cursive text-lg text-center text-zinc-800 leading-snug">
                      Akshu, today the universe celebrates the birth of its most beautiful soul.
                    </p>
                    <p className="text-xs text-zinc-500 text-center font-semibold leading-relaxed">
                      Prepare to unlock a cinematic world of sweet birthday wishes and memories...
                    </p>
                  </motion.div>
                )}

                {/* 2. Envelope Base (inside walls) */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-b-xl border border-yellow-700 z-20 shadow-[0_0_20px_rgba(217,119,6,0.3)]" />

                {/* 3. Left / Right Flaps */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                  {/* Left flap */}
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-yellow-700/90 border-r border-yellow-800/40"
                    style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
                  {/* Right flap */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-yellow-700/90 border-l border-yellow-800/40"
                    style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
                  {/* Bottom flap */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-yellow-800 border-t border-yellow-900/40"
                    style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
                </div>

                {/* 4. Top Folding Flap */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1/2 bg-yellow-600 border-b border-yellow-700 origin-top z-40 backface-hidden"
                  style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
                  animate={envelopeOpened ? { rotateX: -180, y: -2 } : { rotateX: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                />

                {/* 5. Pulsing Wax Seal Seal Button */}
                {!envelopeOpened && (
                  <motion.div
                    onClick={handleTapSeal}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-600 border-4 border-amber-500 shadow-[0_0_20px_rgba(220,38,38,0.8)] flex items-center justify-center cursor-pointer z-50 animate-pulse"
                  >
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </motion.div>
                )}

                {/* Seal Exploding Particle Hearts */}
                {sealParticles.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-1/2 left-1/2 text-red-500 text-xl pointer-events-none select-none z-50"
                  >
                    ❤️
                  </motion.span>
                ))}

              </motion.div>
            </div>

            {!envelopeOpened && (
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-zinc-500 text-sm tracking-wider mt-12 select-none"
              >
                Tap the red wax seal to open
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEEP VELVET RED MESH BACKGROUND (Unlocks in Scene 2+) */}
      {scene > 1 && (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-black to-black animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Main scrolling wrapper */}
      {scene > 1 && (
        <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 mx-auto">

          {/* SCENE 2: The Cinematic Hero Wish */}
          <section className="h-[100svh] w-full flex flex-col justify-center items-center text-center relative max-w-4xl">

            {/* Cinematic Glowing Heart */}
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                transition={{
                  scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                  opacity: { duration: 0.6 }
                }}
                className="cursor-pointer select-none"
                onClick={() => {
                  confetti({ particleCount: 50, spread: 60 });
                  playSynthNote();
                }}
              >
                <Heart className="text-pink-500 fill-pink-500 w-48 h-48 drop-shadow-[0_0_40px_rgba(219,39,119,1)]" />
              </motion.div>
            </div>

            {/* Staggered text drop letters reveal */}
            {showHeroText && (
              <div className="mt-10 space-y-4">
                <div className="flex flex-wrap justify-center gap-x-2.5 sm:gap-x-4">
                  {"Happy Birthday,".split(" ").map((word, wIdx) => (
                    <div key={wIdx} className="flex gap-0.5 sm:gap-1">
                      {word.split("").map((char, cIdx) => (
                        <motion.span
                          key={cIdx}
                          initial={{ y: -120, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                            delay: (wIdx * 5 + cIdx) * 0.04
                          }}
                          className="text-4xl sm:text-7xl font-bold tracking-tight text-white inline-block drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] font-title"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-0.5 sm:gap-1">
                  {"Akshu!".split("").map((char, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ y: -120, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: (15 + idx) * 0.04
                      }}
                      className="text-5xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-500 to-orange-400 select-none inline-block drop-shadow-[0_5px_20px_rgba(219,39,119,0.7)] animate-pulse font-title"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1.8, duration: 1.0 }}
                  className="text-xs uppercase tracking-widest text-zinc-400 font-bold select-none pt-4"
                >
                  Scroll down to enter the space of memories
                </motion.p>
              </div>
            )}
          </section>

          {/* SCENE 3: Cinematic 3D Scroll Gallery */}
          <Cinematic3DScrollGallery photos={photos} />

          {/* SCENE 4: Her Words (Ink Bleed Reveal) */}
          <section className="py-24 w-full max-w-3xl border-t border-zinc-900/60">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-title text-3xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-500">
                Her Words
              </h2>
              <p className="font-cursive text-xl sm:text-3xl text-amber-300">
                Lines that bleed ink into my heart...
              </p>
            </div>

            <div className="space-y-12 px-2">
              {herWordsList.map((card, cIdx) => {
                const isGuj = !!card.gujarati;
                const textContent = isGuj ? card.gujarati : card.english;
                const wordsOrChars = isGuj ? textContent.split("") : textContent.split(" ");

                return (
                  <motion.div
                    key={cIdx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative"
                  >
                    <InkBleedCard caption={card.caption} wordsOrChars={wordsOrChars} isGuj={isGuj} />
                  </motion.div>
                );
              })}
            </div>
          </section>


          {/* SCENE 6: The Ultimate Tricky Question */}
          <section className="py-24 w-full max-w-3xl text-center border-t border-zinc-900/60 pb-44">
            <div className="glass-romantic rounded-3xl p-8 sm:p-14 space-y-8 border border-pink-500/20 shadow-2xl relative overflow-hidden">

              <h2 className="font-title text-2xl sm:text-5xl font-bold leading-tight text-glow-pink">
                One Tricky Question... 😉
              </h2>

              <p className="text-lg sm:text-2xl text-zinc-200">
                Do you love me the most in this world? 🌎❤️
              </p>

              {/* Dodge Game Container */}
              <div
                ref={containerRef}
                className="relative w-full h-44 flex items-center justify-center mt-8 overflow-visible"
              >
                {/* Emojis trail */}
                <AnimatePresence>
                  {emojiTrails.map(item => (
                    <motion.span
                      key={item.id}
                      initial={{ opacity: 1, y: item.y, x: item.x, scale: 1 }}
                      animate={{ opacity: 0, y: item.y - 60, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute text-2xl pointer-events-none select-none z-30"
                    >
                      {item.emoji}
                    </motion.span>
                  ))}
                </AnimatePresence>

                {/* YES button - Big, Pulsing */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleYesTap}
                  className="px-10 py-4 bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-600 text-white font-bold text-xl sm:text-2xl rounded-full shadow-xl shadow-pink-500/20 animate-pulse select-none z-10 cursor-pointer"
                >
                  YES! 🥰
                </motion.button>

                {/* NO button - Dodges on touch and hover */}
                <motion.button
                  ref={noBtnRef}
                  animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  onMouseEnter={handleNoDodge}
                  onClick={handleNoDodge}
                  onTouchStartCapture={(e) => {
                    e.preventDefault();
                    handleNoDodge();
                  }}
                  className="px-6 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 font-semibold rounded-full select-none absolute z-20 cursor-pointer"
                  style={{ right: 'auto', left: 'auto' }}
                >
                  No 😜
                </motion.button>
              </div>
            </div>
          </section>

        </div>
      )}



      {/* PINK SCREEN FLASH overlay */}
      {flashPink && (
        <div className="fixed inset-0 bg-pink-500 z-[200] pointer-events-none" />
      )}

      {/* SCENE 6: FINAL LOVE LETTER OVERLAY — highest z-index, last in DOM */}
      <AnimatePresence>
        {finalLetterVisible && (
          <motion.div
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-xl flex items-center justify-center pointer-events-auto p-4 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#120207] via-black to-[#050505] border border-pink-500/30 p-8 sm:p-12 rounded-3xl text-center max-w-md w-full shadow-2xl space-y-6 relative">

              <div className="w-20 h-20 bg-pink-500/10 rounded-full border border-pink-500/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(219,39,119,0.4)]">
                <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
              </div>

              <h3 className="font-title text-3xl sm:text-4xl font-bold text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                My Promise To You ❤️
              </h3>

              <div className="font-cursive text-2xl text-zinc-100 leading-relaxed text-center select-text max-h-48 overflow-y-auto no-scrollbar px-1">
                Dearest Akshu,
                <br /><br />
                I love you more than words can express. You are my sunshine, my dream, and my favorite routine.
                <br />
                May this year bring you endless laughs and gorgeous smiles. I will be by your side forever.
                <br /><br />
                Happy Birthday! 🎂🥳💐
              </div>

              <div className="pt-2 text-zinc-400 text-xs uppercase tracking-widest font-bold font-sans">
                Sealed with Love
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// INK BLEED REVEAL CARD component
function InkBleedCard({ caption, wordsOrChars, isGuj }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rX = ((y / rect.height) - 0.5) * -15; // -7.5 to 7.5 deg
    const rY = ((x / rect.width) - 0.5) * 15; // -7.5 to 7.5 deg
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      onViewportEnter={() => setIsHovered(true)}
      animate={{
        rotateX,
        rotateY,
        y: isHovered ? -10 : 0,
        boxShadow: isHovered ? "0px 20px 40px rgba(219, 39, 119, 0.3)" : "0px 4px 10px rgba(0, 0, 0, 0.3)"
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000, willChange: "transform" }}
      className="glass-romantic p-6 sm:p-8 rounded-2xl cursor-pointer border border-pink-500/20 shadow-xl"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl text-pink-500 font-serif leading-none select-none">“</span>
        <div className="space-y-4 w-full">

          {/* Staggered ink bleed opacity reveal */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: isGuj ? 0.04 : 0.12
                }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`leading-relaxed text-zinc-100 ${isGuj ? 'font-gujarati text-lg sm:text-xl font-normal' : 'font-sans italic text-sm sm:text-lg'}`}
          >
            {wordsOrChars.map((item, idx) => (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0, filter: "blur(4px)" },
                  visible: { opacity: 1, filter: "blur(0px)" }
                }}
                className="inline-block whitespace-pre"
              >
                {item === " " ? "\u00A0" : item}
                {!isGuj && "\u00A0"}
              </motion.span>
            ))}
          </motion.div>

          <p className="text-right text-xs uppercase tracking-widest text-amber-300 font-bold">
            {caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
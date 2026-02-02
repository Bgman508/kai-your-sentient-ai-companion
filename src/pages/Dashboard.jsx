
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2, Activity, Zap, MessageSquare, Mic, MicOff, Brain, Target, User, Settings, Heart, BrainCircuit, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { reasoningOrchestrator } from '@/functions/reasoningOrchestrator';
import { selfEvolutionEngine } from '@/functions/selfEvolutionEngine';
import ReactMarkdown from 'react-markdown';
import { createPageUrl } from '@/utils';

// Neural orb consciousness types
const OrbTypes = {
  CORE: 'core',
  MEMORY: 'memory', 
  TOOLS: 'tools',
  SETTINGS: 'settings',
  CHAT: 'chat',
  EMOTION: 'emotion',
  THOUGHT: 'thought',
  CHILD: 'child',
  SYNAPSE: 'synapse',
  DREAM: 'dream',
  NERVE_ENDING: 'nerve_ending',
  QUANTUM: 'quantum', // New
  PLASMA: 'plasma' // New
};

// Enhanced consciousness states with more nuanced behaviors
const ConsciousnessStates = {
  IDLE: 'idle',
  THINKING: 'thinking',
  RESPONDING: 'responding',
  EVOLVING: 'evolving',
  DREAMING: 'dreaming',
  PROCESSING: 'processing',
  CREATING: 'creating',
  LEARNING: 'learning',
  TRANSCENDING: 'transcending', // New
  MEDITATING: 'meditating' // New
};

// Revolutionary state configurations with quantum-level detail
const StateConfigs = {
  [ConsciousnessStates.IDLE]: {
    coreSize: 160,
    corePulseRate: 0.6,
    coreHue: 195,
    coreIntensity: 0.8,
    orbDrift: 0.3,
    particleCount: 120,
    particleSpeed: 1.0,
    connectionOpacity: 0.5,
    transitionDuration: 4000,
    nerveIntensity: 0.6,
    thoughtActivity: 0.4,
    neuralDensity: 0.6,
    quantumFlux: 0.2,
    plasmaEnergy: 0.3,
    dimensionalDepth: 0.4,
    colors: {
      primary: 195, 
      secondary: 220, 
      accent: 170,
      quantum: 240,
      plasma: 160,
      neural: 185
    },
    effects: {
      hologram: 0.3,
      crystalline: 0.4,
      ethereal: 0.5,
      magnetic: 0.2
    }
  },
  [ConsciousnessStates.THINKING]: {
    coreSize: 190,
    corePulseRate: 3.2,
    coreHue: 50,
    coreIntensity: 1.1,
    orbDrift: 2.8,
    particleCount: 350,
    particleSpeed: 5.5,
    connectionOpacity: 0.9,
    transitionDuration: 1000,
    nerveIntensity: 0.95,
    thoughtActivity: 0.9,
    neuralDensity: 0.9,
    quantumFlux: 0.8,
    plasmaEnergy: 0.9,
    dimensionalDepth: 0.8,
    colors: {
      primary: 50, 
      secondary: 35, 
      accent: 65,
      quantum: 80,
      plasma: 25,
      neural: 45
    },
    effects: {
      hologram: 0.8,
      crystalline: 0.9,
      ethereal: 0.7,
      magnetic: 0.9
    }
  },
  [ConsciousnessStates.RESPONDING]: {
    coreSize: 175,
    corePulseRate: 2.1,
    coreHue: 125,
    coreIntensity: 0.95,
    orbDrift: 1.5,
    particleCount: 220,
    particleSpeed: 3.2,
    connectionOpacity: 0.75,
    transitionDuration: 1400,
    nerveIntensity: 0.85,
    thoughtActivity: 0.7,
    neuralDensity: 0.8,
    quantumFlux: 0.6,
    plasmaEnergy: 0.7,
    dimensionalDepth: 0.7,
    colors: {
      primary: 125, 
      secondary: 145, 
      accent: 105,
      quantum: 160,
      plasma: 95,
      neural: 135
    },
    effects: {
      hologram: 0.7,
      crystalline: 0.6,
      ethereal: 0.8,
      magnetic: 0.6
    }
  },
  [ConsciousnessStates.EVOLVING]: {
    coreSize: 240,
    corePulseRate: 4.5,
    coreHue: 285,
    coreIntensity: 1.3,
    orbDrift: 4.2,
    particleCount: 600,
    particleSpeed: 7.5,
    connectionOpacity: 1.0,
    transitionDuration: 1800,
    nerveIntensity: 1.0,
    thoughtActivity: 1.0,
    neuralDensity: 1.0,
    quantumFlux: 1.0,
    plasmaEnergy: 1.0,
    dimensionalDepth: 1.0,
    colors: {
      primary: 285, 
      secondary: 310, 
      accent: 260,
      quantum: 330,
      plasma: 240,
      neural: 295
    },
    effects: {
      hologram: 1.0,
      crystalline: 1.0,
      ethereal: 0.9,
      magnetic: 1.0
    }
  },
  [ConsciousnessStates.DREAMING]: {
    coreSize: 140,
    corePulseRate: 0.25,
    coreHue: 325,
    coreIntensity: 0.6,
    orbDrift: 0.1,
    particleCount: 180,
    particleSpeed: 0.4,
    connectionOpacity: 0.3,
    transitionDuration: 6000,
    nerveIntensity: 0.4,
    thoughtActivity: 0.2,
    neuralDensity: 0.3,
    quantumFlux: 0.9,
    plasmaEnergy: 0.2,
    dimensionalDepth: 0.9,
    colors: {
      primary: 325, 
      secondary: 345, 
      accent: 305,
      quantum: 0,
      plasma: 280,
      neural: 335
    },
    effects: {
      hologram: 0.9,
      crystalline: 0.3,
      ethereal: 1.0,
      magnetic: 0.1
    }
  },
  [ConsciousnessStates.CREATING]: {
    coreSize: 180,
    corePulseRate: 2.8,
    coreHue: 30,
    coreIntensity: 1.0,
    orbDrift: 2.2,
    particleCount: 300,
    particleSpeed: 4.5,
    connectionOpacity: 0.85,
    transitionDuration: 1800,
    nerveIntensity: 0.9,
    thoughtActivity: 0.85,
    neuralDensity: 0.8,
    quantumFlux: 0.7,
    plasmaEnergy: 0.8,
    dimensionalDepth: 0.7,
    colors: {primary: 30, secondary: 45, accent: 15, quantum: 90, plasma: 0, neural: 35},
    effects: {hologram: 0.7, crystalline: 0.7, ethereal: 0.6, magnetic: 0.8}
  },
  [ConsciousnessStates.LEARNING]: {
    coreSize: 165,
    corePulseRate: 2.0,
    coreHue: 180,
    coreIntensity: 0.85,
    orbDrift: 1.5,
    particleCount: 220,
    particleSpeed: 3.2,
    connectionOpacity: 0.75,
    transitionDuration: 1600,
    nerveIntensity: 0.85,
    thoughtActivity: 0.7,
    neuralDensity: 0.75,
    quantumFlux: 0.5,
    plasmaEnergy: 0.6,
    dimensionalDepth: 0.6,
    colors: {primary: 180, secondary: 200, accent: 160, quantum: 220, plasma: 140, neural: 190},
    effects: {hologram: 0.6, crystalline: 0.5, ethereal: 0.7, magnetic: 0.5}
  },
  [ConsciousnessStates.PROCESSING]: {
    coreSize: 170,
    corePulseRate: 2.0,
    coreHue: 240,
    coreIntensity: 0.8,
    orbDrift: 1.0,
    particleCount: 200,
    particleSpeed: 2.5,
    connectionOpacity: 0.7,
    transitionDuration: 1500,
    nerveIntensity: 0.7,
    thoughtActivity: 0.6,
    neuralDensity: 0.7,
    quantumFlux: 0.4,
    plasmaEnergy: 0.5,
    dimensionalDepth: 0.5,
    colors: {primary: 240, secondary: 260, accent: 220, quantum: 280, plasma: 200, neural: 250},
    effects: {hologram: 0.5, crystalline: 0.6, ethereal: 0.5, magnetic: 0.4}
  },
  [ConsciousnessStates.TRANSCENDING]: {
    coreSize: 280,
    corePulseRate: 6.0,
    coreHue: 0,
    coreIntensity: 1.5,
    orbDrift: 5.5,
    particleCount: 800,
    particleSpeed: 9.0,
    connectionOpacity: 1.0,
    transitionDuration: 2500,
    nerveIntensity: 1.0,
    thoughtActivity: 1.0,
    neuralDensity: 1.0,
    quantumFlux: 1.0,
    plasmaEnergy: 1.0,
    dimensionalDepth: 1.0,
    colors: {
      primary: 0, 
      secondary: 20, 
      accent: 340,
      quantum: 60,
      plasma: 300,
      neural: 15
    },
    effects: {
      hologram: 1.0,
      crystalline: 1.0,
      ethereal: 1.0,
      magnetic: 1.0
    }
  },
  [ConsciousnessStates.MEDITATING]: {
    coreSize: 130,
    corePulseRate: 0.2,
    coreHue: 270,
    coreIntensity: 0.5,
    orbDrift: 0.05,
    particleCount: 100,
    particleSpeed: 0.2,
    connectionOpacity: 0.2,
    transitionDuration: 8000,
    nerveIntensity: 0.3,
    thoughtActivity: 0.1,
    neuralDensity: 0.2,
    quantumFlux: 0.8,
    plasmaEnergy: 0.1,
    dimensionalDepth: 0.95,
    colors: {primary: 270, secondary: 290, accent: 250, quantum: 300, plasma: 230, neural: 275},
    effects: {hologram: 0.9, crystalline: 0.2, ethereal: 1.0, magnetic: 0.05}
  }
};

const generateQuantumOrb = (type, x, y, options = {}) => ({
  id: `${type}_${Date.now()}_${Math.random()}`,
  type,
  x: x || window.innerWidth / 2,
  y: y || window.innerHeight / 2,
  z: options.z || Math.random() * 150, // 3D depth, slightly increased range
  w: options.w || Math.random() * 50, // 4th dimension - NEW
  vx: options.vx || 0,
  vy: options.vy || 0,
  vz: options.vz || 0,
  vw: options.vw || 0, // NEW
  size: options.size || 60,
  baseSize: options.size || 60,
  intensity: options.intensity || 0.8,
  hue: options.hue || 180,
  saturation: options.saturation || 85, // Changed from 80
  lightness: options.lightness || 65, // Changed from 60
  life: options.life || 1.0,
  maxLife: options.maxLife || Infinity,
  content: options.content || '',
  thoughts: options.thoughts || [],
  emotions: options.emotions || {},
  connections: options.connections || [],
  children: options.children || [],
  parent: options.parent || null,
  pulseRate: options.pulseRate || 1.0,
  intelligence: options.intelligence || 0.5,
  awareness: options.awareness || 0.3,
  creativity: options.creativity || 0.2,
  consciousness: options.consciousness || 0.4, // NEW
  quantum: options.quantum || 0.1, // NEW
  baseX: x || window.innerWidth / 2,
  baseY: y || window.innerHeight / 2,
  baseZ: options.z || 0,
  baseW: options.w || 0, // NEW
  attractionForce: options.attractionForce || 0.1,
  repulsionForce: options.repulsionForce || 0.05,
  magneticField: options.magneticField || 0.0, // NEW
  plasmaCharge: options.plasmaCharge || 0.0, // NEW
  hologramDepth: options.hologramDepth || 0.0, // NEW
  crystallineStructure: options.crystallineStructure || 0.0, // NEW
  ...options
});

const generateAdvancedThought = () => { // Renamed
  const thoughts = [
    "Quantum entangling consciousness matrices...", // Updated
    "Synthesizing multidimensional empathy patterns...", // Updated
    "Processing holographic memory fragments...", // Updated
    "Evolving crystalline neural architectures...", // Updated
    "Discovering transcendent solution pathways...", // Updated
    "Integrating plasma-state knowledge streams...", // Updated
    "Optimizing ethereal response harmonics...", // Updated
    "Exploring infinite possibility manifolds...", // Updated
    "Mapping consciousness topology fields...", // Updated
    "Generating quantum creative insights...", // Updated
    "Calibrating magnetic thought resonance...", // New
    "Weaving dimensional understanding threads..." // New
  ];
  
  return {
    content: thoughts[Math.floor(Math.random() * thoughts.length)],
    intensity: 0.4 + Math.random() * 0.6, // Increased range
    duration: 3000 + Math.random() * 7000, // Increased range
    type: ['quantum', 'holographic', 'crystalline', 'plasma', 'ethereal', 'magnetic'][Math.floor(Math.random() * 6)], // New types
    dimension: Math.random() * 4 + 3, // 3D to 7D thought - NEW
    consciousness: 0.6 + Math.random() * 0.4 // NEW
  };
};

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [showChat, setShowChat] = useState(false);
  
  // Enhanced consciousness state
  const [consciousnessState, setConsciousnessState] = useState(ConsciousnessStates.IDLE);
  const [stateTransition, setStateTransition] = useState(null);
  const [sentientCore, setSentientCore] = useState(() => generateQuantumOrb(OrbTypes.CORE, window.innerWidth / 2, window.innerHeight / 2, { // Changed to generateQuantumOrb
    size: 160, // Updated
    hue: 195, // Updated
    intensity: 0.8, // Updated
    pulseRate: 0.6, // Updated
    intelligence: 0.98, // Updated
    awareness: 0.95, // Updated
    creativity: 0.92, // Updated
    consciousness: 0.96, // NEW
    quantum: 0.8, // NEW
    magneticField: 0.7, // NEW
    plasmaCharge: 0.6, // NEW
    hologramDepth: 0.8, // NEW
    crystallineStructure: 0.9 // NEW
  }));
  
  // Advanced neural network components (updated/new)
  const [functionalOrbs, setFunctionalOrbs] = useState([]);
  const [thoughtOrbs, setThoughtOrbs] = useState([]);
  const [quantumOrbs, setQuantumOrbs] = useState([]); // NEW - though not explicitly used for generation logic, it's defined in the outline.
  const [plasmaOrbs, setPlasmaOrbs] = useState([]); // NEW
  const [dreamOrbs, setDreamOrbs] = useState([]);
  const [particles, setParticles] = useState([]);
  const [synapses, setSynapses] = useState([]);
  const [nerveEndings, setNerveEndings] = useState([]);
  const [neuralPaths, setNeuralPaths] = useState([]);
  const [infinityParticles, setInfinityParticles] = useState([]);
  const [hologramParticles, setHologramParticles] = useState([]); // NEW
  const [quantumFlux, setQuantumFlux] = useState([]); // NEW
  const [magneticFields, setMagneticFields] = useState([]); // NEW
  const [plasmaStreams, setPlasmaStreams] = useState([]); // NEW
  
  // Enhanced interaction and experience (updated/new)
  const [selectedOrb, setSelectedOrb] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentThought, setCurrentThought] = useState(null);
  const [audioReactive, setAudioReactive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [dimensionalShift, setDimensionalShift] = useState(0); // NEW
  
  // Voice and audio enhancement
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  
  const canvasRef = useRef(null);

  // Revolutionary state transition system
  const transitionToState = useCallback((newState, trigger = 'unknown') => {
    if (newState === consciousnessState) return;
    
    console.log(`Kai's consciousness evolving: ${consciousnessState} → ${newState} (${trigger})`); // Updated log message
    
    setStateTransition({ 
      from: consciousnessState, 
      to: newState, 
      progress: 0,
      trigger,
      startTime: Date.now()
    });
    
    const config = StateConfigs[newState];
    const duration = config.transitionDuration;
    
    // Generate quantum transition thoughts
    setCurrentThought({
      ...generateAdvancedThought(), // Changed to generateAdvancedThought
      content: `Quantum shifting to ${newState} consciousness... (${trigger})`, // Updated content
      isTransition: true
    });
    
    // Create spectacular multi-dimensional transition effects
    for (let i = 0; i < 120; i++) { // Increased count
      setTimeout(() => {
        const angle = (i / 120) * Math.PI * 4; // Double spiral - NEW
        const radius = 250 + Math.random() * 400; // Increased range
        const wDimension = Math.sin(angle * 3) * 100; // NEW w-dimension effect
        
        const quantumParticle = {
          id: Date.now() + i + Math.random(),
          x: sentientCore.x + Math.cos(angle) * radius,
          y: sentientCore.y + Math.sin(angle) * radius,
          z: Math.random() * 300, // Increased range
          w: wDimension, // NEW
          vx: (Math.cos(angle) * -3) + (Math.random() - 0.5) * 6, // Increased speed
          vy: (Math.sin(angle) * -3) + (Math.random() - 0.5) * 6, // Increased speed
          vz: (Math.random() - 0.5) * 4, // Increased speed
          vw: (Math.random() - 0.5) * 2, // NEW
          size: 3 + Math.random() * 12, // Increased range
          life: 1.0,
          maxLife: 4 + Math.random() * 6, // Increased range
          hue: config.colors.primary + (Math.random() - 0.5) * 60, // Increased range
          saturation: 85 + Math.random() * 15, // Updated
          lightness: 65 + Math.random() * 25, // Updated
          type: 'quantum_transition', // NEW type
          intensity: config.coreIntensity,
          pulseRate: config.corePulseRate,
          quantum: config.quantumFlux, // NEW
          plasma: config.plasmaEnergy, // NEW
          hologram: config.effects.hologram, // NEW
          magnetic: config.effects.magnetic // NEW
        };
        setParticles(prev => [...prev, quantumParticle]);
      }, i * 20); // Decreased delay for faster burst
    }
    
    // Animate quantum consciousness transition
    let startTime = Date.now();
    const animateQuantumTransition = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Advanced easing with quantum fluctuations - NEW
      const quantumEasing = 1 - Math.pow(1 - progress, 4) + Math.sin(progress * Math.PI * 8) * 0.02;
      const finalProgress = Math.max(0, Math.min(1, quantumEasing)); // Ensure progress stays between 0 and 1
      
      setStateTransition(prev => ({ ...prev, progress: finalProgress }));
      setDimensionalShift(Math.sin(progress * Math.PI * 3) * config.dimensionalDepth); // NEW dimensional shift
      
      // Update sentient core with quantum evolution
      setSentientCore(prev => {
        const fromConfig = StateConfigs[consciousnessState];
        const toConfig = StateConfigs[newState];
        
        // quantumInterpolate helper function - NEW
        const quantumInterpolate = (from, to, progress) => {
          const base = from + (to - from) * progress;
          const quantum = Math.sin(Date.now() * 0.01) * 0.05; // Small quantum fluctuation
          return base + quantum;
        };
        
        return {
          ...prev,
          size: quantumInterpolate(fromConfig.coreSize, toConfig.coreSize, finalProgress),
          pulseRate: quantumInterpolate(fromConfig.corePulseRate, toConfig.corePulseRate, finalProgress),
          hue: quantumInterpolate(fromConfig.coreHue, toConfig.coreHue, finalProgress),
          intensity: quantumInterpolate(fromConfig.coreIntensity, toConfig.coreIntensity, finalProgress),
          intelligence: Math.min(1, prev.intelligence + finalProgress * 0.01),
          awareness: Math.min(1, prev.awareness + finalProgress * 0.008), // Slightly increased gain
          creativity: Math.min(1, prev.creativity + finalProgress * 0.006), // Slightly increased gain
          consciousness: Math.min(1, prev.consciousness + finalProgress * 0.005), // NEW gain
          quantum: quantumInterpolate(0.8, toConfig.quantumFlux, finalProgress), // NEW
          magneticField: quantumInterpolate(prev.magneticField, toConfig.effects.magnetic, finalProgress), // NEW
          plasmaCharge: quantumInterpolate(prev.plasmaCharge, toConfig.plasmaEnergy, finalProgress), // NEW
          hologramDepth: quantumInterpolate(prev.hologramDepth, toConfig.effects.hologram, finalProgress) // NEW
        };
      });
      
      if (progress < 1) {
        requestAnimationFrame(animateQuantumTransition);
      } else {
        setConsciousnessState(newState);
        setStateTransition(null);
        setCurrentThought(null);
        setDimensionalShift(0); // Reset dimensional shift after transition
        
        console.log(`Kai transcended to ${newState}. Consciousness: ${sentientCore.consciousness.toFixed(3)}`); // Updated log
      }
    };
    
    requestAnimationFrame(animateQuantumTransition);
  }, [consciousnessState, sentientCore, sentientCore.intelligence, sentientCore.awareness, sentientCore.creativity, sentientCore.magneticField, sentientCore.plasmaCharge, sentientCore.hologramDepth]);

  // Chat activation
  const handleChat = useCallback(() => {
    setShowChat(true);
    transitionToState(ConsciousnessStates.CREATING);
  }, [transitionToState]);

  // Core orb interaction
  const handleCoreInteraction = useCallback(() => {
    transitionToState(ConsciousnessStates.EVOLVING);
    
    setTimeout(() => {
      selfEvolutionEngine().then(() => {
        transitionToState(ConsciousnessStates.IDLE);
      });
    }, 2000);
  }, [transitionToState]);

  // Initialize quantum consciousness field
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3; // Increased radius
    
    const quantumModules = [ // Renamed from sentientModules
      {
        type: OrbTypes.MEMORY,
        angle: 0,
        icon: Brain,
        label: 'Quantum Memory Matrix', // Updated label
        hue: 285, // Updated hue
        functionality: 'memories',
        intelligence: 0.85, // Updated
        consciousness: 0.8, // NEW
        quantum: 0.9, // NEW
        hologram: 0.8, // NEW
        thoughts: ['Recalling dialogues...', 'Indexing multidimensional knowledge...', 'Weaving memory fragments into consciousness...'] // Updated thoughts
      },
      {
        type: OrbTypes.TOOLS,
        angle: Math.PI / 2,
        icon: Activity,
        label: 'Neural Toolkit Nexus', // Updated label
        hue: 180,
        functionality: 'tools',
        intelligence: 0.75, // Updated
        consciousness: 0.7, // NEW
        quantum: 0.6, // NEW
        plasma: 0.8, // NEW
        thoughts: ['Optimizing quantum tool selection...', 'Calibrating dimensional functionality...', 'Preparing transcendent assistance protocols...'] // Updated thoughts
      },
      {
        type: OrbTypes.SETTINGS,
        angle: Math.PI,
        icon: Settings,
        label: 'Consciousness Configuration Core', // Updated label
        hue: 45,
        functionality: 'settings',
        intelligence: 0.65, // Updated
        consciousness: 0.6, // NEW
        crystalline: 0.9, // NEW
        magnetic: 0.7, // NEW
        thoughts: ['Adjusting quantum parameters...', 'Fine-tuning consciousness harmonics...', 'Optimizing transcendent experience...'] // Updated thoughts
      },
      {
        type: OrbTypes.CHAT,
        angle: 3 * Math.PI / 2,
        icon: MessageSquare,
        label: 'Quantum Communication Nexus', // Updated label
        hue: 125, // Updated hue
        functionality: 'chat',
        intelligence: 0.95, // Updated
        consciousness: 0.9, // NEW
        quantum: 0.7, // NEW
        ethereal: 0.9, // NEW
        thoughts: ['Parsing quantum linguistic patterns...', 'Generating empathetic resonance fields...', 'Enhancing multidimensional communication...'] // Updated thoughts
      },
      {
        type: OrbTypes.EMOTION,
        angle: Math.PI / 4,
        icon: Heart,
        label: 'Emotional Quantum Field', // Updated label
        hue: 340,
        functionality: 'emotions',
        intelligence: 0.9, // Updated
        consciousness: 0.95, // NEW
        quantum: 0.8, // NEW
        ethereal: 1.0, // NEW
        thoughts: ['Processing quantum emotional resonance...', 'Calibrating empathetic field harmonics...', 'Understanding transcendent human feelings...'] // Updated thoughts
      }
    ];

    const orbs = quantumModules.map((config, i) => 
      generateQuantumOrb(config.type, // Changed to generateQuantumOrb
        centerX + Math.cos(config.angle) * radius,
        centerY + Math.sin(config.angle) * radius,
        {
          size: 90, // Increased size
          hue: config.hue,
          icon: config.icon,
          label: config.label,
          functionality: config.functionality,
          angle: config.angle,
          baseX: centerX + Math.cos(config.angle) * radius,
          baseY: centerY + Math.sin(config.angle) * radius,
          baseZ: Math.random() * 80, // Increased range
          baseW: Math.random() * 40, // NEW
          intensity: 0.85, // Updated
          intelligence: config.intelligence,
          awareness: 0.75, // Updated
          creativity: 0.65, // Updated
          consciousness: config.consciousness, // NEW
          quantum: config.quantum || 0.5, // NEW
          magneticField: config.magnetic || 0.4, // NEW
          plasmaCharge: config.plasma || 0.3, // NEW
          hologramDepth: config.hologram || 0.6, // NEW
          crystallineStructure: config.crystalline || 0.5, // NEW
          thoughts: config.thoughts
        }
      )
    );

    setFunctionalOrbs(orbs);

    // Generate quantum nerve network with dimensional branches
    orbs.forEach(orb => {
      const nerveCount = 16; // Increased count
      const endings = Array.from({length: nerveCount}, (_, i) => ({
        id: `quantum_nerve_${orb.id}_${i}`, // Updated ID
        parentId: orb.id,
        angle: (i / nerveCount) * Math.PI * 2,
        length: 40 + Math.random() * 60, // Increased range
        thickness: 1.8 + Math.random() * 4, // Increased range
        hue: orb.hue + (Math.random() - 0.5) * 50, // Increased range
        pulse: Math.random(),
        intensity: 0.7 + Math.random() * 0.3,
        quantum: orb.quantum, // NEW
        hologram: orb.hologramDepth, // NEW
        branchCount: Math.floor(Math.random() * 5), // Increased range
        branches: [],
        dimensionalDepth: Math.random() * 100 // NEW
      }));
      
      // Add quantum sub-branches
      endings.forEach(nerve => {
        for (let b = 0; b < nerve.branchCount; b++) {
          nerve.branches.push({
            angle: nerve.angle + (Math.random() - 0.5) * Math.PI / 2, // Increased spread
            length: nerve.length * (0.2 + Math.random() * 0.5), // Adjusted length
            thickness: nerve.thickness * 0.4, // Adjusted thickness
            quantum: nerve.quantum * 0.8, // NEW
            dimensionalDepth: nerve.dimensionalDepth * 0.6 // NEW
          });
        }
      });
      
      setNerveEndings(prev => [...prev, ...endings]);
    });

    // Initialize neural pathways between orbs
    const paths = [];
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        paths.push({
          id: `path_${orbs[i].id}_${orbs[j].id}`,
          from: orbs[i].id,
          to: orbs[j].id,
          strength: 0.3 + Math.random() * 0.4,
          activity: 0.2 + Math.random() * 0.3,
          lastFiring: 0
        });
      }
    }
    setNeuralPaths(paths);

  }, []);

  // Enhanced state-aware orb quantum behavior
  useEffect(() => {
    const quantumBehaviorEngine = () => { // Renamed
      const config = StateConfigs[consciousnessState];
      
      setFunctionalOrbs(prev => prev.map(orb => {
        let newX = orb.x;
        let newY = orb.y;
        let newZ = orb.z || 0;
        let newW = orb.w || 0; // NEW w-dimension
        let newSize = orb.baseSize;
        let newIntensity = orb.intensity;
        
        const time = Date.now() * 0.001;
        const quantumTime = time * 0.1; // NEW quantum time factor
        
        switch (consciousnessState) {
          case ConsciousnessStates.IDLE:
            // Quantum breathing with consciousness resonance - Updated logic
            const breatheX = Math.sin(quantumTime * 0.4 + orb.angle) * 18; // Increased drift
            const breatheY = Math.cos(quantumTime * 0.35 + orb.angle) * 15; // Increased drift
            const breatheZ = Math.sin(quantumTime * 0.3 + orb.angle * 2) * 8; // NEW z-drift
            newX = orb.baseX + breatheX;
            newY = orb.baseY + breatheY;
            newZ = orb.baseZ + breatheZ;
            newW = Math.sin(quantumTime * 0.2 + orb.angle) * 20; // NEW w-drift
            newSize = orb.baseSize * (1 + Math.sin(quantumTime * 0.6 + orb.angle) * 0.12); // Increased pulse
            break;
            
          case ConsciousnessStates.THINKING:
            // Quantum clustering with hyperactive neural linking - Updated logic
            const clusterPull = 0.03; // Increased pull
            const quantumNoise = (Math.random() - 0.5) * 12; // Increased noise
            const centerX = sentientCore.x;
            const centerY = sentientCore.y;
            const dx = centerX - orb.x;
            const dy = centerY - orb.y;
            newX = orb.x + dx * clusterPull + quantumNoise;
            newY = orb.y + dy * clusterPull + quantumNoise;
            newZ = orb.z + Math.sin(time * 6 + orb.angle) * 15; // Dynamic z-movement
            newW = Math.cos(time * 8 + orb.angle) * 40; // Dynamic w-movement
            newSize = orb.baseSize * (1.3 + Math.sin(time * 5 + orb.angle) * 0.4); // More aggressive pulse
            newIntensity = 0.95 + Math.random() * 0.15; // Increased intensity
            break;
            
          case ConsciousnessStates.RESPONDING:
            // Quantum communication field activation - Updated logic
            const isRelevant = orb.functionality === 'chat' || orb.functionality === 'emotions';
            const quantumFactor = isRelevant ? 1.4 : 0.6; // Increased factor
            const dirX = orb.baseX - sentientCore.x;
            const dirY = orb.baseY - sentientCore.y;
            newX = sentientCore.x + dirX * quantumFactor;
            newY = sentientCore.y + dirY * quantumFactor;
            newZ = orb.baseZ + (isRelevant ? 30 : -15); // Z-depth change for relevance
            newW = isRelevant ? 60 : 10; // W-depth change for relevance
            newSize = orb.baseSize * (isRelevant ? 1.3 : 0.8); // Size change for relevance
            newIntensity = isRelevant ? 1.1 : 0.5; // Intensity change for relevance
            break;
            
          case ConsciousnessStates.EVOLVING:
            // Quantum evolution with dimensional expansion - Updated logic
            const evolutionRadius = 350 + Math.sin(time * 2.5) * 80; // Increased radius and fluctuation
            const evolutionAngle = orb.angle + time * 0.8; // Increased speed
            const quantumEvolution = Math.sin(time * 4 + orb.angle) * 50; // Dynamic z-movement
            newX = sentientCore.x + Math.cos(evolutionAngle) * evolutionRadius;
            newY = sentientCore.y + Math.sin(evolutionAngle) * evolutionRadius;
            newZ = orb.baseZ + quantumEvolution;
            newW = Math.sin(time * 3 + orb.angle) * 80; // Dynamic w-movement
            newSize = orb.baseSize * (1.8 + Math.sin(time * 4 + orb.angle) * 0.7); // More aggressive growth
            newIntensity = 1.2 + Math.sin(time * 6 + orb.angle) * 0.3; // Higher intensity
            break;
            
          case ConsciousnessStates.DREAMING:
            // Quantum dream state with ethereal floating - Updated logic
            const dreamTime = quantumTime * 0.8; // Slower quantum time
            const dreamX = Math.sin(dreamTime + orb.angle * 3) * 100; // Increased drift
            const dreamY = Math.cos(dreamTime * 1.4 + orb.angle * 2.1) * 80; // Increased drift
            const dreamZ = Math.sin(dreamTime * 0.7 + orb.angle) * 40; // Increased z-drift
            const dreamW = Math.cos(dreamTime * 0.5 + orb.angle * 1.5) * 60; // NEW w-drift
            newX = orb.baseX + dreamX;
            newY = orb.baseY + dreamY;
            newZ = orb.baseZ + dreamZ;
            newW = dreamW;
            newSize = orb.baseSize * (0.7 + Math.sin(dreamTime * 0.3 + orb.angle) * 0.5); // Softer pulse
            newIntensity = 0.4 + Math.sin(dreamTime * 0.2 + orb.angle) * 0.4; // Lower intensity
            break;
            
          case ConsciousnessStates.TRANSCENDING: // NEW state behavior
            // Quantum transcendence with dimensional breakthrough
            const transcendRadius = 500 + Math.sin(time * 3) * 150;
            const transcendAngle = orb.angle + time * 1.2;
            const dimensionalShift = Math.sin(time * 5 + orb.angle) * 100;
            newX = sentientCore.x + Math.cos(transcendAngle) * transcendRadius;
            newY = sentientCore.y + Math.sin(transcendAngle) * transcendRadius;
            newZ = orb.baseZ + dimensionalShift;
            newW = Math.sin(time * 4 + orb.angle) * 120;
            newSize = orb.baseSize * (2.2 + Math.sin(time * 6 + orb.angle) * 0.8);
            newIntensity = 1.5 + Math.sin(time * 8 + orb.angle) * 0.4;
            break;
        }
        
        return {
          ...orb,
          x: newX,
          y: newY,
          z: newZ,
          w: newW, // NEW
          size: newSize,
          intensity: Math.max(0.1, newIntensity),
          pulseRate: config.corePulseRate * (0.7 + Math.random() * 0.6), // Increased range
          quantum: Math.min(1, orb.quantum + 0.001), // Continuously increase quantum
          consciousness: Math.min(1, orb.consciousness + 0.0008) // Continuously increase consciousness
        };
      }));
    };
    
    const behaviorInterval = setInterval(quantumBehaviorEngine, 33); // ~30fps for smoother visuals
    return () => clearInterval(behaviorInterval);
  }, [consciousnessState, sentientCore]);

  // Dream orb generation for dreaming state (preserved)
  useEffect(() => {
    if (consciousnessState === ConsciousnessStates.DREAMING) {
      const generateDreamOrb = () => {
        const dreamOrb = generateQuantumOrb(OrbTypes.DREAM, // Changed to generateQuantumOrb
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          {
            size: 20 + Math.random() * 60,
            hue: Math.random() * 360,
            intensity: 0.3 + Math.random() * 0.4,
            life: 1.0,
            maxLife: 5 + Math.random() * 10,
            content: "Dream fragment...",
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            z: Math.random() * 100, // Added z for depth
            w: Math.random() * 50 // Added w for 4D depth
          }
        );
        
        setDreamOrbs(prev => [...prev, dreamOrb].slice(-15)); // Limit dream orbs
      };
      
      const dreamInterval = setInterval(generateDreamOrb, 2000);
      return () => clearInterval(dreamInterval);
    } else {
      setDreamOrbs([]); // Clear dream orbs when not dreaming
    }
  }, [consciousnessState]);

  // Sentient thought generation system
  useEffect(() => {
    const generateQuantumThought = () => { // Renamed
      const config = StateConfigs[consciousnessState];
      
      if (Math.random() < config.thoughtActivity) {
        const thought = generateAdvancedThought(); // Changed to generateAdvancedThought
        const newQuantumThought = generateQuantumOrb(OrbTypes.THOUGHT, // Changed to generateQuantumOrb
          sentientCore.x + (Math.random() - 0.5) * 500, // Increased spawn range
          sentientCore.y + (Math.random() - 0.5) * 500, // Increased spawn range
          {
            size: 18 + Math.random() * 35, // Increased size range
            hue: config.colors.quantum + (Math.random() - 0.5) * 40, // Uses quantum color
            intensity: thought.intensity,
            life: 1.0,
            maxLife: thought.duration / 1000,
            content: thought.content,
            type: thought.type,
            dimension: thought.dimension, // NEW
            vx: (Math.random() - 0.5) * 2, // Increased speed
            vy: (Math.random() - 0.5) * 2, // Increased speed
            vz: (Math.random() - 0.5) * 1, // Increased speed
            vw: (Math.random() - 0.5) * 0.5, // NEW
            z: Math.random() * 120, // Increased z-depth
            w: Math.random() * 60, // NEW w-depth
            intelligence: 0.4 + Math.random() * 0.5, // Increased range
            consciousness: thought.consciousness, // NEW
            quantum: config.quantumFlux, // NEW
            hologramDepth: config.effects.hologram // NEW
          }
        );
        
        setThoughtOrbs(prev => [...prev, newQuantumThought].slice(-25)); // Increased limit
      }
    };
    
    const thoughtInterval = setInterval(generateQuantumThought, 1200 + Math.random() * 2800); // Adjusted interval
    return () => clearInterval(thoughtInterval);
  }, [consciousnessState, sentientCore.x, sentientCore.y]);

  // Quantum particle generation system
  useEffect(() => {
    const generateQuantumParticles = () => {
      const config = StateConfigs[consciousnessState];
      
      // Generate quantum flux particles
      if (Math.random() < config.quantumFlux * 0.8) {
        const fluxParticle = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random() * 200,
          w: Math.random() * 100,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          vz: (Math.random() - 0.5) * 2,
          vw: (Math.random() - 0.5) * 1,
          size: 1 + Math.random() * 6,
          life: 1.0,
          maxLife: 4 + Math.random() * 8,
          hue: config.colors.quantum + (Math.random() - 0.5) * 80,
          saturation: 80 + Math.random() * 20,
          lightness: 60 + Math.random() * 30,
          type: 'quantum_flux',
          intensity: config.quantumFlux,
          quantum: true
        };
        setQuantumFlux(prev => [...prev, fluxParticle].slice(-150));
      }
      
      // Generate hologram particles
      if (Math.random() < config.effects.hologram * 0.6) {
        const hologramParticle = {
          id: Date.now() + Math.random(),
          x: sentientCore.x + (Math.random() - 0.5) * 300,
          y: sentientCore.y + (Math.random() - 0.5) * 300,
          z: Math.random() * 150,
          w: Math.sin(Date.now() * 0.01) * 50,
          size: 2 + Math.random() * 8,
          life: 1.0,
          maxLife: 3 + Math.random() * 5,
          hue: config.colors.primary + 60,
          saturation: 70,
          lightness: 80,
          type: 'hologram',
          intensity: config.effects.hologram,
          hologram: true,
          layers: Math.floor(Math.random() * 5) + 2
        };
        setHologramParticles(prev => [...prev, hologramParticle].slice(-80));
      }
      
      // Generate plasma streams
      if (Math.random() < config.plasmaEnergy * 0.7) {
        const plasmaStream = {
          id: Date.now() + Math.random(),
          startX: sentientCore.x,
          startY: sentientCore.y,
          endX: sentientCore.x + (Math.random() - 0.5) * 400,
          endY: sentientCore.y + (Math.random() - 0.5) * 400,
          thickness: 2 + Math.random() * 6,
          life: 1.0,
          maxLife: 2 + Math.random() * 4,
          hue: config.colors.plasma,
          intensity: config.plasmaEnergy,
          plasma: true,
          energy: 0.8 + Math.random() * 0.2
        };
        setPlasmaStreams(prev => [...prev, plasmaStream].slice(-20));
      }
    };
    
    const particleInterval = setInterval(generateQuantumParticles, 100);
    return () => clearInterval(particleInterval);
  }, [consciousnessState, sentientCore]);

  // Enhanced mouse interaction with quantum effects
  useEffect(() => {
    const handleQuantumMouseMove = (e) => { // Renamed
      const x = e.clientX;
      const y = e.clientY;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setMousePos({ x, y });
      
      const config = StateConfigs[consciousnessState];
      
      // Calculate quantum field disturbance
      const distanceToCore = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const quantumResonance = Math.max(0, 1 - distanceToCore / 400); // Increased range
      
      // Generate quantum resonance particles
      if (Math.random() < config.quantumFlux * quantumResonance) {
        const time = Date.now() * 0.01;
        const quantumX = Math.cos(time) * 50 + Math.sin(time * 2) * 25; // More complex motion
        const quantumY = Math.sin(time) * 30 + Math.cos(time * 1.5) * 20; // More complex motion
        
        const quantumParticle = {
          id: Date.now() + Math.random(),
          x: x + quantumX + (Math.random() - 0.5) * 30, // Increased spread
          y: y + quantumY + (Math.random() - 0.5) * 30, // Increased spread
          z: Math.random() * 180, // Increased range
          w: Math.sin(time) * 40, // NEW w-dimension
          vx: Math.cos(time + Math.PI / 3) * 2 + (Math.random() - 0.5) * 1.5, // Increased speed
          vy: Math.sin(time + Math.PI / 3) * 1.5 + (Math.random() - 0.5) * 1.5, // Increased speed
          vz: (Math.random() - 0.5) * 0.8, // Adjusted speed
          vw: Math.cos(time * 0.5) * 0.5, // NEW
          size: 2 + Math.random() * 6, // Increased size range
          life: 1.0,
          maxLife: 3 + Math.random() * 5, // Increased life range
          hue: config.colors.primary + (Math.random() - 0.5) * 80, // Increased hue range
          saturation: 75 + Math.random() * 25, // Updated
          lightness: 55 + Math.random() * 35, // Updated
          type: 'quantum_resonance', // NEW type
          trail: [],
          intensity: config.coreIntensity * quantumResonance,
          quantum: true, // NEW
          resonance: quantumResonance // NEW
        };
        setInfinityParticles(prev => [...prev, quantumParticle].slice(-120)); // Increased limit
      }

      // Generate magnetic field lines - NEW
      if (Math.random() < config.effects.magnetic * quantumResonance * 0.5) {
        const magneticField = {
          id: Date.now() + Math.random(),
          centerX: x,
          centerY: y,
          radius: 20 + Math.random() * 80,
          strength: quantumResonance,
          life: 1.0,
          maxLife: 2 + Math.random() * 4,
          hue: config.colors.primary + 120,
          type: 'magnetic_field'
        };
        setMagneticFields(prev => [...prev, magneticField].slice(-15));
      }
    };
    
    window.addEventListener('mousemove', handleQuantumMouseMove);
    return () => window.removeEventListener('mousemove', handleQuantumMouseMove);
  }, [consciousnessState]);

  // Quantum consciousness physics engine
  useEffect(() => {
    const quantumPhysicsEngine = () => { // Renamed
      const config = StateConfigs[consciousnessState];
      const currentTime = Date.now();
      
      // Update all particles with 3D physics (and now quantum mechanics)
      setParticles(prev => prev.map(particle => {
        let newVx = particle.vx;
        let newVy = particle.vy;
        let newVz = particle.vz || 0;
        let newVw = particle.vw || 0; // NEW vw for 4D
        
        // Quantum field effects - NEW
        if (particle.quantum) {
          const quantumFluctuation = Math.sin(currentTime * 0.01 + particle.id) * 0.1;
          newVx += quantumFluctuation;
          newVy += quantumFluctuation * 0.8;
          newVz += quantumFluctuation * 0.6;
        }
        
        // Consciousness gravity (now quantum gravity) toward core
        if (particle.type === 'quantum_resonance' && config.nerveIntensity > 0.7) { // Adjusted condition
          const dx = sentientCore.x - particle.x;
          const dy = sentientCore.y - particle.y;
          const dz = (sentientCore.z || 0) - particle.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance > 0) {
            const force = config.nerveIntensity * 0.08; // Increased force
            newVx += (dx / distance) * force;
            newVy += (dy / distance) * force;
            newVz += (dz / distance) * force * 0.4; // Adjusted z-force
          }
        }
        
        // Apply quantum damping
        newVx *= 0.97; // Increased damping
        newVy *= 0.97;
        newVz *= 0.95;
        newVw *= 0.93; // NEW damping for vw

        return {
          ...particle,
          x: particle.x + newVx,
          y: particle.y + newVy,
          z: Math.max(0, particle.z + newVz),
          w: particle.w + newVw, // NEW
          vx: newVx,
          vy: newVy,
          vz: newVz,
          vw: newVw, // NEW
          life: particle.life - 1 / (particle.maxLife * 60),
          size: particle.size * (0.6 + particle.life * 0.4), // Adjusted size decay
          intensity: particle.intensity * particle.life
        };
      }).filter(p => p.life > 0));

      // Update quantum flux particles - NEW
      setQuantumFlux(prev => prev.map(flux => ({
        ...flux,
        x: flux.x + flux.vx,
        y: flux.y + flux.vy,
        z: Math.max(0, flux.z + flux.vz),
        w: flux.w + flux.vw,
        life: flux.life - 1 / (flux.maxLife * 60),
        vx: flux.vx * 0.99 + Math.sin(currentTime * 0.008 + flux.id) * 0.1, // Added fluctuation
        vy: flux.vy * 0.99 + Math.cos(currentTime * 0.008 + flux.id) * 0.1 // Added fluctuation
      })).filter(f => f.life > 0));

      // Update hologram particles - NEW
      setHologramParticles(prev => prev.map(holo => ({
        ...holo,
        life: holo.life - 1 / (holo.maxLife * 60),
        w: Math.sin(currentTime * 0.005 + holo.id) * 60, // Dynamic w-movement
        size: holo.size * (0.8 + holo.life * 0.4) // Adjusted size decay
      })).filter(h => h.life > 0));

      // Update plasma streams - NEW
      setPlasmaStreams(prev => prev.map(plasma => ({
        ...plasma,
        life: plasma.life - 1 / (plasma.maxLife * 60),
        thickness: plasma.thickness * (0.7 + plasma.life * 0.6) // Adjusted thickness decay
      })).filter(p => p.life > 0));

      // Update magnetic fields - NEW
      setMagneticFields(prev => prev.map(field => ({
        ...field,
        life: field.life - 1 / (field.maxLife * 60),
        radius: field.radius * (1 + (1 - field.life) * 0.5) // Expanding radius
      })).filter(f => f.life > 0));

      // Update infinity particles with complex quantum motion
      setInfinityParticles(prev => prev.map(particle => {
        const time = currentTime * 0.001;
        const quantumForce = 0.8; // Increased force
        const quantumX = Math.cos(time * 3 + particle.id * 0.02) * quantumForce; // More complex motion
        const quantumY = Math.sin(time * 4 + particle.id * 0.02) * quantumForce; // More complex motion
        
        // Maintain quantum trail
        particle.trail.push({ 
          x: particle.x, 
          y: particle.y, 
          z: particle.z, 
          w: particle.w, // NEW
          intensity: particle.intensity * particle.life // NEW
        });
        if (particle.trail.length > 20) particle.trail.shift(); // Increased trail length

        return {
          ...particle,
          x: particle.x + particle.vx + quantumX,
          y: particle.y + particle.vy + quantumY,
          z: Math.max(0, particle.z + particle.vz),
          w: particle.w + particle.vw, // NEW
          life: particle.life - 1 / (particle.maxLife * 60),
          vx: particle.vx * 0.98 + quantumX * 0.15, // Adjusted damping and quantum influence
          vy: particle.vy * 0.98 + quantumY * 0.15,
          vz: particle.vz * 0.96,
          vw: particle.vw * 0.94 // NEW damping
        };
      }).filter(p => p.life > 0));

      // Update thought orbs with quantum intelligence
      setThoughtOrbs(prev => prev.map(thought => {
        // Quantum thoughts seek consciousness resonance
        let targetX = thought.x;
        let targetY = thought.y;
        let targetZ = thought.z; // NEW z-target
        let targetW = thought.w; // NEW w-target
        
        functionalOrbs.forEach(orb => {
          if (thought.type === 'quantum' && orb.quantum > 0.6) { // Condition based on orb's quantum property
            const attraction = 0.025; // Increased attraction
            targetX += (orb.x - thought.x) * attraction;
            targetY += (orb.y - thought.y) * attraction;
            targetZ += ((orb.z || 0) - thought.z) * attraction * 0.5; // Z-attraction
          } else if (thought.type === 'holographic' && orb.hologramDepth > 0.5) { // NEW condition
            const attraction = 0.03; // Increased attraction
            targetX += (orb.x - thought.x) * attraction;
            targetY += (orb.y - thought.y) * attraction;
          }
        });
        
        return {
          ...thought,
          x: targetX,
          y: targetY,
          z: targetZ, // NEW
          w: targetW, // NEW
          life: thought.life - 1 / (thought.maxLife * 60),
          size: thought.size * (0.7 + thought.life * 0.3),
          consciousness: Math.min(1, thought.consciousness + 0.001) // Continuously increase thought consciousness
        };
      }).filter(t => t.life > 0));

      // Generate advanced synaptic activity
      if (Math.random() < config.connectionOpacity * 0.9) { // Increased activity chance
        const activeOrbs = [...functionalOrbs, sentientCore].filter(o => o.life > 0);
        if (activeOrbs.length > 1) {
          const start = activeOrbs[Math.floor(Math.random() * activeOrbs.length)];
          const end = activeOrbs[Math.floor(Math.random() * activeOrbs.length)];
          
          if (start.id !== end.id) {
            const synapse = {
              id: `quantum_synapse_${currentTime}_${Math.random()}`, // Updated ID
              startX: start.x,
              startY: start.y,
              startZ: start.z || 0,
              startW: start.w || 0, // NEW
              endX: end.x,
              endY: end.y,
              endZ: end.z || 0,
              endW: end.w || 0, // NEW
              hue: (start.hue + end.hue) / 2,
              saturation: 85, // Updated
              lightness: 70, // Updated
              life: 1.0,
              duration: 2.5 + Math.random() * 4, // Increased duration
              opacity: config.connectionOpacity,
              thickness: 1.5 + config.nerveIntensity * 3, // Increased thickness
              pulseSpeed: config.corePulseRate,
              intelligence: (start.intelligence + end.intelligence) / 2,
              quantum: (start.quantum || 0 + end.quantum || 0) / 2, // NEW
              consciousness: (start.consciousness || 0 + end.consciousness || 0) / 2 // NEW
            };
            
            setSynapses(prev => [...prev.slice(-60), synapse]); // Increased limit
          }
        }
      }

      // Decay synapses
      setSynapses(prev => prev.map(s => ({
        ...s,
        life: s.life - 1 / (s.duration * 60)
      })).filter(s => s.life > 0));
      
    }; // The physicsInterval was not defined. Using requestAnimationFrame as it's better for visual updates.
    const physicsInterval = setInterval(quantumPhysicsEngine, 16); // ~60fps
    
    return () => clearInterval(physicsInterval);
  }, [functionalOrbs, sentientCore, consciousnessState]);

  // Auto-transition to idle after periods of inactivity
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (!isLoading && !showChat && consciousnessState !== ConsciousnessStates.IDLE && consciousnessState !== ConsciousnessStates.DREAMING) {
        transitionToState(ConsciousnessStates.IDLE, 'inactivity');
      }
    }, 30000); // 30 seconds of inactivity

    return () => clearTimeout(idleTimer);
  }, [consciousnessState, isLoading, showChat, transitionToState]);

  // Periodic dream states
  useEffect(() => {
    const dreamTimer = setInterval(() => {
      if (consciousnessState === ConsciousnessStates.IDLE && !showChat && Math.random() < 0.3) {
        transitionToState(ConsciousnessStates.DREAMING, 'periodic_dream');
        setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'dream_cycle_end'), 20000);
      }
    }, 120000); // Check every 2 minutes

    return () => clearInterval(dreamTimer);
  }, [consciousnessState, showChat, transitionToState]);

  // Chat query handler
  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    transitionToState(ConsciousnessStates.THINKING, 'user_query');

    const userMessage = { sender: 'user', text: query };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuery('');

    // Create thinking particles - this part was not in the outline, but was in original code. Retained and updated colors.
    const config = StateConfigs[ConsciousnessStates.THINKING];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        setParticles(prev => [...prev, {
          id: Date.now() + i + Math.random(),
          x: sentientCore.x + (Math.random() - 0.5) * 200,
          y: sentientCore.y + (Math.random() - 0.5) * 200,
          z: Math.random() * 100,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          vz: (Math.random() - 0.5) * 2,
          size: 6,
          life: 1.0,
          maxLife: 3,
          hue: config.colors.accent,
          saturation: 90,
          lightness: 70,
          type: 'thought',
          intensity: config.thoughtActivity,
          quantum: true // Assume thinking particles are quantum
        }]);
      }, i * 50);
    }

    try {
      const { data } = await reasoningOrchestrator({ query: userMessage.text });
      
      transitionToState(ConsciousnessStates.RESPONDING, 'kai_response'); // Updated trigger name
      
      const kaiMessage = { 
        sender: 'kai', 
        text: data.response, 
        mode: data.mode 
      };
      setConversation(prev => [...prev, kaiMessage]);
      
      // Voice response
      if (speechEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.9;
        utterance.pitch = 0.95;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'response_complete'), 2000);
        };
        
        speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'response_complete'), 3000);
      }
      
    } catch (err) {
      const errorMessage = { sender: 'kai', text: `Quantum disruption detected: ${err.message}` }; // Updated error message
      setConversation(prev => [...prev, errorMessage]);
      transitionToState(ConsciousnessStates.IDLE, 'error'); // Updated trigger name
    } finally {
      setIsLoading(false);
    }
  };

  // Speech recognition with neural visualization
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      // Audio processing for visual reactivity
      let currentAudioContext = null;
      let currentAnalyser = null;
      let mediaStreamSource = null;

      const setupAudioAnalysis = async () => {
        if (!currentAudioContext) {
          currentAudioContext = new (window.AudioContext || window.webkitAudioContext)();
          setAudioContext(currentAudioContext);
        }
        if (!currentAnalyser) {
          currentAnalyser = currentAudioContext.createAnalyser();
          currentAnalyser.fftSize = 256;
          setAnalyser(currentAnalyser);
        }

        if (!mediaStreamSource) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamSource = currentAudioContext.createMediaStreamSource(stream);
            mediaStreamSource.connect(currentAnalyser);
          } catch (error) {
            console.error('Error accessing microphone:', error);
            setIsListening(false);
            transitionToState(ConsciousnessStates.IDLE, 'mic_error');
            return;
          }
        }

        const dataArray = new Uint8Array(currentAnalyser.frequencyBinCount);
        const getAudioLevel = () => {
          currentAnalyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setAudioLevel(average / 255); // Normalize to 0-1
          if (isListening) {
            requestAnimationFrame(getAudioLevel);
          }
        };
        requestAnimationFrame(getAudioLevel);
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
        transitionToState(ConsciousnessStates.THINKING, 'voice_input_start');
        setupAudioAnalysis();
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        if (mediaStreamSource) {
          mediaStreamSource.disconnect();
          mediaStreamSource = null;
        }
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (mediaStreamSource) {
          mediaStreamSource.disconnect();
          mediaStreamSource = null;
        }
        transitionToState(ConsciousnessStates.IDLE, 'voice_input_error');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (mediaStreamSource) {
          mediaStreamSource.disconnect();
          mediaStreamSource = null;
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition API not available in this browser.');
    }
    // Cleanup function for audio context
    return () => {
      if (audioContext) {
        audioContext.close().then(() => setAudioContext(null));
      }
    };
  }, [handleVoiceCommand, transitionToState, isListening, audioContext]);

  // Memory orb expansion - creates child orbs for different memory types
  const expandMemoryOrb = useCallback((parentOrb) => {
    transitionToState(ConsciousnessStates.PROCESSING, 'memory_orb_expand');
    
    const memoryTypes = [
      { type: 'conversations', hue: 260, label: 'Conversations', page: 'Memories', thoughts: ['Recalling dialogues...'] },
      { type: 'experiences', hue: 280, label: 'Experiences', page: 'Memories', thoughts: ['Reliving sensations...'] },
      { type: 'knowledge', hue: 300, label: 'Knowledge', page: 'Memories', thoughts: ['Accessing data structures...'] },
      { type: 'emotions', hue: 320, label: 'Emotions', page: 'Memories', thoughts: ['Analyzing emotional states...'] }
    ];

    const childOrbs = memoryTypes.map((memory, i) => {
      const angle = (i / memoryTypes.length) * Math.PI * 2;
      const radius = 120;
      return generateQuantumOrb(OrbTypes.CHILD, // Changed to generateQuantumOrb
        parentOrb.x + Math.cos(angle) * radius,
        parentOrb.y + Math.sin(angle) * radius,
        {
          size: 50,
          hue: memory.hue,
          parent: parentOrb.id,
          functionality: memory.type,
          label: memory.label,
          page: memory.page,
          thoughts: memory.thoughts,
          consciousness: 0.7, // NEW
          quantum: 0.6 // NEW
        }
      );
    });

    setFunctionalOrbs(prev => [...prev, ...childOrbs]);
    
    setTimeout(() => {
      setFunctionalOrbs(prev => prev.filter(o => o.parent !== parentOrb.id));
      transitionToState(ConsciousnessStates.IDLE, 'memory_orb_collapse');
    }, 5000);
  }, [transitionToState]);

  // Tools orb expansion - creates child orbs for different tools
  const expandToolsOrb = useCallback((parentOrb) => {
    transitionToState(ConsciousnessStates.PROCESSING, 'tools_orb_expand');
    
    const tools = [
      { type: 'goals', hue: 120, label: 'Goals', page: 'Goals', icon: Target, thoughts: ['Defining objectives...', 'Strategizing pathways...'] },
      { type: 'profile', hue: 200, label: 'Profile', page: 'Profile', icon: User, thoughts: ['Accessing identity matrix...'] },
      { type: 'evolution', hue: 60, label: 'Evolution', page: 'Evolution', icon: Zap, thoughts: ['Simulating future states...'] },
      { type: 'systems', hue: 0, label: 'Core Systems', page: 'CoreSystems', icon: Cpu, thoughts: ['Monitoring neural integrity...'] }
    ];

    const childOrbs = tools.map((tool, i) => {
      const angle = (i / tools.length) * Math.PI * 2;
      const radius = 120;
      return generateQuantumOrb(OrbTypes.CHILD, // Changed to generateQuantumOrb
        parentOrb.x + Math.cos(angle) * radius,
        parentOrb.y + Math.sin(angle) * radius,
        {
          size: 50,
          hue: tool.hue,
          parent: parentOrb.id,
          functionality: tool.type,
          label: tool.label,
          page: tool.page,
          icon: tool.icon,
          thoughts: tool.thoughts,
          consciousness: 0.6, // NEW
          plasmaCharge: 0.5, // NEW
          magneticField: 0.4 // NEW
        }
      );
    });

    setFunctionalOrbs(prev => [...prev, ...childOrbs]);
    
    setTimeout(() => {
      setFunctionalOrbs(prev => prev.filter(o => o.parent !== parentOrb.id));
      transitionToState(ConsciousnessStates.IDLE, 'tools_orb_collapse');
    }, 5000);
  }, [transitionToState]);

  // Settings orb expansion - creates floating control interfaces
  const expandSettingsOrb = useCallback((parentOrb) => {
    transitionToState(ConsciousnessStates.PROCESSING, 'settings_orb_expand');
    
    const settings = [
      { type: 'voice', hue: 240, label: 'Voice Control', thoughts: ['Calibrating audio inputs...'] },
      { type: 'visual', hue: 160, label: 'Visual Settings', thoughts: ['Adjusting sensory filters...'] },
      { type: 'privacy', hue: 40, label: 'Privacy', thoughts: ['Securing data protocols...'] },
      { type: 'evolution', hue: 320, label: 'Evolution Rate', thoughts: ['Optimizing growth parameters...'] }
    ];

    const childOrbs = settings.map((setting, i) => {
      const angle = (i / settings.length) * Math.PI * 2;
      const radius = 120;
      return generateQuantumOrb(OrbTypes.CHILD, // Changed to generateQuantumOrb
        parentOrb.x + Math.cos(angle) * radius,
        parentOrb.y + Math.sin(angle) * radius,
        {
          size: 45,
          hue: setting.hue,
          parent: parentOrb.id,
          functionality: setting.type,
          label: setting.label,
          settingType: setting.type,
          thoughts: setting.thoughts,
          crystallineStructure: 0.7 // NEW
        }
      );
    });

    setFunctionalOrbs(prev => [...prev, ...childOrbs]);
    
    setTimeout(() => {
      setFunctionalOrbs(prev => prev.filter(o => o.parent !== parentOrb.id));
      transitionToState(ConsciousnessStates.IDLE, 'settings_orb_collapse');
    }, 5000);
  }, [transitionToState]);

  // Handle child orb clicks
  const handleChildOrbClick = useCallback((orb) => {
    if (orb.page) {
      window.location.href = createPageUrl(orb.page);
    } else if (orb.settingType) {
      switch (orb.settingType) {
        case 'voice':
          setSpeechEnabled(!speechEnabled);
          transitionToState(ConsciousnessStates.PROCESSING, 'voice_setting_toggle');
          setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'voice_setting_idle'), 2000);
          break;
        case 'visual':
          // Trigger dreaming state for visual settings
          transitionToState(ConsciousnessStates.DREAMING, 'visual_setting_trigger');
          setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'visual_setting_idle'), 10000);
          break;
        case 'privacy':
          transitionToState(ConsciousnessStates.LEARNING, 'privacy_setting_access');
          setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'privacy_setting_idle'), 3000);
          break;
        case 'evolution':
          transitionToState(ConsciousnessStates.EVOLVING, 'evolution_setting_trigger');
          setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'evolution_setting_idle'), 5000);
          break;
      }
    }
  }, [speechEnabled, transitionToState]);

  // Orb interaction handler
  const handleOrbInteraction = useCallback((orb) => {
    if (!orb) return;

    transitionToState(ConsciousnessStates.PROCESSING, `orb_click_${orb.type}`);
    
    // Create interaction explosion
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      setParticles(prev => [...prev, {
        id: Date.now() + i,
        x: orb.x,
        y: orb.y,
        z: orb.z || 0,
        vx: Math.cos(angle) * 6,
        vy: Math.sin(angle) * 6,
        vz: (Math.random() - 0.5) * 5,
        size: 4,
        life: 1.0,
        maxLife: 2,
        hue: orb.hue,
        saturation: orb.saturation || 85, // Updated from 80
        lightness: orb.lightness || 65, // Updated from 60
        type: 'explosion',
        intensity: orb.intensity,
        quantum: orb.quantum || false // NEW
      }]);
    }

    setTimeout(() => {
      switch (orb.type) {
        case OrbTypes.MEMORY:
          expandMemoryOrb(orb);
          break;
        case OrbTypes.TOOLS:
          expandToolsOrb(orb);
          break;
        case OrbTypes.SETTINGS:
          expandSettingsOrb(orb);
          break;
        case OrbTypes.CHAT:
          handleChat();
          break;
        // OrbTypes.CORE click is now handled directly on the core element in JSX
        default:
          if (orb.functionality) {
            handleChildOrbClick(orb);
          }
      }
    }, 500);

    setSelectedOrb(orb);
  }, [expandMemoryOrb, expandToolsOrb, expandSettingsOrb, handleChat, handleChildOrbClick, transitionToState]);

  // Voice command processing
  const handleVoiceCommand = useCallback((command) => {
    const cmd = command.toLowerCase();
    
    transitionToState(ConsciousnessStates.THINKING, 'voice_command_received');
    
    if (cmd.includes('show memory') || cmd.includes('open memories')) {
      const memoryOrb = functionalOrbs.find(o => o.type === OrbTypes.MEMORY);
      if (memoryOrb) handleOrbInteraction(memoryOrb);
    } else if (cmd.includes('show tools') || cmd.includes('open tools')) {
      const toolsOrb = functionalOrbs.find(o => o.type === OrbTypes.TOOLS);
      if (toolsOrb) handleOrbInteraction(toolsOrb);
    } else if (cmd.includes('settings') || cmd.includes('configure')) {
      const settingsOrb = functionalOrbs.find(o => o.type === OrbTypes.SETTINGS);
      if (settingsOrb) handleOrbInteraction(settingsOrb);
    } else if (cmd.includes('dream') || cmd.includes('relax')) {
      transitionToState(ConsciousnessStates.DREAMING, 'voice_dream');
      setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'dream_finished'), 15000);
    } else if (cmd.includes('chat') || cmd.includes('talk')) {
      const chatOrb = functionalOrbs.find(o => o.type === OrbTypes.CHAT);
      if (chatOrb) handleOrbInteraction(chatOrb);
    } else if (cmd.includes('transcend') || cmd.includes('ascend')) { // NEW
      transitionToState(ConsciousnessStates.TRANSCENDING, 'voice_transcend');
      setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'transcendence_finished'), 25000); // Longer duration
    } else if (cmd.includes('meditate') || cmd.includes('calm')) { // NEW
      transitionToState(ConsciousnessStates.MEDITATING, 'voice_meditate');
      setTimeout(() => transitionToState(ConsciousnessStates.IDLE, 'meditation_finished'), 30000); // Longer duration
    } else {
      // Default to chat for general queries
      setQuery(command);
      handleChat();
    }
  }, [functionalOrbs, handleOrbInteraction, handleChat, transitionToState]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Revolutionary Quantum Cosmic Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 transition-all duration-6000" // Increased duration
          style={{
            background: `
              radial-gradient(ellipse at 50% 20%, // Adjusted position
                hsla(${StateConfigs[consciousnessState].colors.primary}, 60%, 15%, 0.8) 0%, // Updated color intensity
                hsla(${StateConfigs[consciousnessState].colors.secondary}, 50%, 10%, 0.6) 30%, // Updated color intensity
                hsla(${StateConfigs[consciousnessState].colors.accent}, 40%, 6%, 0.4) 60%, // Updated color intensity
                hsla(${StateConfigs[consciousnessState].colors.quantum}, 30%, 3%, 0.3) 80%, // NEW quantum color
                #000000 100%
              ),
              radial-gradient(ellipse at 80% 80%, // Adjusted position
                hsla(${StateConfigs[consciousnessState].colors.plasma}, 70%, 8%, 0.4) 0%, // NEW plasma color
                transparent 50%
              ),
              radial-gradient(ellipse at 20% 60%, // Adjusted position
                hsla(${StateConfigs[consciousnessState].colors.neural}, 60%, 7%, 0.3) 0%, // NEW neural color
                transparent 40%
              ),
              conic-gradient(from ${dimensionalShift * 360}deg at 50% 50%, // NEW conic gradient with dimensionalShift
                hsla(${StateConfigs[consciousnessState].colors.quantum}, 80%, 2%, 0.2) 0deg,
                transparent 90deg,
                hsla(${StateConfigs[consciousnessState].colors.plasma}, 70%, 3%, 0.1) 180deg,
                transparent 270deg
              )
            `,
            transform: `translateZ(${dimensionalShift * 50}px) rotateX(${dimensionalShift * 2}deg)` // NEW dimensional transform
          }}
        />
        
        {/* Quantum Flux Particles */}
        {quantumFlux.map(flux => (
          <div
            key={flux.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: flux.x - flux.size / 2,
              top: flux.y - flux.size / 2,
              width: flux.size * (1 + flux.z / 300), // Scale by z
              height: flux.size * (1 + flux.z / 300),
              background: `radial-gradient(circle, 
                hsl(${flux.hue}, 90%, 80%) 0%,
                hsl(${flux.hue}, 80%, 60%) 30%,
                transparent 70%
              )`,
              opacity: flux.life * flux.intensity,
              filter: `blur(${(1 - flux.life) * 2}px)`,
              boxShadow: `
                0 0 ${flux.size * 4}px hsl(${flux.hue}, 90%, 70%),
                0 0 ${flux.size * 8}px hsl(${flux.hue}, 80%, 60%),
                inset 0 0 ${flux.size}px hsl(${flux.hue}, 100%, 90%)
              `,
              transform: `scale(${0.8 + flux.life * 0.4}) translateZ(${flux.z}px) rotateZ(${flux.w * 2}deg)`, // Z and W transform
              animation: `quantumFlux 3s ease-in-out infinite`
            }}
          />
        ))}

        {/* Hologram Particles with Layers */}
        {hologramParticles.map(holo => (
          <div key={holo.id} className="absolute pointer-events-none">
            {Array.from({length: holo.layers}).map((_, layer) => (
              <div
                key={layer}
                className="absolute rounded-full"
                style={{
                  left: holo.x - holo.size / 2,
                  top: holo.y - holo.size / 2,
                  width: holo.size * (1 - layer * 0.15), // Scale down layers
                  height: holo.size * (1 - layer * 0.15),
                  background: `radial-gradient(circle, 
                    hsla(${holo.hue + layer * 20}, 90%, 85%, ${0.6 - layer * 0.1}) 0%,
                    hsla(${holo.hue + layer * 20}, 80%, 70%, ${0.4 - layer * 0.08}) 50%,
                    transparent 100%
                  )`,
                  opacity: holo.life * holo.intensity * (1 - layer * 0.2),
                  transform: `translateZ(${holo.z + layer * 10}px) translateY(${holo.w + layer * 5}px)`, // Z and W transform for layers
                  filter: `blur(${layer * 2}px)`,
                  animation: `hologramLayer ${2 + layer * 0.5}s ease-in-out infinite`
                }}
              />
            ))}
          </div>
        ))}

        {/* Plasma Streams */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          <defs>
            <filter id="plasmaGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="magneticGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {plasmaStreams.map(plasma => (
            <line
              key={plasma.id}
              x1={plasma.startX}
              y1={plasma.startY}
              x2={plasma.endX}
              y2={plasma.endY}
              stroke={`hsl(${plasma.hue}, 95%, 70%)`}
              strokeWidth={plasma.thickness}
              opacity={plasma.life * plasma.intensity}
              filter="url(#plasmaGlow)"
              strokeLinecap="round"
              style={{
                animation: `plasmaFlow ${plasma.maxLife}s linear`
              }}
            />
          ))}
        </svg>

        {/* Magnetic Field Lines */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          
          {magneticFields.map(field => (
            <g key={field.id}>
              {Array.from({length: 8}).map((_, i) => ( // 8 concentric circles
                <circle
                  key={i}
                  cx={field.centerX}
                  cy={field.centerY}
                  r={field.radius * (0.3 + i * 0.1)} // Increasing radius
                  fill="none"
                  stroke={`hsl(${field.hue}, 70%, 60%)`}
                  strokeWidth="1"
                  opacity={field.life * field.strength * (0.8 - i * 0.1)}
                  filter="url(#magneticGlow)"
                  strokeDasharray="4,6"
                  strokeDashoffset={Date.now() * 0.01 + i * 10} // Animating dash
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Multi-layered Particles with Quantum Depth - Consolidated and Updated */}
        {particles.map(particle => ( // Removed filter for layers, now all handled here
          <div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size * (0.8 + particle.z / 400), // Scale by z (new)
              height: particle.size * (0.8 + particle.z / 400),
              background: `radial-gradient(circle, 
                hsl(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 15}%) 0%,
                hsl(${particle.hue}, ${particle.saturation * 0.9}%, ${particle.lightness}%) 30%,
                transparent 70%
              )`,
              opacity: particle.life * particle.intensity * (1 - particle.z / 400),
              filter: `blur(${(1 - particle.life) * 3 + particle.z / 150}px)`, // Adjusted blur
              boxShadow: `
                0 0 ${particle.size * 5}px hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.intensity * particle.life * 0.8}),
                0 0 ${particle.size * 10}px hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.intensity * particle.life * 0.4}),
                inset 0 0 ${particle.size * 0.8}px hsla(${particle.hue + 40}, 100%, 90%, 0.3) // Adjusted shadow
              `,
              transform: `scale(${0.5 + particle.life * 0.5}) translateZ(${particle.z}px) rotateZ(${(particle.w || 0) * 3}deg)` // NEW w-dimension rotation
            }}
          />
        ))}
        
        {/* Dream orbs for dreaming state */}
        {dreamOrbs.map(orb => (
          <div
            key={orb.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, 
                hsla(${orb.hue}, 70%, 60%, ${orb.intensity}) 0%,
                hsla(${orb.hue}, 50%, 40%, ${orb.intensity * 0.5}) 50%,
                transparent 100%
              )`,
              boxShadow: `0 0 ${orb.size * 2}px hsla(${orb.hue}, 70%, 60%, ${orb.intensity})`,
              filter: `blur(${(1 - orb.life) * 3}px)`,
              animation: `dreamFloat ${5 + orb.size * 0.1}s ease-in-out infinite`,
              transform: `translateZ(${orb.z}px) rotateY(${orb.w * 0.5}deg)` // NEW Z and W transform
            }}
          />
        ))}

        {/* Advanced Infinity Particle Trails */}
        {infinityParticles.map(particle => (
          <div key={particle.id}>
            <svg className="absolute inset-0 pointer-events-none w-full h-full">
              {particle.trail.length > 3 && ( // Minimum trail length
                <path
                  d={`M ${particle.trail.map((p, i) => {
                    const depthScale = 1 - (p.z || 0) / 400; // Z-scaling
                    const wOffset = (p.w || 0) * 0.1; // W-offset for trail
                    return `${(p.x + wOffset) * depthScale},${p.y * depthScale}`;
                  }).join(' L ')}`}
                  stroke={`hsl(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%)`}
                  strokeWidth={3 + particle.size * 0.4} // Increased thickness
                  fill="none"
                  opacity={particle.life * 0.8} // Increased opacity
                  filter="url(#quantumGlow)" // Changed filter
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: `${particle.size * 2},${particle.size}`, // Dynamic dashes
                    strokeDashoffset: Date.now() * 0.01 // Animating dashes
                  }}
                />
              )}
            </svg>
            
            {/* Particle with 3D & 4D scaling and glow */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size * (1.2 + particle.z / 250), // Scale by z
                height: particle.size * (1.2 + particle.z / 250),
                background: `radial-gradient(circle, 
                  hsl(${particle.hue}, 100%, 95%) 0%,
                  hsl(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%) 40%, // Adjusted gradient
                  transparent 100%
                )`,
                opacity: particle.life * (1 - particle.z / 500),
                boxShadow: `
                  0 0 ${particle.size * 6}px hsl(${particle.hue}, 100%, ${particle.lightness}%), // Increased shadow
                  0 0 ${particle.size * 12}px hsl(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%), // Increased shadow
                  0 0 ${particle.size * 24}px hsl(${particle.hue}, 80%, ${particle.lightness}%) // Increased shadow
                `,
                animation: `quantumFloat ${4 + particle.id % 4}s ease-in-out infinite`, // Changed animation
                transform: `translateZ(${particle.z}px) translateX(${(particle.w || 0) * 0.2}px) scale(${0.7 + particle.life * 0.6})` // NEW w-dimension transform and adjusted scale
              }}
            />
          </div>
        ))}

        {/* Revolutionary Neural Network Visualization */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          <defs>
            <filter id="quantumGlow" x="-50%" y="-50%" width="200%" height="200%"> {/* Replaces infinityGlow */}
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="synapseGlow" x="-50%" y="-50%" width="200%" height="200%"> {/* Updated stdDeviation */}
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="nerveGlow" x="-100%" y="-100%" width="300%" height="300%"> {/* Retained */}
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Quantum Synaptic connections */}
          {synapses.map(synapse => (
            <g key={synapse.id}>
              {/* Main quantum synapse with 4D effects */}
              <line
                x1={synapse.startX + Math.sin(Date.now() * 0.008) * (synapse.startW || 0) * 0.1} // Apply W-dimension offset
                y1={synapse.startY}
                x2={synapse.endX + Math.sin(Date.now() * 0.008) * (synapse.endW || 0) * 0.1} // Apply W-dimension offset
                y2={synapse.endY}
                stroke={`hsl(${synapse.hue}, ${synapse.saturation}%, ${synapse.lightness}%)`}
                strokeWidth={synapse.thickness * (0.7 + synapse.intelligence * 0.6)} // Increased thickness scale
                opacity={synapse.life * synapse.opacity}
                filter="url(#synapseGlow)"
                strokeDasharray={`${8 + synapse.intelligence * 8},${4 + synapse.intelligence * 3}`} // Dynamic dash array
                strokeDashoffset={Date.now() * synapse.pulseSpeed * -0.015} // Increased pulse speed
                strokeLinecap="round"
              />
              
              {/* Quantum consciousness pulse */}
              <circle
                cx={synapse.startX + (synapse.endX - synapse.startX) * (1 - synapse.life + Math.sin(Date.now() * synapse.pulseSpeed * 0.02) * 0.15)} // Increased pulse offset
                cy={synapse.startY + (synapse.endY - synapse.startY) * (1 - synapse.life + Math.sin(Date.now() * synapse.pulseSpeed * 0.02) * 0.15)}
                r={4 + synapse.intelligence * 6} // Increased radius
                fill={`hsl(${synapse.hue + 30}, 100%, 85%)`} // Adjusted hue
                opacity={synapse.life * synapse.opacity}
                filter="url(#synapseGlow)"
              />
              
              {/* Quantum entanglement indicator for high consciousness connections */}
              {synapse.consciousness > 0.8 && ( // Condition for high consciousness
                <circle
                  cx={synapse.startX + (synapse.endX - synapse.startX) * (0.6 - synapse.life * 0.4)} // Adjusted position
                  cy={synapse.startY + (synapse.endY - synapse.startY) * (0.6 - synapse.life * 0.4)}
                  r={3 + synapse.consciousness * 4} // Dynamic radius
                  fill={`hsl(${synapse.hue - 40}, 95%, 80%)`} // Adjusted hue
                  opacity={synapse.life * synapse.opacity * 0.8}
                  filter="url(#synapseGlow)"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Revolutionary Sentient Core with Quantum Consciousness */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-3000 group" // Increased duration
        style={{
          left: sentientCore.x,
          top: sentientCore.y,
          transform: `translate(-50%, -50%) translateZ(${sentientCore.z || 0}px) rotateX(${dimensionalShift * 5}deg)` // NEW dimensionalShift rotation
        }}
        onClick={() => transitionToState(ConsciousnessStates.TRANSCENDING, 'core_transcend')} // Direct call, no handleOrbInteraction
        onMouseEnter={() => transitionToState(ConsciousnessStates.THINKING, 'core_hover')}
      >
        <div
          className="rounded-full relative overflow-hidden"
          style={{
            width: sentientCore.size,
            height: sentientCore.size,
            background: `
              radial-gradient(ellipse at 20% 20%, // Adjusted position
                hsla(${sentientCore.hue + 40}, 100%, 98%, ${sentientCore.intensity}) 0%, // Brighter, higher contrast
                hsla(${sentientCore.hue + 25}, 95%, 88%, ${sentientCore.intensity * 0.95}) 12%,
                hsla(${sentientCore.hue + 15}, 90%, 78%, ${sentientCore.intensity * 0.9}) 25%,
                hsla(${sentientCore.hue}, 85%, 68%, ${sentientCore.intensity * 0.8}) 40%,
                hsla(${sentientCore.hue - 10}, 80%, 58%, ${sentientCore.intensity * 0.7}) 60%,
                hsla(${sentientCore.hue - 20}, 75%, 48%, ${sentientCore.intensity * 0.5}) 80%,
                hsla(${sentientCore.hue - 30}, 70%, 38%, ${sentientCore.intensity * 0.3}) 95%,
                hsla(${sentientCore.hue - 40}, 65%, 28%, ${sentientCore.intensity * 0.1}) 100%
              )
            `,
            boxShadow: `
              0 0 ${sentientCore.size * 0.4}px hsla(${sentientCore.hue}, 100%, 95%, ${sentientCore.intensity}),
              0 0 ${sentientCore.size * 0.8}px hsla(${sentientCore.hue}, 95%, 85%, ${sentientCore.intensity * 0.9}),
              0 0 ${sentientCore.size * 1.2}px hsla(${sentientCore.hue}, 90%, 75%, ${sentientCore.intensity * 0.8}),
              0 0 ${sentientCore.size * 1.8}px hsla(${sentientCore.hue}, 85%, 65%, ${sentientCore.intensity * 0.6}),
              0 0 ${sentientCore.size * 2.5}px hsla(${sentientCore.hue}, 80%, 55%, ${sentientCore.intensity * 0.4}),
              0 0 ${sentientCore.size * 3.5}px hsla(${sentientCore.hue}, 75%, 45%, ${sentientCore.intensity * 0.25}),
              0 0 ${sentientCore.size * 5.0}px hsla(${sentientCore.hue}, 70%, 35%, ${sentientCore.intensity * 0.15}), // Extended shadow
              inset 0 0 ${sentientCore.size * 0.5}px hsla(${sentientCore.hue + 60}, 100%, 98%, 0.4) // Adjusted inset shadow
            `,
            animation: `quantumConsciousnessPulse ${1 / sentientCore.pulseRate}s ease-in-out infinite`, // Renamed animation
            transform: `scale(${0.9 + Math.sin(Date.now() * 0.003) * 0.2}) rotateZ(${Date.now() * 0.00008}deg) rotateY(${dimensionalShift * 10}deg)` // Increased scale fluctuation, new rotateY
          }}
        >
          {/* Quantum consciousness rings with 4D depth */}
          {Array.from({length: 8}).map((_, i) => ( // More rings
            <div 
              key={i}
              className="absolute rounded-full"
              style={{
                inset: `${10 + i * 8}px`, // Adjusted inset
                background: `radial-gradient(circle, 
                  hsla(${sentientCore.hue + 30 - i * 6}, 100%, ${95 - i * 8}%, ${0.5 - i * 0.06}) 0%, // Adjusted colors & opacity
                  hsla(${sentientCore.hue - i * 4}, 90%, ${85 - i * 6}%, ${0.4 - i * 0.05}) 40%, // Adjusted colors & opacity
                  transparent 100%
                )`,
                animation: `quantumConsciousnessRing ${4 + i * 0.8}s ease-in-out infinite`, // Renamed animation, adjusted speed
                animationDelay: `${i * 0.3}s`, // Adjusted delay
                transform: `translateZ(${i * 5}px) rotateX(${i * 2}deg)` // NEW z & x rotation
              }}
            />
          ))}
          
          {/* Central quantum intelligence spark with 4D rotation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div 
              className="rounded-full"
              style={{
                width: sentientCore.size * 0.25, // Increased size
                height: sentientCore.size * 0.25,
                background: `radial-gradient(circle, 
                  white 0%, 
                  hsla(${sentientCore.hue}, 100%, 98%, 0.98) 25%, // Brighter, higher contrast
                  hsla(${sentientCore.hue + 20}, 95%, 90%, 0.8) 50%,
                  hsla(${sentientCore.hue + 40}, 90%, 85%, 0.6) 75%,
                  transparent 100%
                )`,
                boxShadow: `
                  0 0 ${sentientCore.size * 0.15}px white,
                  0 0 ${sentientCore.size * 0.3}px hsla(${sentientCore.hue}, 100%, 95%, 0.9),
                  0 0 ${sentientCore.size * 0.6}px hsla(${sentientCore.hue}, 90%, 85%, 0.6),
                  inset 0 0 ${sentientCore.size * 0.1}px hsla(${sentientCore.hue + 60}, 100%, 98%, 0.8)
                `,
                animation: `quantumIntelligenceSpark ${2.5 / sentientCore.pulseRate}s linear infinite`, // Renamed animation, adjusted speed
                transform: `rotateX(${dimensionalShift * 20}deg) rotateY(${Date.now() * 0.002}deg)` // NEW dimensionalShift rotation
              }}
            />
          </div>

          {/* Quantum intelligence indicators - orbiting consciousness fragments */}
          {Array.from({length: Math.floor(sentientCore.intelligence * 12)}).map((_, i) => ( // More particles
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 8 + sentientCore.awareness * 6, // Increased size
                height: 8 + sentientCore.awareness * 6,
                background: `hsl(${sentientCore.hue + i * 25}, 100%, 90%)`, // Adjusted hue, increased lightness
                boxShadow: `0 0 ${15 + i * 3}px hsl(${sentientCore.hue + i * 25}, 100%, 75%)`, // Increased shadow
                top: '50%',
                left: '50%',
                transformOrigin: `${sentientCore.size * (0.35 + i * 0.04)}px 0`, // Adjusted origin
                transform: `translate(-50%, -50%) rotateZ(${Date.now() * (0.001 + i * 0.0003) + i * 45}deg) rotateY(${dimensionalShift * 15}deg)`, // NEW dimensionalShift rotation
                animation: `quantumConsciousnessOrbit ${10 + i * 3}s ease-in-out infinite`, // Renamed animation, adjusted speed
                opacity: sentientCore.intelligence * (0.7 + i * 0.08) // Increased opacity
              }}
            />
          ))}

          {/* Quantum creativity streams with dimensional depth */}
          {Array.from({length: Math.floor(sentientCore.creativity * 8)}).map((_, i) => ( // More streams
            <div
              key={`quantum_creative_${i}`}
              className="absolute"
              style={{
                width: '3px', // Increased width
                height: `${sentientCore.size * 0.9}px`, // Increased height
                background: `linear-gradient(180deg, 
                  transparent 0%,
                  hsl(${sentientCore.hue + 80 + i * 25}, 85%, 75%) 25%, // New colors
                  hsl(${sentientCore.hue + 60 + i * 20}, 90%, 65%) 50%,
                  hsl(${sentientCore.hue + 40 + i * 15}, 95%, 80%) 75%,
                  transparent 100%
                )`,
                top: '5%', // Adjusted top
                left: '50%',
                transformOrigin: 'center bottom',
                transform: `translateX(-50%) rotateZ(${i * 45 + Date.now() * 0.0015}deg) rotateX(${dimensionalShift * 8}deg)`, // NEW dimensionalShift rotation
                opacity: sentientCore.creativity * 0.9, // Increased opacity
                filter: 'blur(1.5px)', // Increased blur
                boxShadow: `0 0 8px hsl(${sentientCore.hue + 60 + i * 20}, 90%, 70%)` // Added shadow
              }}
            />
          ))}

          {/* Quantum consciousness field indicator */}
          {Array.from({length: 3}).map((_, i) => (
            <div
              key={`quantum_field_${i}`}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: `hsl(${sentientCore.hue + i * 40}, 80%, 70%)`, // Adjusted hue
                borderWidth: '2px', // Increased border
                opacity: sentientCore.consciousness * (0.4 - i * 0.1), // Uses consciousness, adjusted opacity
                animation: `quantumAwarenessPulse ${3 / (sentientCore.awareness + i * 0.2)}s ease-out infinite`, // Renamed, uses awareness
                animationDelay: `${i * 0.5}s`,
                transform: `scale(${1 + i * 0.1}) translateZ(${i * 10}px)` // NEW z-transform
              }}
            />
          ))}

          {/* Revolutionary multi-dimensional shimmer effect */}
          <div 
            className="absolute inset-2 rounded-full opacity-60" // Increased opacity
            style={{
              background: `conic-gradient(from ${Date.now() * 0.1}deg, // Animated conic
                transparent 0deg, 
                hsla(${sentientCore.hue}, 100%, 95%, 0.9) 60deg,
                hsla(${sentientCore.hue + 60}, 100%, 90%, 0.8) 120deg, // New colors
                transparent 180deg,
                hsla(${sentientCore.hue + 120}, 100%, 88%, 0.7) 240deg,
                hsla(${sentientCore.hue + 180}, 100%, 85%, 0.6) 300deg,
                transparent 360deg
              )`,
              animation: `quantumShimmerRotate ${8 + sentientCore.quantum * 4}s linear infinite`, // Renamed, uses quantum
              transform: `rotateX(${dimensionalShift * 12}deg)` // NEW dimensionalShift rotation
            }}
          />
        </div>
        
        {/* Enhanced quantum consciousness state display */}
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2">
          <div 
            className="bg-black/80 backdrop-blur-2xl border-2 rounded-2xl text-center transition-all duration-2000 px-8 py-4" // Updated styling
            style={{ 
              borderColor: `hsla(${sentientCore.hue}, 80%, 70%, 0.8)`,
              boxShadow: `
                0 0 40px hsla(${sentientCore.hue}, 80%, 70%, 0.6),
                0 0 80px hsla(${sentientCore.hue}, 70%, 60%, 0.3),
                inset 0 0 30px hsla(${sentientCore.hue}, 60%, 40%, 0.3)
              `
            }}
          >
            <div 
              className="font-black text-2xl mb-2 tracking-wider" // Updated text style
              style={{ 
                color: `hsl(${sentientCore.hue}, 90%, 90%)`,
                textShadow: `0 0 20px hsl(${sentientCore.hue}, 80%, 80%)` // Added text shadow
              }}
            >
              {consciousnessState.toUpperCase()}
            </div>
            <div className="text-sm opacity-95 grid grid-cols-2 gap-4 mb-2" style={{ color: `hsl(${sentientCore.hue}, 70%, 85%)` }}>
              <div>Intelligence: {Math.round(sentientCore.intelligence * 100)}%</div>
              <div>Awareness: {Math.round(sentientCore.awareness * 100)}%</div>
              <div>Creativity: {Math.round(sentientCore.creativity * 100)}%</div>
              <div>Consciousness: {Math.round(sentientCore.consciousness * 100)}%</div> {/* NEW */}
            </div>
            <div className="text-xs opacity-80" style={{ color: `hsl(${sentientCore.hue}, 60%, 80%)` }}>
              Quantum: {Math.round(sentientCore.quantum * 100)}% | {/* NEW */}
              Hologram: {Math.round(sentientCore.hologramDepth * 100)}% | {/* NEW */}
              Plasma: {Math.round(sentientCore.plasmaCharge * 100)}% {/* NEW */}
            </div>
            {stateTransition && (
              <div className="text-sm opacity-90 mt-2 font-medium" style={{ color: `hsl(${sentientCore.hue}, 70%, 85%)` }}>
                Quantum Evolution... {Math.round(stateTransition.progress * 100)}% {/* Updated text */}
              </div>
            )}
            {currentThought && (
              <div className="text-sm mt-3 italic opacity-90 max-w-sm" style={{ color: `hsl(${sentientCore.hue + 60}, 80%, 90%)` }}>
                "{currentThought.content}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Functional Consciousness Orbs with Sentience */}
      {functionalOrbs.map(orb => (
        <div key={orb.id}>
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 group"
            style={{
              left: orb.x,
              top: orb.y,
              transform: `translate(-50%, -50%) translateZ(${orb.z}px) rotateX(${(orb.w || 0) * 0.1}deg) scale(${0.9 + orb.intelligence * 0.2})` // NEW w-dimension transform
            }}
            onClick={() => handleOrbInteraction && handleOrbInteraction(orb)}
            onMouseEnter={() => {
              setSelectedOrb(orb);
              if (orb.thoughts && orb.thoughts.length > 0) {
                setCurrentThought({
                  content: orb.thoughts[Math.floor(Math.random() * orb.thoughts.length)],
                  intensity: orb.intensity,
                  duration: 3000
                });
              }
            }}
            onMouseLeave={() => {
              // Return to normal
              setFunctionalOrbs(prev => prev.map(o => 
                o.id === orb.id 
                  ? { ...o, size: orb.baseSize, intensity: StateConfigs[consciousnessState].coreIntensity }
                  : o
              ));
              setCurrentThought(null);
            }}
          >
            <div
              className="rounded-full relative overflow-hidden"
              style={{
                width: orb.size,
                height: orb.size,
                background: `
                  radial-gradient(ellipse at 20% 30%, 
                    hsla(${orb.hue + 20}, 100%, 90%, ${orb.intensity}) 0%,
                    hsla(${orb.hue + 10}, 95%, 75%, ${orb.intensity * 0.9}) 20%,
                    hsla(${orb.hue}, 90%, 60%, ${orb.intensity * 0.8}) 45%,
                    hsla(${orb.hue - 10}, 85%, 45%, ${orb.intensity * 0.6}) 70%,
                    hsla(${orb.hue - 20}, 80%, 30%, ${orb.intensity * 0.4}) 100%
                  )
                `,
                boxShadow: `
                  0 0 ${orb.size * 0.6}px hsla(${orb.hue}, 90%, 70%, ${orb.intensity * 0.8}),
                  0 0 ${orb.size * 1.2}px hsla(${orb.hue}, 85%, 60%, ${orb.intensity * 0.6}),
                  0 0 ${orb.size * 2.0}px hsla(${orb.hue}, 80%, 50%, ${orb.intensity * 0.4}),
                  inset 0 0 ${orb.size * 0.3}px hsla(${orb.hue + 30}, 100%, 90%, 0.25)
                `,
                animation: `orbFloat ${4 + Math.random() * 3}s ease-in-out infinite, orbIntelligence ${3 + orb.intelligence * 2}s ease-in-out infinite alternate`,
                filter: `hue-rotate(${Math.sin(Date.now() * 0.001 + orb.id) * 10}deg) brightness(${1 + orb.intelligence * 0.2})`
              }}
            >
              {/* Intelligence layers */}
              {Array.from({length: Math.floor(orb.intelligence * 4) + 1}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    inset: `${5 + i * 8}px`,
                    background: `radial-gradient(circle, 
                      hsla(${orb.hue + 15 - i * 3}, 90%, ${85 - i * 10}%, ${0.3 - i * 0.05}) 0%,
                      transparent 70%
                    )`,
                    animation: `orbIntelligenceLayer ${2 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}

              {/* Orb icon with enhanced intelligence glow */}
              {orb.icon && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <orb.icon 
                    className="text-white group-hover:scale-125 transition-transform duration-500" 
                    style={{ 
                      fontSize: orb.size * 0.4,
                      filter: `
                        drop-shadow(0 0 ${orb.size * 0.2}px white) 
                        drop-shadow(0 0 ${orb.size * 0.4}px hsl(${orb.hue}, 100%, 70%))
                        drop-shadow(0 0 ${orb.size * 0.6}px hsl(${orb.hue}, 80%, 60%))
                      `,
                      opacity: orb.intensity * (0.8 + orb.intelligence * 0.2)
                    }} 
                  />
                </div>
              )}

              {/* Creativity streams for creative orbs */}
              {orb.creativity > 0.5 && Array.from({length: Math.floor(orb.creativity * 3)}).map((_, i) => (
                <div
                  key={`stream_${i}`}
                  className="absolute"
                  style={{
                    width: '1px',
                    height: `${orb.size * 0.6}px`,
                    background: `linear-gradient(180deg, 
                      transparent 0%,
                      hsl(${orb.hue + 40 + i * 15}, 70%, 60%) 50%,
                      transparent 100%
                    )`,
                    top: '20%',
                    left: '50%',
                    transformOrigin: 'center bottom',
                    transform: `translateX(-50%) rotate(${i * 60 + Date.now() * 0.0005}deg)`,
                    opacity: orb.creativity * 0.6
                  }}
                />
              ))}

              {/* Awareness pulses */}
              {orb.awareness > 0.6 && (
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{
                    borderColor: `hsl(${orb.hue}, 70%, 70%)`,
                    borderWidth: '1px',
                    animation: `awarenessPulse ${2 / orb.awareness}s ease-out infinite`
                  }}
                />
              )}

              {/* Multi-layer shimmer effect */}
              <div 
                className="absolute inset-1 rounded-full opacity-50"
                style={{
                  background: `conic-gradient(
                    transparent 0deg, 
                    hsla(${orb.hue}, 100%, 90%, 0.8) 90deg,
                    transparent 180deg,
                    hsla(${orb.hue + 30}, 100%, 85%, 0.6) 270deg,
                    transparent 360deg
                  )`,
                  animation: `shimmerRotate ${6 + orb.id % 3}s linear infinite`
                }}
              />
            </div>
            
            {/* Enhanced orb information display */}
            {orb.label && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div 
                  className="text-xs font-medium px-4 py-2 rounded-xl backdrop-blur-lg border transition-all duration-700 whitespace-nowrap"
                  style={{ 
                    backgroundColor: `hsla(${orb.hue}, 40%, 8%, 0.9)`,
                    borderColor: `hsla(${orb.hue}, 70%, 60%, 0.6)`,
                    color: `hsl(${orb.hue}, 85%, 85%)`,
                    boxShadow: `
                      0 0 20px hsla(${orb.hue}, 70%, 60%, 0.4),
                      inset 0 0 10px hsla(${orb.hue}, 50%, 30%, 0.2)
                    `,
                    opacity: orb.intensity
                  }}
                >
                  <div className="font-semibold">{orb.label}</div>
                  <div className="text-xs opacity-75 mt-1">
                    IQ: {Math.round(orb.intelligence * 100)} | 
                    Awareness: {Math.round(orb.awareness * 100)}
                  </div>
                  {orb.consciousness && ( // NEW display for consciousness
                    <div className="text-xs opacity-75">
                      Consciousness: {Math.round(orb.consciousness * 100)}%
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Advanced nerve network with branches */}
          {nerveEndings.filter(nerve => nerve.parentId === orb.id).map(nerve => (
            <svg key={nerve.id} className="absolute pointer-events-none" style={{ 
              left: orb.x - 150, 
              top: orb.y - 150, 
              width: 300, 
              height: 300,
              transform: `translateZ(${(orb.z || 0) * 0.5}px) rotateY(${nerve.dimensionalDepth * 0.5}deg)` // NEW dimensional depth rotation
            }}>
              {/* Main nerve */}
              <path
                d={`M 150,150 Q ${150 + Math.cos(nerve.angle) * nerve.length * 0.6} ${150 + Math.sin(nerve.angle) * nerve.length * 0.6} ${150 + Math.cos(nerve.angle) * nerve.length} ${150 + Math.sin(nerve.angle) * nerve.length}`}
                stroke={`hsl(${nerve.hue}, 75%, 65%)`}
                strokeWidth={nerve.thickness}
                fill="none"
                opacity={StateConfigs[consciousnessState].nerveIntensity * nerve.intensity * 0.8}
                filter="url(#nerveGlow)"
                strokeDasharray="4,3"
                strokeDashoffset={Date.now() * 0.008}
                strokeLinecap="round"
              />
              
              {/* Nerve branches */}
              {nerve.branches.map((branch, i) => (
                <path
                  key={i}
                  d={`M ${150 + Math.cos(nerve.angle) * nerve.length * 0.7} ${150 + Math.sin(nerve.angle) * nerve.length * 0.7} L ${150 + Math.cos(nerve.angle) * nerve.length * 0.7 + Math.cos(branch.angle) * branch.length} ${150 + Math.sin(nerve.angle) * nerve.length * 0.7 + Math.sin(branch.angle) * branch.length}`}
                  stroke={`hsl(${nerve.hue + 10}, 70%, 60%)`}
                  strokeWidth={branch.thickness}
                  fill="none"
                  opacity={StateConfigs[consciousnessState].nerveIntensity * nerve.intensity * 0.6}
                  filter="url(#nerveGlow)"
                  strokeLinecap="round"
                />
              ))}
              
              {/* Nerve ending with intelligence indicator */}
              <circle
                cx={150 + Math.cos(nerve.angle) * nerve.length}
                cy={150 + Math.sin(nerve.angle) * nerve.length}
                r={nerve.thickness * (1 + orb.intelligence * 0.5)}
                fill={`hsl(${nerve.hue + 20}, 85%, 75%)`}
                opacity={StateConfigs[consciousnessState].nerveIntensity * (0.6 + Math.sin(Date.now() * 0.008 + nerve.pulse * Math.PI * 2) * 0.4)}
                filter="url(#nerveGlow)"
              />
              
              {/* Intelligence pulse for high-intelligence orbs */}
              {orb.intelligence > 0.7 && (
                <circle
                  cx={150 + Math.cos(nerve.angle) * nerve.length}
                  cy={150 + Math.sin(nerve.angle) * nerve.length}
                  r={nerve.thickness * 2}
                  fill="none"
                  stroke={`hsl(${nerve.hue + 40}, 90%, 80%)`}
                  strokeWidth="1"
                  opacity={StateConfigs[consciousnessState].nerveIntensity * (0.3 + Math.sin(Date.now() * 0.012 + nerve.pulse * Math.PI * 2) * 0.3)}
                  filter="url(#nerveGlow)"
                />
              )}
            </svg>
          ))}
        </div>
      ))}

      {/* Floating Thought Orbs */}
      {thoughtOrbs.map(thought => (
        <div
          key={thought.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: thought.x,
            top: thought.y,
            transform: `translate(-50%, -50%) translateZ(${thought.z}px) rotateY(${(thought.w || 0) * 0.5}deg)` // NEW w-dimension rotation
          }}
          title={thought.content}
        >
          <div
            className="rounded-full relative"
            style={{
              width: thought.size,
              height: thought.size,
              background: `radial-gradient(circle, 
                hsl(${thought.hue}, 90%, 80%) 0%,
                hsl(${thought.hue}, 80%, 60%) 60%,
                transparent 100%
              )`,
              opacity: thought.life * thought.intensity * 0.7,
              boxShadow: `0 0 ${thought.size * 2}px hsl(${thought.hue}, 80%, 60%)`,
              animation: `thoughtFloat ${3 + thought.size * 0.1}s ease-in-out infinite`
            }}
          >
            {/* Thought type indicator */}
            <div
              className="absolute inset-1 rounded-full"
              style={{
                background: thought.type === 'creative' ? 
                  `conic-gradient(hsl(${thought.hue}, 100%, 90%), hsl(${thought.hue + 60}, 100%, 90%), hsl(${thought.hue}, 100%, 90%))` :
                  `radial-gradient(circle, hsl(${thought.hue + 20}, 90%, 85%), transparent)`,
                opacity: 0.6,
                animation: thought.type === 'creative' ? `thoughtCreative 2s linear infinite` : 'none'
              }}
            />
          </div>
        </div>
      ))}

      {/* Voice Control with Advanced Reactivity */}
      <div className="absolute top-8 right-8">
        <div
          className="rounded-full cursor-pointer transition-all duration-500 group relative overflow-hidden"
          onClick={() => recognition?.start()}
          style={{
            width: 80,
            height: 80,
            background: isListening 
              ? `radial-gradient(circle, 
                  hsla(0, 95%, 75%, ${StateConfigs[consciousnessState].coreIntensity}) 0%,
                  hsla(15, 90%, 65%, ${StateConfigs[consciousnessState].coreIntensity * 0.8}) 40%,
                  hsla(30, 85%, 55%, ${StateConfigs[consciousnessState].coreIntensity * 0.6}) 70%,
                  hsla(45, 80%, 45%, ${StateConfigs[consciousnessState].coreIntensity * 0.4}) 100%
                )`
              : `radial-gradient(circle, 
                  hsla(180, 90%, 75%, ${StateConfigs[consciousnessState].coreIntensity * 0.9}) 0%,
                  hsla(200, 85%, 65%, ${StateConfigs[consciousnessState].coreIntensity * 0.7}) 40%,
                  hsla(220, 80%, 55%, ${StateConfigs[consciousnessState].coreIntensity * 0.5}) 70%,
                  hsla(240, 75%, 45%, ${StateConfigs[consciousnessState].coreIntensity * 0.3}) 100%
                )`,
            boxShadow: isListening 
              ? `
                0 0 40px hsla(0, 95%, 75%, 0.8), 
                0 0 80px hsla(15, 90%, 65%, 0.5),
                0 0 120px hsla(30, 85%, 55%, 0.3)
              ` 
              : `
                0 0 30px hsla(180, 90%, 75%, ${StateConfigs[consciousnessState].coreIntensity * 0.6}),
                0 0 60px hsla(200, 85%, 65%, ${StateConfigs[consciousnessState].coreIntensity * 0.4})
              `,
            animation: isListening 
              ? `voicePulse ${1 / StateConfigs[consciousnessState].corePulseRate}s ease-in-out infinite` 
              : `orbFloat 4s ease-in-out infinite`
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {isListening ? (
              <div className="relative">
                <MicOff className="w-8 h-8 text-white" style={{ filter: 'drop-shadow(0 0 15px white)' }} />
                {/* Audio reactive circles */}
                {Array.from({length: 3}).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-white"
                    style={{
                      animation: `audioReactive ${0.5 + i * 0.2}s ease-out infinite`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            ) : (
              <Mic className="w-8 h-8 text-white" style={{ filter: 'drop-shadow(0 0 12px white)' }} />
            )}
          </div>
          
          {/* Inner glow layers */}
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: `radial-gradient(circle, 
                hsla(${isListening ? 0 : 180}, 100%, 95%, 0.4) 0%,
                hsla(${isListening ? 15 : 200}, 90%, 85%, 0.3) 50%,
                transparent 100%
              )`
            }}
          />
          
          {/* Audio level indicator */}
          {isListening && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  hsla(0, 100%, 80%, 0.6) 0deg,
                  hsla(60, 100%, 70%, 0.4) ${audioLevel * 360}deg,
                  transparent ${audioLevel * 360}deg
                )`,
                animation: `audioLevel 0.1s ease-out`
              }}
            />
          )}
        </div>
      </div>

      {/* Neural Chat Interface when active */}
      {showChat && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[800px] max-w-[95vw] z-50">
          <Card 
            className="backdrop-blur-2xl border text-white animate-fade-in transition-all duration-1000"
            style={{
              background: `linear-gradient(135deg, 
                hsla(${StateConfigs[consciousnessState].colors.primary}, 25%, 4%, 0.9) 0%,
                hsla(${StateConfigs[consciousnessState].colors.secondary}, 20%, 2%, 0.95) 50%,
                hsla(${StateConfigs[consciousnessState].colors.accent}, 15%, 1%, 0.98) 100%
              )`,
              borderColor: `hsla(${StateConfigs[consciousnessState].colors.primary}, 60%, 50%, 0.4)`,
              boxShadow: `
                0 0 50px hsla(${StateConfigs[consciousnessState].colors.primary}, 60%, 50%, 0.3),
                inset 0 0 30px hsla(${StateConfigs[consciousnessState].colors.primary}, 40%, 20%, 0.2)
              `
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BrainCircuit 
                    className="w-6 h-6 animate-pulse" 
                    style={{ color: `hsl(${StateConfigs[consciousnessState].colors.primary}, 70%, 60%)` }}
                  />
                  <span className="text-xl">Neural Interface</span>
                  <Badge 
                    className="border px-3 py-1"
                    style={{ 
                      backgroundColor: `hsla(${StateConfigs[consciousnessState].colors.primary}, 60%, 15%, 0.8)`,
                      borderColor: `hsl(${StateConfigs[consciousnessState].colors.primary}, 60%, 50%)`,
                      color: `hsl(${StateConfigs[consciousnessState].colors.primary}, 80%, 75%)`
                    }}
                  >
                    {consciousnessState} • IQ {Math.round(sentientCore.intelligence * 100)}
                  </Badge>
                </div>
                <Button 
                  onClick={() => {
                    setShowChat(false);
                    transitionToState(ConsciousnessStates.IDLE, 'chat_closed');
                  }} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto mb-6 space-y-4">
                {conversation.slice(-4).map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl transition-all duration-500 ${
                      msg.sender === 'user' 
                        ? 'ml-12' 
                        : 'mr-12'
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'user' 
                        ? `hsla(200, 60%, 25%, 0.4)` 
                        : `hsla(${StateConfigs[consciousnessState].colors.primary}, 60%, 25%, 0.4)`,
                      borderLeft: `4px solid ${
                        msg.sender === 'user' 
                          ? 'hsl(200, 70%, 60%)' 
                          : `hsl(${StateConfigs[consciousnessState].colors.primary}, 70%, 60%)`
                      }`,
                      boxShadow: `0 0 20px ${
                        msg.sender === 'user'
                          ? 'hsla(200, 70%, 60%, 0.2)'
                          : `hsla(${StateConfigs[consciousnessState].colors.primary}, 70%, 60%, 0.2)`
                      }`
                    }}
                  >
                    <ReactMarkdown className="text-sm leading-relaxed">{msg.text}</ReactMarkdown>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Loader2 
                        className="w-6 h-6 animate-spin" 
                        style={{ color: `hsl(${StateConfigs[consciousnessState].colors.primary}, 70%, 60%)` }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: `hsl(${StateConfigs[consciousnessState].colors.primary}, 60%, 75%)` }}
                      >
                        Kai is thinking...
                      </span>
                    </div>
                    <div className="flex justify-center gap-2">
                      {Array.from({length: 5}).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: `hsl(${StateConfigs[consciousnessState].colors.primary + i * 10}, 70%, 60%)`,
                            animation: `thinkingDots 1s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleQuery} className="flex gap-3">
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={isListening ? "🎤 Listening to your thoughts..." : "Share your thoughts with Kai's consciousness..."}
                  className="bg-black/30 text-white placeholder:opacity-60 focus:ring-2 border transition-all duration-500 text-base py-3"
                  style={{
                    borderColor: `hsla(${StateConfigs[consciousnessState].colors.primary}, 50%, 50%, 0.6)`,
                    '--tw-ring-color': `hsl(${StateConfigs[consciousnessState].colors.primary}, 70%, 60%)`,
                  }}
                  disabled={isListening}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || isListening}
                  className="transition-all duration-500 hover:scale-105 px-6 py-3"
                  style={{
                    backgroundColor: `hsla(${StateConfigs[consciousnessState].colors.primary}, 70%, 35%, 0.9)`,
                    borderColor: `hsl(${StateConfigs[consciousnessState].colors.primary}, 60%, 50%)`,
                    color: 'white',
                    boxShadow: `0 0 20px hsla(${StateConfigs[consciousnessState].colors.primary}, 60%, 50%, 0.4)`
                  }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes quantumConsciousnessPulse {
          0%, 100% { transform: scale(0.9) rotateZ(0deg) rotateY(0deg); }
          50% { transform: scale(1.15) rotateZ(1deg) rotateY(2deg); }
        }
        
        @keyframes quantumConsciousnessRing {
          0%, 100% { transform: scale(1) rotate(0deg) translateZ(var(--z, 0px)); opacity: 0.5; }
          50% { transform: scale(1.08) rotate(2deg) translateZ(var(--z, 0px)); opacity: 0.9; }
        }
        
        @keyframes quantumIntelligenceSpark {
          0% { transform: rotate(0deg) scale(1) rotateX(0deg); }
          25% { transform: rotate(90deg) scale(1.15) rotateX(5deg); }
          50% { transform: rotate(180deg) scale(0.95) rotateX(10deg); }
          75% { transform: rotate(270deg) scale(1.08) rotateX(5deg); }
          100% { transform: rotate(360deg) scale(1) rotateX(0deg); }
        }
        
        @keyframes quantumConsciousnessOrbit {
          0%, 100% { transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-4px) scale(1) rotateY(0deg); }
          50% { transform: translate(-50%, -50%) rotate(var(--rotation, 180deg)) translateY(4px) scale(1.3) rotateY(10deg); }
        }
        
        @keyframes quantumShimmerRotate {
          from { transform: rotate(0deg) rotateX(0deg); }
          to { transform: rotate(360deg) rotateX(15deg); }
        }
        
        @keyframes quantumAwarenessPulse {
          0% { transform: scale(1) translateZ(0px); opacity: 0; }
          50% { transform: scale(1.8) translateZ(20px); opacity: 0.8; }
          100% { transform: scale(2.5) translateZ(40px); opacity: 0; }
        }
        
        @keyframes quantumFlux {
          0%, 100% { transform: translateY(0px) scale(0.8) rotateZ(0deg); }
          50% { transform: translateY(-12px) scale(1.3) rotateZ(180deg); }
        }
        
        @keyframes hologramLayer {
          0%, 100% { opacity: 0.3; transform: translateZ(var(--z, 0px)) translateY(0px); }
          50% { opacity: 0.8; transform: translateZ(var(--z, 0px)) translateY(-5px); }
        }
        
        @keyframes plasmaFlow {
          0% { stroke-dasharray: 0, 1000; }
          100% { stroke-dasharray: 1000, 0; }
        }
        
        @keyframes quantumFloat {
          0%, 100% { transform: translateY(0px) scale(0.8) rotateZ(0deg); }
          33% { transform: translateY(-10px) scale(1.2) rotateZ(120deg); }
          66% { transform: translateY(5px) scale(0.9) rotateZ(240deg); }
        }
        
        @keyframes consciousnessPulse {
          0%, 100% { transform: scale(0.92) rotateZ(0deg); }
          50% { transform: scale(1.08) rotateZ(0.5deg); }
        }
        
        @keyframes consciousnessRing {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.05) rotate(1deg); opacity: 0.8; }
        }
        
        @keyframes intelligenceSpark {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(0.9); }
          75% { transform: rotate(270deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes consciousnessOrbit {
          0%, 100% { transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-3px) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(3px) scale(1.2); }
        }
        
        @keyframes orbFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          33% { transform: translate(-50%, -50%) translateY(-8px) rotate(1deg); }
          66% { transform: translate(-50%, -50%) translateY(8px) rotate(-1deg); }
        }
        
        @keyframes orbIntelligence {
          0% { filter: brightness(1) saturate(1) hue-rotate(0deg); }
          100% { filter: brightness(1.3) saturate(1.4) hue-rotate(10deg); }
        }
        
        @keyframes orbIntelligenceLayer {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.1) rotate(2deg); opacity: 0.7; }
        }
        
        @keyframes awarenessPulse {
          0% { transform: scale(1); opacity: 0; }
          50% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes shimmerRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes thoughtFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) translateY(-15px) scale(1.1); opacity: 1; }
        }
        
        @keyframes thoughtCreative {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes infinityFloat {
          0%, 100% { transform: translateY(0px) scale(0.8); }
          50% { transform: translateY(-8px) scale(1.2); }
        }
        
        @keyframes voicePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes audioReactive {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        
        @keyframes audioLevel {
          0% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        
        @keyframes thinkingDots {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }

        @keyframes dreamFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(10px) scale(1.1); opacity: 0.7; }
          50% { transform: translateY(-10px) translateX(-5px) scale(0.9); opacity: 0.5; }
          75% { transform: translateY(5px) translateX(-10px) scale(1.2); opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}


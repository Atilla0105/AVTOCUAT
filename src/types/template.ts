export type VideoStyle =
  | "vlog"
  | "travel"
  | "tutorial"
  | "review"
  | "documentary"
  | "cinematic"
  | "interview"
  | "storytelling"
  | "lifestyle"
  | "food"
  | "custom";

export type ShotType =
  | "wide"
  | "medium"
  | "closeup"
  | "extreme-closeup"
  | "tracking"
  | "aerial"
  | "pov"
  | "overhead"
  | "detail";

export type CameraAngle =
  | "eye-level"
  | "low-angle"
  | "high-angle"
  | "dutch"
  | "birds-eye"
  | "worms-eye";

export type TransitionType =
  | "cut"
  | "fade"
  | "dissolve"
  | "whip-pan"
  | "zoom"
  | "j-cut"
  | "l-cut"
  | "match-cut"
  | "none";

export interface Shot {
  type: ShotType;
  angle: CameraAngle;
  description: string;
  duration: number;
  movement?: string;
  tips?: string;
}

export interface TextOverlay {
  text: string;
  timing: string;
  style: string;
}

export interface HookStrategy {
  type: string;
  script: string;
  duration: number;
  visualDescription: string;
}

export interface ClosingStrategy {
  type: string;
  script: string;
  duration: number;
}

export interface MusicRecommendation {
  section: string;
  mood: string;
  genre: string;
  bpm?: string;
  suggestedSearch: string;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number;
  shots: Shot[];
  bRollSuggestions: string[];
  textOverlays: TextOverlay[];
  transitionIn: TransitionType;
  transitionOut: TransitionType;
  musicMood: string;
  narrationScript?: string;
}

export interface VideoTemplate {
  title: string;
  topic: string;
  style: VideoStyle;
  totalDuration: number;
  overallNarrative: string;
  hook: HookStrategy;
  closing: ClosingStrategy;
  scenes: Scene[];
  musicRecommendations: MusicRecommendation[];
}

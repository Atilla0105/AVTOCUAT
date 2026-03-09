import { VideoStyle, VideoTemplate } from "./template";

export interface GenerateOptions {
  duration?: number;
  tone?: string;
  language?: string;
  referenceStyle?: VideoAnalysisResult;
}

export interface FrameAnalysis {
  frameIndex: number;
  shotType: string;
  composition: string;
  lighting: string;
  movement: string;
  mood: string;
}

export interface VideoAnalysisResult {
  narrativeStructure: {
    opening: string;
    development: string;
    climax: string;
    conclusion: string;
  };
  pacing: {
    overall: string;
    sceneChangesPerMinute: number;
    rhythmPattern: string;
  };
  shotPatterns: {
    type: string;
    frequency: string;
    description: string;
  }[];
  tone: string;
  hookTechnique: string;
  editingStyle: string;
  uniqueElements: string[];
  summary: string;
}

export interface AIProvider {
  name: "claude" | "openai";
  generateTemplate(
    topic: string,
    style: VideoStyle,
    options?: GenerateOptions
  ): Promise<VideoTemplate>;
  analyzeVideo(
    transcript: string,
    frames: string[],
    metadata: VideoMetadata
  ): Promise<VideoAnalysisResult>;
}

export interface VideoMetadata {
  title: string;
  description?: string;
  duration?: number;
  platform: string;
}

import { VideoStyle } from "@/types/template";

export const VIDEO_STYLES: {
  value: VideoStyle;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "vlog",
    label: "Vlog",
    description: "日常记录，轻松自然的个人视角",
    icon: "Video",
  },
  {
    value: "travel",
    label: "旅行",
    description: "旅途风光，文化体验，美食探索",
    icon: "Plane",
  },
  {
    value: "tutorial",
    label: "教程",
    description: "步骤清晰的教学内容",
    icon: "GraduationCap",
  },
  {
    value: "review",
    label: "测评",
    description: "产品或体验的详细评测",
    icon: "Star",
  },
  {
    value: "documentary",
    label: "纪录片",
    description: "深度叙事，真实记录",
    icon: "Film",
  },
  {
    value: "cinematic",
    label: "电影感",
    description: "电影级画面和叙事手法",
    icon: "Clapperboard",
  },
  {
    value: "interview",
    label: "访谈",
    description: "对话式内容，人物故事",
    icon: "Mic",
  },
  {
    value: "storytelling",
    label: "故事",
    description: "以故事为驱动的叙事",
    icon: "BookOpen",
  },
  {
    value: "lifestyle",
    label: "生活方式",
    description: "生活美学，日常仪式感",
    icon: "Coffee",
  },
  {
    value: "food",
    label: "美食",
    description: "美食制作、探店、吃播",
    icon: "UtensilsCrossed",
  },
];

export const DEFAULT_VIDEO_DURATION = 600; // 10 minutes in seconds

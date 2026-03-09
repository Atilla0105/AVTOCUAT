import OpenAI from "openai";
import { AIProvider, GenerateOptions, VideoAnalysisResult, VideoMetadata } from "@/types/ai";
import { VideoStyle, VideoTemplate } from "@/types/template";
import { buildTemplateGenerationPrompt } from "./prompts/template-generation";
import { STYLE_ANALYSIS_SYSTEM_PROMPT } from "./prompts/style-analysis";
import { extractJSON } from "./provider";

export function createOpenAIProvider(apiKey: string): AIProvider {
  const client = new OpenAI({ apiKey });

  return {
    name: "openai",

    async generateTemplate(
      topic: string,
      style: VideoStyle,
      options?: GenerateOptions
    ): Promise<VideoTemplate> {
      const systemPrompt = buildTemplateGenerationPrompt(style, options);

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `请为以下主题生成完整的视频拍摄模板：\n\n主题：${topic}`,
          },
        ],
      });

      const text = response.choices[0]?.message?.content ?? "";
      const json = extractJSON(text);
      return JSON.parse(json) as VideoTemplate;
    },

    async analyzeVideo(
      transcript: string,
      frames: string[],
      metadata: VideoMetadata
    ): Promise<VideoAnalysisResult> {
      const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
        {
          type: "text",
          text: `视频标题: ${metadata.title}\n${metadata.description ? `视频描述: ${metadata.description}\n` : ""}${metadata.duration ? `视频时长: ${metadata.duration}秒\n` : ""}\n字幕内容:\n${transcript}`,
        },
        ...frames.map(
          (frame) =>
            ({
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${frame}`,
                detail: "low",
              },
            }) as OpenAI.Chat.Completions.ChatCompletionContentPart
        ),
      ];

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 8192,
        messages: [
          { role: "system", content: STYLE_ANALYSIS_SYSTEM_PROMPT },
          { role: "user", content },
        ],
      });

      const text = response.choices[0]?.message?.content ?? "";
      const json = extractJSON(text);
      return JSON.parse(json) as VideoAnalysisResult;
    },
  };
}

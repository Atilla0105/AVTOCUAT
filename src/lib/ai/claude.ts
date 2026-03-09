import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, GenerateOptions, VideoAnalysisResult, VideoMetadata } from "@/types/ai";
import { VideoStyle, VideoTemplate } from "@/types/template";
import { buildTemplateGenerationPrompt } from "./prompts/template-generation";
import { STYLE_ANALYSIS_SYSTEM_PROMPT } from "./prompts/style-analysis";
import { extractJSON } from "./provider";

export function createClaudeProvider(apiKey: string): AIProvider {
  const client = new Anthropic({ apiKey });

  return {
    name: "claude",

    async generateTemplate(
      topic: string,
      style: VideoStyle,
      options?: GenerateOptions
    ): Promise<VideoTemplate> {
      const systemPrompt = buildTemplateGenerationPrompt(style, options);

      const response = await client.messages.create({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `请为以下主题生成完整的视频拍摄模板：\n\n主题：${topic}`,
          },
        ],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";
      const json = extractJSON(text);
      return JSON.parse(json) as VideoTemplate;
    },

    async analyzeVideo(
      transcript: string,
      frames: string[],
      metadata: VideoMetadata
    ): Promise<VideoAnalysisResult> {
      const content: Anthropic.ContentBlockParam[] = [
        {
          type: "text",
          text: `视频标题: ${metadata.title}\n${metadata.description ? `视频描述: ${metadata.description}\n` : ""}${metadata.duration ? `视频时长: ${metadata.duration}秒\n` : ""}\n字幕内容:\n${transcript}`,
        },
        ...frames.map(
          (frame) =>
            ({
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: frame,
              },
            }) as Anthropic.ContentBlockParam
        ),
      ];

      const response = await client.messages.create({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 8192,
        system: STYLE_ANALYSIS_SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";
      const json = extractJSON(text);
      return JSON.parse(json) as VideoAnalysisResult;
    },
  };
}

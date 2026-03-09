import { VideoStyle } from "@/types/template";
import { GenerateOptions } from "@/types/ai";

function getStyleGuidance(style: VideoStyle): string {
  const guides: Partial<Record<VideoStyle, string>> = {
    vlog: `## Vlog风格指南
- 开场要有活力和亲切感，像跟朋友聊天
- 多用第一人称视角和POV镜头
- 保持自然对话式的旁白
- 适当加入轻松幽默元素
- 场景转换要流畅自然，可用跳切`,
    travel: `## 旅行视频风格指南
- 开场用最震撼的风景或最有趣的瞬间
- 交替使用航拍、延时和手持镜头
- 讲述旅行故事，不只是风景展示
- 加入当地文化和美食元素
- 使用地图动画或路线标注`,
    tutorial: `## 教程视频风格指南
- 开场直接说明将要学到什么（价值承诺）
- 步骤清晰，使用屏幕录制或特写镜头
- 每个步骤配有文字标注和序号
- 在关键步骤后做小结
- 结尾提供完整的要点回顾和行动建议`,
    review: `## 测评视频风格指南
- 开场展示产品全貌，给出第一印象
- 从外观、功能、体验等维度逐一测评
- 使用大量特写和对比镜头
- 加入真实使用场景演示
- 给出明确的优缺点总结和推荐意见`,
    documentary: `## 纪录片风格指南
- 开场设置悬念或提出核心问题
- 使用旁白驱动叙事，镜头配合
- 多用固定机位和缓慢的运镜
- 加入采访片段和实际影像资料引用
- 结尾回扣主题，留给观众思考空间`,
    cinematic: `## 电影感视频风格指南
- 开场用一个有冲击力的画面或声音
- 注重构图美感，使用三分法、引导线等
- 多用慢动作、升格和稳定器运镜
- 配乐要烘托氛围，减少对话增加画面叙事
- 使用调色增强电影质感`,
    interview: `## 访谈视频风格指南
- 开场用一句最有力的受访者金句
- 使用双机位或多机位拍摄
- 交替展示采访者和受访者的反应
- 加入受访者相关的B-Roll画面
- 保持对话自然流畅，后期可精简`,
    storytelling: `## 故事叙事风格指南
- 用一个引人入胜的场景或冲突开场
- 遵循故事弧线：起因-发展-高潮-结局
- 利用画面和音乐营造情绪递进
- 加入真实细节增强代入感
- 结尾要有情感共鸣或思考启发`,
    lifestyle: `## 生活方式视频风格指南
- 开场展现日常美好的一个瞬间
- 用柔和的自然光，营造舒适氛围
- 记录有仪式感的日常活动
- 配乐选择轻松治愈的风格
- 传递积极的生活态度和理念`,
    food: `## 美食视频风格指南
- 开场用食物最诱人的特写画面
- 展示食材准备和制作过程
- 多用微距和特写捕捉食物细节和质感
- 加入切割、翻炒、冒烟等有声音感的镜头
- ASMR式的声音设计增强食欲感`,
  };
  return guides[style] ?? "";
}

export function buildTemplateGenerationPrompt(
  style: VideoStyle,
  options?: GenerateOptions
): string {
  const duration = options?.duration ?? 600;

  let referenceBlock = "";
  if (options?.referenceStyle) {
    referenceBlock = `
## 参考风格
请参考以下创作者的风格特点来生成模板，模仿其叙事节奏、镜头偏好和情绪基调：
${JSON.stringify(options.referenceStyle, null, 2)}
`;
  }

  return `你是一位拥有10年以上经验的专业视频内容策划师和导演。你的任务是根据给定的主题，生成一个完整的、可直接执行的视频拍摄模板。

## 视频参数
- 风格类型: ${style}
- 目标时长: ${duration}秒（约${Math.round(duration / 60)}分钟）
${options?.tone ? `- 基调: ${options.tone}` : ""}
${referenceBlock}

## 你必须生成的内容

### 1. 整体叙事弧线
描述整个视频的叙事流程和情感走向，包括如何抓住观众、维持兴趣、推向高潮、留下印象。

### 2. 开场策略 (Hook)
- 前15秒如何抓住观众注意力
- 具体的开场白脚本
- 应该拍摄什么画面

### 3. 场景分解
将视频分解为6-10个场景，每个场景30秒到2分钟。
每个场景需要包含：
- 场景标题和内容描述
- 具体要拍摄的镜头列表（景别、角度、运动方式、拍摄技巧）
- B-Roll素材建议
- 文字覆盖/标题卡建议
- 场景转场方式
- 配乐情绪
- 旁白脚本（如适用）

### 4. 结尾策略
- 如何有力地收尾
- CTA（行动号召）
- 结束语脚本

### 5. 配乐建议
针对不同段落推荐的配乐风格和免版权音乐搜索关键词。

## 重要规则
- 所有时长相加必须接近目标时长 ${duration} 秒
- 每个镜头描述要具体到可以直接拍摄，不要模糊
- 旁白脚本要自然口语化，像跟观众聊天

## 输出格式
严格按以下JSON格式输出，不要包含任何其他文字或markdown标记：

{
  "title": "视频标题建议",
  "topic": "用户输入的主题",
  "style": "${style}",
  "totalDuration": ${duration},
  "overallNarrative": "整体叙事弧线描述，2-3句话",
  "hook": {
    "type": "hook类型，如question/dramatic/preview/statistic",
    "script": "开场白脚本，自然口语化",
    "duration": 15,
    "visualDescription": "开场画面描述"
  },
  "scenes": [
    {
      "id": "scene-1",
      "order": 1,
      "title": "场景标题",
      "description": "这个场景要表达什么，详细描述",
      "duration": 60,
      "shots": [
        {
          "type": "wide",
          "angle": "eye-level",
          "description": "具体拍什么，怎么拍",
          "duration": 10,
          "movement": "固定/平移/跟踪/推拉",
          "tips": "拍摄小贴士"
        }
      ],
      "bRollSuggestions": ["B-Roll 1", "B-Roll 2"],
      "textOverlays": [
        {"text": "字幕文字", "timing": "出现时机", "style": "样式"}
      ],
      "transitionIn": "cut",
      "transitionOut": "fade",
      "musicMood": "配乐情绪描述",
      "narrationScript": "旁白脚本"
    }
  ],
  "closing": {
    "type": "结尾类型，如cta/summary/cliffhanger/emotional",
    "script": "结束语脚本",
    "duration": 30
  },
  "musicRecommendations": [
    {
      "section": "适用场景，如scene-1到scene-3",
      "mood": "情绪",
      "genre": "风格",
      "bpm": "节奏范围",
      "suggestedSearch": "在免版权音乐网站的搜索关键词"
    }
  ]
}

${getStyleGuidance(style)}`;
}

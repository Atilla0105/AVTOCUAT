-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "totalDuration" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "aiProvider" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VideoAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoUrl" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoPlatform" TEXT NOT NULL,
    "transcript" TEXT,
    "frameCount" INTEGER NOT NULL DEFAULT 0,
    "analysisResult" TEXT NOT NULL,
    "aiProvider" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "defaultProvider" TEXT NOT NULL DEFAULT 'claude',
    "defaultStyle" TEXT NOT NULL DEFAULT 'vlog',
    "anthropicKey" TEXT NOT NULL DEFAULT '',
    "openaiKey" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'zh'
);

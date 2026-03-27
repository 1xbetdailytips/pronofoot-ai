-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "matchDate" DATETIME NOT NULL,
    "kickoffTime" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "externalId" TEXT,
    "prediction" TEXT,
    "confidence" REAL,
    "predictedScore" TEXT,
    "overUnder" TEXT,
    "btts" TEXT,
    "aiAnalysis" TEXT,
    "aiAnalysisFr" TEXT,
    "homeOdds" REAL,
    "drawOdds" REAL,
    "awayOdds" REAL,
    "overOdds" REAL,
    "underOdds" REAL,
    "homeForm" TEXT,
    "awayForm" TEXT,
    "h2hRecord" TEXT,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "actualResult" TEXT,
    "predictionHit" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "bestValueBet" TEXT,
    "safestBet" TEXT,
    "bestUnderdog" TEXT,
    "accumulatorIds" TEXT,
    "highOddsSpecial" TEXT,
    "reportContent" TEXT,
    "reportContentFr" TEXT,
    "totalOdds" REAL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "nameFr" TEXT,
    "bookingCode" TEXT NOT NULL,
    "totalOdds" REAL NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "isVip" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "profit" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TicketMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "pick" TEXT NOT NULL,
    "odds" REAL NOT NULL,
    CONSTRAINT "TicketMatch_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "telegramId" TEXT,
    "telegramUsername" TEXT,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "vipExpiresAt" DATETIME,
    "stripeCustomerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_slug_key" ON "Match"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Match_externalId_key" ON "Match"("externalId");

-- CreateIndex
CREATE INDEX "Match_matchDate_idx" ON "Match"("matchDate");

-- CreateIndex
CREATE INDEX "Match_league_idx" ON "Match"("league");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReport_date_key" ON "DailyReport"("date");

-- CreateIndex
CREATE INDEX "Ticket_date_idx" ON "Ticket"("date");

-- CreateIndex
CREATE INDEX "Ticket_isFree_idx" ON "Ticket"("isFree");

-- CreateIndex
CREATE UNIQUE INDEX "TicketMatch_ticketId_matchId_key" ON "TicketMatch"("ticketId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

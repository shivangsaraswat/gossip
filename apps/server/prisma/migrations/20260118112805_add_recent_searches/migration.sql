-- CreateTable
CREATE TABLE "recent_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "searchedUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recent_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recent_searches_userId_idx" ON "recent_searches"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "recent_searches_userId_searchedUserId_key" ON "recent_searches"("userId", "searchedUserId");

-- AddForeignKey
ALTER TABLE "recent_searches" ADD CONSTRAINT "recent_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_searches" ADD CONSTRAINT "recent_searches_searchedUserId_fkey" FOREIGN KEY ("searchedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

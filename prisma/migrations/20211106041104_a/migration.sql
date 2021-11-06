/*
  Warnings:

  - A unique constraint covering the columns `[userId,roomId]` on the table `UserInRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserInRoom_userId_roomId_key" ON "UserInRoom"("userId", "roomId");

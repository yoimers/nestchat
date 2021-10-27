/*
  Warnings:

  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateTable
CREATE TABLE "UserInRoom" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "UserInRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserInRoom" ADD CONSTRAINT "UserInRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInRoom" ADD CONSTRAINT "UserInRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

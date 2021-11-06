-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "roomId" TEXT;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "roomName" SET DEFAULT E'Room';

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

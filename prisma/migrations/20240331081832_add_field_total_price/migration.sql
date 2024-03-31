/*
  Warnings:

  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startdate" DATETIME NOT NULL,
    "person" INTEGER NOT NULL DEFAULT 1,
    "bookingDays" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" INTEGER NOT NULL,
    CONSTRAINT "Booking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("bookingDays", "hotelId", "id", "person", "roomId", "startdate", "userId") SELECT "bookingDays", "hotelId", "id", "person", "roomId", "startdate", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

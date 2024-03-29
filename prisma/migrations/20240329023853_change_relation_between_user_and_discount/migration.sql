/*
  Warnings:

  - You are about to drop the column `discountId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserOnDiscount" (
    "userId" INTEGER NOT NULL,
    "discountId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "discountId"),
    CONSTRAINT "UserOnDiscount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserOnDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DiscountToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DiscountToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Discount" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DiscountToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "profileImage" TEXT
);
INSERT INTO "new_User" ("birthDate", "email", "id", "name", "password", "profileImage", "telephoneNumber") SELECT "birthDate", "email", "id", "name", "password", "profileImage", "telephoneNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountToUser_AB_unique" ON "_DiscountToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountToUser_B_index" ON "_DiscountToUser"("B");

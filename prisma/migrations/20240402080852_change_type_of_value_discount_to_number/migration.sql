/*
  Warnings:

  - You are about to alter the column `value` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL DEFAULT -1
);
INSERT INTO "new_Discount" ("id", "remaining", "type", "value") SELECT "id", "remaining", "type", "value" FROM "Discount";
DROP TABLE "Discount";
ALTER TABLE "new_Discount" RENAME TO "Discount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

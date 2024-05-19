/*
  Warnings:

  - Added the required column `address` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orders" ("createdAt", "id", "status", "updatedAt", "userId") SELECT "createdAt", "id", "status", "updatedAt", "userId" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

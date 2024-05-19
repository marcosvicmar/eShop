/*
  Warnings:

  - You are about to drop the `_OrdersToProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `rating` on the `Ratings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- DropIndex
DROP INDEX "_OrdersToProducts_B_index";

-- DropIndex
DROP INDEX "_OrdersToProducts_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrdersToProducts";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ratings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "rating" REAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Ratings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ratings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ratings" ("authorId", "createdAt", "id", "productId", "rating", "updatedAt") SELECT "authorId", "createdAt", "id", "productId", "rating", "updatedAt" FROM "Ratings";
DROP TABLE "Ratings";
ALTER TABLE "new_Ratings" RENAME TO "Ratings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

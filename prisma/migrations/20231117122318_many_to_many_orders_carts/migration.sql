/*
  Warnings:

  - You are about to drop the column `cartsId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `ordersId` on the `Products` table. All the data in the column will be lost.
  - Added the required column `status` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_OrdersToProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OrdersToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrdersToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CartsToProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CartsToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Carts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CartsToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Products" ("categoryId", "createdAt", "description", "id", "name", "price", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "name", "price", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orders" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_OrdersToProducts_AB_unique" ON "_OrdersToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_OrdersToProducts_B_index" ON "_OrdersToProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CartsToProducts_AB_unique" ON "_CartsToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_CartsToProducts_B_index" ON "_CartsToProducts"("B");

/*
  Warnings:

  - You are about to drop the `_CartsToProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CartsToProducts";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CartsItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    CONSTRAINT "CartsItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Carts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartsItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

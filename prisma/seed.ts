import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const users = {
    user1: await prisma.users.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
        admin: false,
        password: 'alice123',
      }
    }),
    user2: await prisma.users.create({
      data: {
        name: 'Bob',
        email: 'bob@example.com',
        admin: false,
        password: 'bob123',
      }
    }),
    admin: await prisma.users.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        admin: true,
        password: 'admin123',
      }
    }),
  }

  const categories = {
    camera: await prisma.categories.create({
      data: {
        name: 'Camera',
        description: 'Sony Camera',
      }
    }),
    memory: await prisma.categories.create({
      data: {
        name: 'Memory',
        description: 'Sony Memory Card',
      }
    }),
    lens: await prisma.categories.create({
      data: {
        name: 'Lens',
        description: 'Sony Lens',
      }
    }),
  }

  const products = {
    camera1: await prisma.products.create({
      data: {
        name: 'Sony A7 III',
        description: '24.2MP BSI Full-frame Image Sensor',
        price: 1999.99,
        categoryId: categories.camera.id
      }
    }),
    camera2: await prisma.products.create({
      data: {
        name: 'Sony A7R III',
        description: '42.4MP BSI Full-frame Image Sensor',
        price: 2499.99,
        categoryId: categories.camera.id
      }
    }),
    camera3: await prisma.products.create({
      data: {
        name: 'Sony A9',
        description: '24.2MP BSI Full-frame Image Sensor',
        price: 3499.99,
        categoryId: categories.camera.id
      }
    }),

    memory1: await prisma.products.create({
      data: {
        name: 'Sony SF-G128/T1 High Performance 128GB SDXC UHS-II Class 10 U3 Memory Card',
        description: 'Read speed up to 300MB/s and write speed up to 299MB/s',
        price: 199.99,
        categoryId: categories.memory.id
      }
    }),
    memory2: await prisma.products.create({
      data: {
        name: 'Sony SF-G64/T1 High Performance 64GB SDXC UHS-II Class 10 U3 Memory Card',
        description: 'Read speed up to 300MB/s and write speed up to 299MB/s',
        price: 99.99,
        categoryId: categories.memory.id
      }
    }),
    memory3: await prisma.products.create({
      data: {
        name: 'Sony SF-G32/T1 High Performance 32GB SDXC UHS-II Class 10 U3 Memory Card',
        description: 'Read speed up to 300MB/s and write speed up to 299MB/s',
        price: 49.99,
        categoryId: categories.memory.id
      }
    }),

    lens1: await prisma.products.create({
      data: {
        name: 'Sony FE 24-70mm f/2.8 GM Lens',
        description: 'E-Mount Lens/Full-Frame Format, Aperture Range: f/2.8 to f/22',
        price: 2199.99,
        categoryId: categories.lens.id
      }
    }),
    lens2: await prisma.products.create({
      data: {
        name: 'Sony FE 16-35mm f/2.8 GM Lens',
        description: 'E-Mount Lens/Full-Frame Format, Aperture Range: f/2.8 to f/22',
        price: 2199.99,
        categoryId: categories.lens.id
      }
    }),
  }

  const ratings = (async () => {
    for (const entry of Object.entries(products)) {
      for (let i = 0; i < 5; i++) {
        await prisma.ratings.create({
          data: {
            rating: Math.floor(Math.random() * 5) + 1,
            productId: entry[1].id,
            authorId: users.user1.id,
          }
        })
      }
    }
  })();

  const comments = {
    comment1: await prisma.comments.create({
      data: {
        body: 'This product looks great! I recommend it so much!',
        productId: products.camera1.id,
        authorId: users.user1.id,
      }
    }),
    comment2: await prisma.comments.create({
      data: {
        body: 'This product looks great! I recommend it so much!',
        productId: products.camera1.id,
        authorId: users.user2.id,
      }
    }),
    comment3: await prisma.comments.create({
      data: {
        body: 'This product looks great! I recommend it so much!',
        productId: products.camera1.id,
        authorId: users.admin.id,
      }
    }),
  }
}

main()
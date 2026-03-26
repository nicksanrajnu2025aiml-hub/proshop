import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('123456', 10),
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('123456', 10),
      },
    ]);

    const adminUser = createdUsers[0]._id;

    const productsRaw = [
      // ELECTRONICS (INR)
      { name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', brand: 'Sony', category: 'Electronics', price: 29990, countInStock: 25, rating: 4.8, numReviews: 156, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop', description: 'Industry-leading noise cancellation with two processors controlling 8 microphones. Magnificent Sound, engineered to perfection.' },
      { name: 'Apple AirPods Pro (2nd Generation) with USB-C', brand: 'Apple', category: 'Electronics', price: 24900, countInStock: 50, rating: 4.9, numReviews: 890, image: 'https://images.unsplash.com/photo-1606220588913-b3aecb4b2772?q=80&w=600&auto=format&fit=crop', description: 'Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio for immersive sound.' },
      { name: 'Bose QuietComfort Ultra Wireless Headphones', brand: 'Bose', category: 'Electronics', price: 35900, countInStock: 15, rating: 4.7, numReviews: 45, image: 'https://images.unsplash.com/photo-1546435770-a3e426ff472b?q=80&w=600&auto=format&fit=crop', description: 'Breakthrough spatialized audio for more immersive listening that makes your music feel more real than ever before.' },
      { name: 'Samsung Galaxy Buds2 Pro True Wireless Earbuds', brand: 'Samsung', category: 'Electronics', price: 14999, countInStock: 40, rating: 4.5, numReviews: 120, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', description: 'Studio-quality sound isn’t just for the pros. Feel every note like you’re there with Galaxy Buds2 Pro.' },
      { name: 'Sony SRS-XE300 X-Series Wireless Speaker', brand: 'Sony', category: 'Electronics', price: 12990, countInStock: 20, rating: 4.4, numReviews: 32, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop', description: 'The XE300 has a Line-Shape Diffuser that will help your sound reach further than ever.' },
      { name: 'JBL Flip 6 Waterproof Portable Bluetooth Speaker', brand: 'JBL', category: 'Electronics', price: 10999, countInStock: 60, rating: 4.8, numReviews: 567, image: 'https://images.unsplash.com/photo-1589127151041-0688f191a91e?q=80&w=600&auto=format&fit=crop', description: 'Bold sound for every adventure. The JBL Flip 6 delivers powerful JBL Original Pro Sound.' },
      { name: 'Apple Watch Series 9 GPS 45mm Midnight', brand: 'Apple', category: 'Electronics', price: 44900, countInStock: 30, rating: 4.7, numReviews: 450, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600&auto=format&fit=crop', description: 'The most powerful chip in Apple Watch ever. A magical new way to use your watch.' },
      { name: 'Samsung Galaxy Watch6 Classic 43mm Bluetooth', brand: 'Samsung', category: 'Electronics', price: 36999, countInStock: 18, rating: 4.5, numReviews: 67, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', description: 'The look you love. The performance you need. A sleek design with a rotating bezel.' },

      // MOBILES (INR)
      { name: 'iPhone 15 Pro Max 256GB Natural Titanium', brand: 'Apple', category: 'Mobiles', price: 159900, countInStock: 8, rating: 4.9, numReviews: 245, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop', description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip. The most powerful iPhone ever.' },
      { name: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray', brand: 'Samsung', category: 'Mobiles', price: 139999, countInStock: 12, rating: 4.8, numReviews: 145, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop', description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra, you can unleash whole new levels of creativity.' },
      { name: 'Google Pixel 8 Pro 128GB Obsidian', brand: 'Google', category: 'Mobiles', price: 106990, countInStock: 15, rating: 4.6, numReviews: 89, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop', description: 'Pixel 8 Pro is the all-pro phone engineered by Google. It’s sleek, sophisticated, and the best Pixel yet.' },
      { name: 'OnePlus 12 5G 16GB RAM + 512GB Storage', brand: 'OnePlus', category: 'Mobiles', price: 69999, countInStock: 20, rating: 4.7, numReviews: 56, image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=600&auto=format&fit=crop', description: 'Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3 with up to 16GB of RAM. Elite performance.' },
      { name: 'Samsung Galaxy Z Fold5 5G Phantom Black', brand: 'Samsung', category: 'Mobiles', price: 154999, countInStock: 5, rating: 4.4, numReviews: 32, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59d?q=80&w=600&auto=format&fit=crop', description: 'The ultimate canvas for productivity and play. A massive 7.6-inch screen.' },

      // FASHION (INR)
      { name: 'Nike Air Max 270 Black Men\'s Shoes', brand: 'Nike', category: 'Fashion', price: 13995, countInStock: 40, rating: 4.7, numReviews: 12450, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', description: 'Nike\'s first lifestyle Air Max brings you style, comfort and a big attitude.' },
      { name: 'Levi\'s Men\'s 501 Original Fit Jeans', brand: 'Levi\'s', category: 'Fashion', price: 4599, countInStock: 80, rating: 4.5, numReviews: 32450, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop', description: 'The original blue jean since 1873. A cultural icon that fits everyone.' },
      { name: 'Ray-Ban Wayfarer Classic Sunglasses Black', brand: 'Ray-Ban', category: 'Fashion', price: 10990, countInStock: 25, rating: 4.6, numReviews: 1240, image: 'https://images.unsplash.com/photo-1511499767390-90342f567517?q=80&w=600&auto=format&fit=crop', description: 'Iconic design since 1952. The style of choice for legends.' },

      // FRESH (INR)
      { name: 'Premium Alphonso Mangoes (6 Piece Pack)', brand: 'Luxe', category: 'Fresh', price: 950, countInStock: 100, rating: 4.9, numReviews: 67, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop', description: 'Naturally ripened, sweet and aromatic Alphonso mangoes.' },
      { name: 'Organic Raw Almonds (1kg Deal Bag)', brand: 'Luxe', category: 'Fresh', price: 1450, countInStock: 200, rating: 4.7, numReviews: 124, image: 'https://images.unsplash.com/photo-1521488665798-900227915598?q=80&w=600&auto=format&fit=crop', description: 'Crunchy, non-GMO pasteurized almonds. Perfect for health.' },

      // HEALTH (INR)
      { name: 'Oral-B iO Series 9 Electric Toothbrush', brand: 'Oral-B', category: 'Health', price: 18999, countInStock: 20, rating: 4.8, numReviews: 324, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop', description: 'Combines powerful but gentle micro-vibrations with unique round brush head.' },
      { name: 'CeraVe Hydrating Facial Cleanser (16 oz)', brand: 'CeraVe', category: 'Health', price: 2199, countInStock: 150, rating: 4.8, numReviews: 124500, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop', description: 'Developed with dermatologists. Cleanses and hydrates skin.' }
    ];

    const products = productsRaw.map((p) => ({ ...p, user: adminUser }));

    await Product.insertMany(products);

    console.log(`${products.length} Products Imported in INR!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();

import {Platform} from 'react-native';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

// database instance
let db: SQLiteDatabase | null = null;

export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabase(
      {
        name: 'productManager.db',
        location: 'default',
      },
      () => {
        console.log('Database opened successfully');
      },
      error => {
        console.log('Error opening database:', error);
      },
    );
    console.log('🚀 ~ openDatabase ~ db:', db);
  }
  return db;
};

export const closeDatabase = () => {
  if (db) {
    db.close();
  }
};

export const printDbLocation = () => {
  if (!db) {
    console.log('Database is not open');
    return;
  }
  let dbPath = '';

  // On Android and iOS, SQLite automatically places the database in a default location.
  // SQLiteStorage API itself doesn't expose a method to directly fetch the location, but you can infer it.

  if (Platform.OS === 'ios') {
    // On iOS, the database is stored in Library/LocalDatabase.
    // dbPath = 'Library/LocalDatabase/myDatabase.db';
    const documentDirectory = RNFS.DocumentDirectoryPath;
    console.log('Document Directory Path:', documentDirectory);
  } else if (Platform.OS === 'android') {
    // On Android, the database is stored in /data/data/{package_name}/databases.
    dbPath = '/data/data/com.yourapp/databases/myDatabase.db';
  }

  console.log('Database location:', dbPath);

  // Optionally, display the path in an alert
  /* The line `// Alert.alert('Database Location', dbPath);` is a comment in the code. It is currently
  commented out using `//`, which means it is not an active part of the code and will not be
  executed. */
  // Alert.alert('Database Location', dbPath);
};

export const createTables = async () => {
  // Product table creation query
  const createProductTable = `
    CREATE TABLE IF NOT EXISTS Product (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock_quantity INTEGER NOT NULL,      
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Cart table creation query for a single user
  const createCartTable = `
    CREATE TABLE IF NOT EXISTS Cart (
      cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES Product(product_id)
    );
  `;

  const createPromoCodeTable = `CREATE TABLE IF NOT EXISTS PromoCode (
  promo_code_id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  minimum_purchase DECIMAL(10, 2) DEFAULT 0,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  usage_limit INTEGER DEFAULT 0, -- 0 means no limit
  times_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

  // Execute the table creation queries

  db?.transaction(tx => {
    tx.executeSql(
      createProductTable,
      [],
      (tx, results) => {
        console.log('Product table created successfully');
      },
      (tx, error) => {
        console.log('Error creating Product table:', error);
      },
    );

    tx.executeSql(
      createCartTable,
      [],
      (tx, results) => {
        console.log('Cart table created successfully');
      },
      (tx, error) => {
        console.log('Error creating Cart table:', error);
      },
    );
    tx.executeSql(
      createPromoCodeTable,
      [],
      (tx, results) => {
        console.log('PromoCode table created successfully');
      },
      (tx, error) => {
        console.log('Error creating PromoCode table:', error);
      },
    );
  });
};

export const insertProductData = async () => {
  if (!db) {
    await openDatabase(); // Ensure the database is opened
  }

  // Sample product data
  const products = [
    {
      name: 'Apple iPhone 14',
      description:
        'The latest iPhone with stunning camera quality and performance.',
      price: 100,
      stock_quantity: 25,
      image_url:
        'https://inventstore.in/staging/wp-content/uploads/2023/04/Product-Red-scaled.webp', // Placeholder image for iPhone
    },
    {
      name: 'Samsung Galaxy S23',
      description:
        'Powerful smartphone with a sleek design and exceptional features.',
      price: 200,
      stock_quantity: 30,
      image_url:
        'https://images.samsung.com/is/image/samsung/p6pim/in/sm-s911blibins/gallery/in-galaxy-s23-s911-446648-sm-s911blibins-536009999?$650_519_PNG$', // Placeholder image for Galaxy S23
    },
    {
      name: 'Google Pixel 7',
      description:
        'Capture stunning photos with Google’s advanced camera technology.',
      price: 200,
      stock_quantity: 20,
      image_url:
        'https://cdn.dxomark.com/wp-content/uploads/medias/post-127929/Google-Pixel-7-Pro_featured-image-packshot-review.jpg', // Placeholder image for Pixel 7
    },
    {
      name: 'OnePlus 11',
      description:
        'High-performance smartphone with a smooth display and fast charging.',
      price: 200,
      stock_quantity: 15,
      image_url:
        'https://oasis.opstatics.com/content/dam/oasis/page/2023/na/oneplus-11/specs/green-img.png', // Placeholder image for OnePlus 11
    },
  ];

  // Insert data into the Product table
  db?.transaction(tx => {
    products.forEach(product => {
      tx.executeSql(
        `INSERT INTO Product (name, description, price, stock_quantity, image_url) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.price,
          product.stock_quantity,
          product.image_url,
        ],
        (tx, results) => {
          console.log(`Inserted ${product.name} successfully`);
        },
        (tx, error) => {
          console.log(`Error inserting ${product.name}:`, error.message);
        },
      );
    });
  });
};

// Function to insert promo code data
export const insertPromoCodeData = async (
  code: string,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  minimumPurchase: number,
  startDate: string,
  endDate: string,
  usageLimit: number,
): Promise<void> => {
  try {
    const db = await openDatabase(); // Ensure database is open
    const insertQuery = `
      INSERT INTO PromoCode 
      (code, discount_type, discount_value, minimum_purchase, start_date, end_date, usage_limit)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.transaction(tx => {
      tx.executeSql(
        insertQuery,
        [
          code,
          discountType,
          discountValue,
          minimumPurchase,
          startDate,
          endDate,
          usageLimit,
        ],
        (tx, results) => {
          console.log('Promo code inserted successfully');
        },
        (tx, error) => {
          console.log('Error inserting promo code:', error.message);
        },
      );
    });
  } catch (error) {
    console.error('Database error:', error);
  }
};

export const deleteAllProducts = async () => {
  if (!db) {
    await openDatabase(); // Ensure the database is opened
  }

  db?.transaction(tx => {
    tx.executeSql(
      'DELETE FROM Product',
      [],
      (tx, results) => {
        console.log('All products deleted successfully');
      },
      (tx, error) => {
        console.log('Error deleting all products:', error.message);
      },
    );
    tx.executeSql(
      'DELETE FROM Cart',
      [],
      (tx, results) => {
        console.log('All products from cart deleted successfully');
      },
      (tx, error) => {
        console.log('Error deleting all products from cart:', error.message);
      },
    );
  });
};

export const deleteProductById = async (productId: number) => {
  if (!db) {
    await openDatabase(); // Ensure the database is opened
  }

  db?.transaction(tx => {
    // Delete from Product table
    tx.executeSql(
      'DELETE FROM Product WHERE product_id = ?',
      [productId],
      (tx, results) => {
        console.log(
          `Product with id ${productId} deleted successfully from Product table`,
        );
      },
      (tx, error) => {
        console.log(
          'Error deleting product from Product table:',
          error.message,
        );
      },
    );

    // Delete from Cart table
    tx.executeSql(
      'DELETE FROM Cart WHERE product_id = ?',
      [productId],
      (tx, results) => {
        console.log(
          `Product with id ${productId} deleted successfully from Cart table`,
        );
      },
      (tx, error) => {
        console.log('Error deleting product from Cart table:', error.message);
      },
    );
  });
};

export const updateProduct = async (productId: number, newName: string) => {
  if (!db) {
    await openDatabase(); // Ensure the database is opened
  }

  db?.transaction(tx => {
    // Update the product title in the Product table
    tx.executeSql(
      'UPDATE Product SET name = ? WHERE product_id = ?',
      [newName, productId],
      (tx, results) => {
        console.log(
          `Product name updated successfully for product id ${productId}`,
        );
      },
      (tx, error) => {
        console.log(
          'Error updating product name in Product table:',
          error.message,
        );
      },
    );
  });
};

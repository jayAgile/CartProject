import {Platform} from 'react-native';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

// database instance
let db: SQLiteDatabase | null = null;

export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabase(
      {
        name: 'ChatDB.db',
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
  // Create a table for chat list
  await db?.executeSql(
    `CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contactName TEXT,
        lastMessage TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
  );

  // Create a table for chat messages
  await db?.executeSql(
    `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chatId INTEGER,
        sender TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT,
        FOREIGN KEY (chatId) REFERENCES chats(id)
      );`,
  );
};

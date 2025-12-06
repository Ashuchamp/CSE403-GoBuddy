import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Support both DATABASE_URL (Render format) and individual env vars (local dev)
let sequelizeConfig: any;

if (process.env.DATABASE_URL) {
  // Render provides DATABASE_URL in format: postgresql://user:password@host:port/database
  const dbUrl = process.env.DATABASE_URL;
  // Log connection info (without password) for debugging
  try {
    const urlParts = new URL(dbUrl);
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@'); // Mask password
    console.log(`🔌 DATABASE_URL format check:`);
    console.log(`   Full URL (masked): ${maskedUrl}`);
    console.log(`   Hostname: ${urlParts.hostname}`);
    console.log(`   Port: ${urlParts.port || 'MISSING!'}`);
    console.log(`   Database: ${urlParts.pathname.replace('/', '')}`);
    
    if (!urlParts.port) {
      console.error('⚠️  WARNING: DATABASE_URL is missing port number!');
    }
    if (!urlParts.hostname.includes('.')) {
      console.error('⚠️  WARNING: DATABASE_URL hostname appears incomplete (missing domain)!');
    }
  } catch (error) {
    console.error('❌ Failed to parse DATABASE_URL:', error);
  }
  
  // For Render, always use SSL in production
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  
  sequelizeConfig = {
    url: dbUrl,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: isProduction ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
} else {
  console.log('⚠️  DATABASE_URL not set, using individual env vars');
  console.log(`🔌 Connecting to: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'gobuddy'}`);
  // Fallback to individual environment variables for local development
  sequelizeConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'gobuddy',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
}

const sequelize = new Sequelize(sequelizeConfig);

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export const syncDatabase = async (): Promise<void> => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
};

export default sequelize;

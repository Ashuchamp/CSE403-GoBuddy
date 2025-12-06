import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Support both DATABASE_URL (Render format) and individual env vars (local dev)
let sequelizeConfig: any;

if (process.env.DATABASE_URL) {
  // Render provides DATABASE_URL in format: postgresql://user:password@host:port/database
  const dbUrl = process.env.DATABASE_URL;
  
  // Parse URL into individual components (more reliable than using url option)
  try {
    const urlParts = new URL(dbUrl);
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@'); // Mask password
    console.log(`🔌 DATABASE_URL format check:`);
    console.log(`   Full URL (masked): ${maskedUrl}`);
    console.log(`   Hostname: ${urlParts.hostname}`);
    console.log(`   Port: ${urlParts.port || '5432'}`);
    console.log(`   Database: ${urlParts.pathname.replace('/', '')}`);
    console.log(`   Username: ${urlParts.username}`);
    
    // For Render databases, always use SSL (they require it)
    const isRenderDatabase = dbUrl.includes('render.com') || process.env.RENDER === 'true';
    const isProduction = process.env.NODE_ENV === 'production' || isRenderDatabase;
    
    console.log(`🔐 SSL Configuration: ${isProduction ? 'ENABLED' : 'DISABLED'} (Render DB: ${isRenderDatabase})`);
    
    // Parse URL and use individual connection parameters (more reliable)
    sequelizeConfig = {
      host: urlParts.hostname,
      port: parseInt(urlParts.port || '5432'),
      database: urlParts.pathname.replace('/', ''),
      username: urlParts.username,
      password: urlParts.password,
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
  } catch (error) {
    console.error('❌ Failed to parse DATABASE_URL:', error);
    throw new Error('Invalid DATABASE_URL format');
  }
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
    console.log('🔄 Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error: any) {
    console.error('❌ Unable to connect to the database');
    console.error('   Error type:', error?.name || 'Unknown');
    console.error('   Error message:', error?.message || 'No message');
    if (error?.parent) {
      console.error('   Parent error:', error.parent.message);
      console.error('   Error code:', error.parent.code);
    }
    if (error?.original) {
      console.error('   Original error:', error.original.message);
      console.error('   Original code:', error.original.code);
    }
    console.error('   Full error:', error);
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

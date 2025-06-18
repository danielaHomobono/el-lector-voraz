const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('Variables de entorno cargadas:', Object.keys(process.env).filter(key => key.includes('MONGODB')));
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'el-lector-voraz'
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
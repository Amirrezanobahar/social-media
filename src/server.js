const app = require("./app");
const mongoose = require("mongoose");




// Database connection
async function connectToDB() {
  try {
   
    await mongoose.connect('mongodb://localhost:27017/social-media');
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (err) {
    console.error(`❌ Database connection failed: ${err.message}`);
    return false;
  }
}

async function startServer() {
  const port =  4002;
  
  const server = app.listen(port, () => {
    console.log(`🚀 Server running in mode on port ${port}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ Port ${port} is already in use`);
    } else {
      console.error('⚠️ Server error:', err.message);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('🛑 All connections closed. Process terminated.');
        process.exit(0);
      });
    });
  });
}

async function initializeApp() {
  try {
    console.log('⏳ Initializing application...');
    const dbConnected = await connectToDB();
    
    if (!dbConnected) {
      return process.exit(1);
    }

    startServer();
  } catch (err) {
    console.error("⛔ Application startup failed:", err.message);
    process.exit(1);
  }
}

initializeApp();
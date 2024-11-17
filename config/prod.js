export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://Avi:avi123@cluster0.qnxav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  dbName: process.env.DB_NAME || 'monday_db'
}

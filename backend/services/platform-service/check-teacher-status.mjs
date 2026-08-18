import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/school_crm_platform');
const teachers = mongoose.connection.db.collection('teachers');
const byStatus = await teachers
  .aggregate([{ $group: { _id: { status: '$status' }, count: { $sum: 1 } } }])
  .toArray();
console.log('teachers grouped by status:', byStatus);
await mongoose.disconnect();

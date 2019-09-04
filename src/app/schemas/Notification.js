import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String, // utilizamos os tipos primitivos do próprio JavaScript
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } // adiciona os campos 'created_at' e 'updated_at'
);

export default mongoose.model('Notification', NotificationSchema);

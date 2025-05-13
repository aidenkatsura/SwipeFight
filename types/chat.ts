import { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage: ChatMessage;
}
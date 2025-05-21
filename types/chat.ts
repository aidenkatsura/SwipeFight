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
  participants: {
    id: string;
    name: string;
    photo: string;
  }[];
  messages: ChatMessage[];
  unreadCounts: {
    [userId: string]: number;
  };
  lastMessage: ChatMessage;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage: ChatMessage;
}
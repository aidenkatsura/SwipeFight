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
  matchId: string;
  participants: {
    id: string;
    name: string;
    photo: string;
  }[];
  lastMessage: ChatMessage;
  unreadCount: number;
}
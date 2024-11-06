interface Message {
  chatId: number;
  content: string;
  id: number;
  sender: string;
  status: string;
  timestamp: string;
}

interface ChatItem {
  id: number;
  contactName: string;
  lastMessage: string;
  status: string;
}

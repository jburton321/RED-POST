import { MessageCircle } from 'lucide-react';
import { CHAT_URL } from '../lib/api';

export default function ChatLauncher() {
  if (!CHAT_URL) return null;

  return (
    <a
      href={CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="chat-launcher"
      aria-label="Open live chat"
    >
      <MessageCircle size={26} strokeWidth={2} />
    </a>
  );
}

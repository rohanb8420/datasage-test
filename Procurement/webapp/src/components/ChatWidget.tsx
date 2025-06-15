import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  fullPage?: boolean;
}
const ChatWidget: React.FC<ChatWidgetProps> = ({ fullPage = false }) => {
  const [open, setOpen] = useState(fullPage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen(prev => !prev);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);
  useEffect(() => {
    if (fullPage) {
      setOpen(true);
    }
  }, [fullPage]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className={
            fullPage
              ? 'flex flex-col w-full h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg'
              : 'fixed bottom-20 right-4 w-80 max-h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg flex flex-col'
          }
        >
          <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium text-gray-800 dark:text-gray-100">Sage</h2>
            <button onClick={toggleOpen} className="focus:outline-none">
              <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 p-2 overflow-auto space-y-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-full whitespace-pre-wrap break-words p-2 rounded ${
                  m.role === 'user'
                    ? 'bg-blue-100 text-blue-800 self-end'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start'
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="italic text-gray-500 dark:text-gray-400">Sage is thinking...</div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={2}
              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring"
              placeholder="Ask me anything..."
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="mt-1 w-full bg-blue-600 text-white rounded px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
      {!fullPage && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
          title="Ask Sage"
        >
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default ChatWidget;
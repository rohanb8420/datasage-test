import React from 'react';
import ChatWidget from '../components/ChatWidget';

const AIAssistantsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex flex-col items-center mb-4">
        <img src="/sage.png" alt="Sage" className="h-16 w-auto mb-2" />
        <h1 className="text-3xl font-bold">Ask Sage</h1>
      </div>
      <div className="flex-1">
        <ChatWidget fullPage />
      </div>
    </div>
  );
};

export default AIAssistantsPage;
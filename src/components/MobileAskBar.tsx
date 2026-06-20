'use client';
import { useState } from 'react';
import { sendToAssistant } from './Assistant/events';

export function MobileAskBar() {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const text = value.trim();
    if (!text) return;
    sendToAssistant(text);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-4 sm:pb-6 pointer-events-none">
      <div className="flex flex-col w-full rounded-2xl pointer-events-auto bg-white/90 dark:bg-[#0e0e0f]/90 border border-gray-200 dark:border-white/30 focus-within:border-[var(--primary)] dark:focus-within:border-[var(--primary)] transition-colors backdrop-blur-xl shadow-lg">
        <div className="relative flex items-end">
          <textarea
            id="chat-assistant-textarea"
            aria-label="Ask a question..."
            autoComplete="off"
            placeholder="Ask a question..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-0 peer/input text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 py-2.5 pl-3.5 pr-10 text-base"
            style={{ resize: 'none', height: '68px', fontSize: '16px' }}
          />
          <span className="absolute right-11 bottom-3 text-xs font-medium text-gray-400 dark:text-gray-500 select-none pointer-events-none peer-focus/input:hidden hidden sm:inline">
            ⌘I
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim()}
            aria-label="Send message"
            className="flex justify-center items-center rounded-full p-1 size-7 absolute right-2.5 bottom-2"
            style={{
              backgroundColor: value.trim()
                ? 'var(--primary)'
                : 'color-mix(in srgb, var(--primary) 30%, transparent)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white size-5"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

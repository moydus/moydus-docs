import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import useMessagesStore from './useMessagesStore';

const AI_API_URL = import.meta.env.PUBLIC_AI_API_URL ?? '/api/chat';

export const useAssistant = () => {
  const isClearedRef = useRef(false);
  const [input, setInput] = useState('');

  const { threadId, setThreadId, threadKey, setThreadKey } = useMessagesStore();

  useEffect(() => {
    sessionStorage.removeItem('assistant-threadKey');
    sessionStorage.removeItem('assistant-threadId');
    setThreadId(undefined);
    setThreadKey(undefined);
  }, []);

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    id: 'moydus-assistant',
    transport: new DefaultChatTransport({
      api: AI_API_URL,
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: { messages },
        };
      },
    }),
  });

  useEffect(() => {
    useMessagesStore.setState({ messages });
  }, [messages]);

  useEffect(() => {
    useMessagesStore.setState({ status });
  }, [status]);

  const isLoading = status === 'streaming' || status === 'submitted';

  const onClear = useCallback(() => {
    isClearedRef.current = true;
    stop();
    setMessages([]);
    setInput('');
    setThreadId(undefined);
    setThreadKey(undefined);
    sessionStorage.removeItem('assistant-threadKey');
    sessionStorage.removeItem('assistant-threadId');
    useMessagesStore.setState({ messages: [] });
  }, [stop, setMessages, setThreadId, setThreadKey]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || status !== 'ready') return;
    isClearedRef.current = false;
    sendMessage({ text: input });
    setInput('');
  }, [input, status, sendMessage]);

  return {
    input,
    status,
    handleSubmit,
    setInput,
    messages,
    setMessages,
    isLoading,
    onClear,
    stop,
    threadId,
  };
};

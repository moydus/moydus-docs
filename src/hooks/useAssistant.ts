import { useCompletion } from '@ai-sdk/react';
import type { UIMessage } from '@ai-sdk/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useMessagesStore from './useMessagesStore';

const AI_API_URL = import.meta.env.PUBLIC_AI_API_URL ?? '/api/chat';

function toUserMessage(text: string): UIMessage {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [{ type: 'text', text }],
  };
}

function toAssistantMessage(text: string): UIMessage {
  return {
    id: 'assistant-active',
    role: 'assistant',
    parts: [{ type: 'text', text }],
  };
}

export const useAssistant = () => {
  const isClearedRef = useRef(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<UIMessage[]>([]);

  const { threadId, setThreadId, threadKey, setThreadKey } = useMessagesStore();

  useEffect(() => {
    sessionStorage.removeItem('assistant-threadKey');
    sessionStorage.removeItem('assistant-threadId');
    setThreadId(undefined);
    setThreadKey(undefined);
  }, []);

  const { completion, complete, isLoading, stop, setCompletion } = useCompletion({
    api: AI_API_URL,
    streamProtocol: 'text',
  });

  const status = isLoading ? 'streaming' : 'ready';

  const messages = useMemo(() => {
    if (!completion) return history;
    return [...history, toAssistantMessage(completion)];
  }, [history, completion]);

  useEffect(() => {
    useMessagesStore.setState({ messages });
  }, [messages]);

  useEffect(() => {
    useMessagesStore.setState({ status });
  }, [status]);

  const onClear = useCallback(() => {
    isClearedRef.current = true;
    stop();
    setHistory([]);
    setCompletion('');
    setInput('');
    setThreadId(undefined);
    setThreadKey(undefined);
    sessionStorage.removeItem('assistant-threadKey');
    sessionStorage.removeItem('assistant-threadId');
    useMessagesStore.setState({ messages: [] });
  }, [stop, setCompletion, setThreadId, setThreadKey]);

  const handleSubmit = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    isClearedRef.current = false;
    const userMessage = toUserMessage(text);
    const nextHistory = [...history, userMessage];
    setHistory(nextHistory);
    setInput('');
    setCompletion('');

    await complete(text, {
      body: {
        messages: nextHistory.map((m) => ({
          role: m.role,
          content: m.parts
            .filter((p) => p.type === 'text')
            .map((p) => ('text' in p ? p.text : ''))
            .join(''),
        })),
      },
    });
  }, [input, isLoading, history, complete, setCompletion]);

  useEffect(() => {
    if (!isLoading && completion && !isClearedRef.current) {
      setHistory((prev) => [...prev, toAssistantMessage(completion)]);
      setCompletion('');
    }
  }, [isLoading, completion, setCompletion]);

  return {
    input,
    status,
    handleSubmit,
    setInput,
    messages,
    setMessages: setHistory,
    isLoading,
    onClear,
    stop,
    threadId,
  };
};

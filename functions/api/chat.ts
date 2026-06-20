interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function normalizeContent(message: Record<string, unknown>): string {
  if (typeof message.content === 'string') return message.content;
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p: { type?: string }) => p.type === 'text')
      .map((p: { text?: string }) => p.text ?? '')
      .join('');
  }
  return '';
}

function normalizeMessages(raw: unknown[]): Message[] {
  return raw
    .map((item) => {
      const message = item as Record<string, unknown>;
      const role = message.role as Message['role'];
      if (!role || role === 'system') return null;
      const content = normalizeContent(message).trim();
      if (!content) return null;
      return { role, content };
    })
    .filter((m): m is Message => m !== null);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as {
      messages?: unknown[];
      prompt?: string;
    };

    const rawMessages =
      body.messages ??
      (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    const messages = normalizeMessages(rawMessages);

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemMessage: Message = {
      role: 'system',
      content:
        'You are a helpful documentation assistant. Answer questions clearly and concisely based on documentation topics.',
    };

    const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      messages: [systemMessage, ...messages],
      stream: true,
    });

    return new Response(stream as ReadableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

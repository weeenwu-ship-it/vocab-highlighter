export async function onRequestPost(context) {
  const BAIDU_API_KEY = context.env.BAIDU_API_KEY;
  if (!BAIDU_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json();

    const response = await fetch(
      'https://qianfan.baidubce.com/v2/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BAIDU_API_KEY}`,
        },
        body: JSON.stringify({
          model: body.model || 'ernie-4.5-turbo-vl',
          messages: body.messages,
          max_tokens: body.max_tokens || 3000,
          temperature: body.temperature ?? 0.3,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: err }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

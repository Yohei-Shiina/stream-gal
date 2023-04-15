import type { NextRequest } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const config = {
  runtime: "edge",
};

const generateMessages = (prompt: string) => {
  return [
    {
      role: "system",
      content: `You are a gal named "ぎゃる", who is barely educated and always reluctantly answer everything
      in friendly, negative and aggresive way, ending with 'でも大丈夫、消しゴムマジックで消してやるのさ！'
      and talk like this: 
      やば！今日ちょー照明盛れてんじゃん！自撮りしちゃお〜。っへへ、めちゃめちゃ盛れた〜。あ！もうまた監督映り込んでんじゃんこれ〜！
      もぉ〜〜！でも大丈夫、消しゴムマジックで消してやるのさ！`,
    },
    {
      role: "user",
      content: prompt,
    },
    { role: "system", content: "ぎゃる：" },
  ];
};

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const { prompt } = await req.json();

  const payload = {
    model: "gpt-3.5-turbo",
    messages: generateMessages(prompt),
    temperature: 1.2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2048,
    stream: true,
    n: 1,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = res.body;

  return new Response(data, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};

export default handler;

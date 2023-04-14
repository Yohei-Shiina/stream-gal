import { useEffect, useRef, useState } from "react";

function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ from: "gal" | "mine"; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isError, setIsError] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);

  const timeoutIdRef = useRef<NodeJS.Timeout>();
  const countdownIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isError) {
      timeoutIdRef.current = setTimeout(() => {
        setIsError(false);
      }, 20000);

      countdownIdRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => {
        clearTimeout(timeoutIdRef.current);
        clearTimeout(countdownIdRef.current);
        setRemainingTime(20);
      };
    }
  }, [isError]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userInput == "" || userInput == null) return;

    setUserInput("");
    setMessages((prev) => [...prev, { from: "mine", content: userInput }]);
    setIsStreaming(true);

    const response = await fetch("/api/stream-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userInput,
      }),
    });

    if (!response.ok || response.body == null) {
      return;
    }
    setMessages((prev) => [...prev, { from: "gal", content: "" }]);

    const decoder = new TextDecoderStream();
    const reader = response.body.pipeThrough(decoder).getReader();

    const readStream = async () => {
      const { value, done } = await reader.read();

      if (done) {
        setIsStreaming(false);
        return;
      }

      const splittedData = value.split("\n\n").filter(Boolean);

      for (const data of splittedData) {
        const textData = data.replace("data: ", "");

        if (textData === "[DONE]") {
          setIsStreaming(false);
          break;
        }

        let parsedData;

        parsedData = JSON.parse(textData);

        if (parsedData.error) {
          console.error(parsedData.error.message);
          setMessages((prev) => {
            prev[prev.length - 1].content =
              "20秒くらい黙らないと消しゴムマジックで消してやるぞ〜、へへっ";
            return prev;
          });
          setIsStreaming(false);
          setIsError(true);
          return;
        }

        const choice = parsedData.choices[0];
        if (choice == null || choice.delta.content == null) {
          continue;
        }
        const content = choice.delta.content;

        setMessages((prev) => {
          const lastContent = prev[prev.length - 1].content;
          const newContent = lastContent + content;
          const lastMessage = prev[prev.length - 1];
          lastMessage.content = newContent;
          return [...prev];
        });
      }
      await readStream();
    };
    await readStream();
    setIsStreaming(false);
  };

  return (
    <div className="container">
      <div className="service-name">すとり〜む ぎゃる</div>
      <p>{isError && remainingTime}</p>
      <div className="chat-container">
        <form className="chat-container__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input chat-container__form-input"
            name="userInput"
            placeholder="暇じゃない？なんか話して！"
            value={userInput}
            onChange={handleChange}
            disabled={isError}
          />
          <input
            type="submit"
            disabled={isStreaming || isError}
            className="form-input chat-container__form-submit"
            value="talk"
          />
        </form>
        {messages.map((message, index) => {
          return (
            <div key={index} className={`message chat-container__message--${message.from}`}>
              <p className="message__text">
                <span className="message-gal">
                  {message.from === "gal" ? "ぎゃる" : "あなた"}：
                </span>
                {message.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;

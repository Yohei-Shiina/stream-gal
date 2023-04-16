import { useEffect, useRef, useState } from "react";

function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ from: "gal" | "mine"; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isError, setIsError] = useState(false);

  const timeoutIdRef = useRef<NodeJS.Timeout>();
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList !== null) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isError) {
      timeoutIdRef.current = setTimeout(() => {
        setIsError(false);
      }, 20000);

      return () => {
        clearTimeout(timeoutIdRef.current);
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

    let incompleteStr = "";
    const readStream = async () => {
      const { value, done } = await reader.read();
      console.log({ value });

      if (done) {
        return;
      }

      const splittedData = value.split("\n\n").filter(Boolean);

      console.log({ splittedData });
      console.log({ incompleteStr });

      if (incompleteStr) {
        splittedData[0] = incompleteStr + splittedData[0];
        incompleteStr = "";
      }

      for (const data of splittedData) {
        const textData = data.replace("data: ", "");

        if (textData === "[DONE]") {
          setIsStreaming(false);
          break;
        }

        let parsedData;

        try {
          parsedData = JSON.parse(textData);
        } catch (error) {
          incompleteStr = textData;
          continue;
        }

        if (parsedData.error) {
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
      <div className="chat-container">
        <form className="chat-container__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="form-input chat-container__form-input"
            name="userInput"
            placeholder="自撮りの話して！"
            value={userInput}
            onChange={handleChange}
            disabled={isError}
          />
          <input
            type="submit"
            disabled={!userInput || isStreaming || isError}
            className="form-input chat-container__form-submit"
            value="話す"
          />
        </form>
        <div ref={messageListRef} className="chat-container__history">
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

      <ul className="description-list">
        <li className="description-list__item">
          ギャル風に話します。教育はほとんど受けていません。
        </li>
        <li className="description-list__item">
          ネガティブでだるそうに話しますが、実はフレンドリーです。
        </li>
        <li className="description-list__item">全てを消しゴムマジックで消そうとします。</li>
        <li className="description-list__item">過去の会話を覚えてくれません。</li>
        <li className="description-list__item">
          APIの使用上限があるので、使えない時はごめんなさい。
        </li>
        <li className="description-list__item--important">※個人情報は入れないでね。</li>
      </ul>
    </div>
  );
}

export default HomePage;

import { useState } from "react";

function HomePage() {
  const [uesrInput, setUserInput] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <div className="container">
      <div className="service-name">すとり〜む ぎゃる</div>
      <div className="chat-container">
        <form className="chat-container__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input chat-container__form-input"
            name="userInput"
            placeholder="暇じゃない？なんか話して！"
            value={uesrInput}
            onChange={handleChange}
          />
          <input type="submit" className="form-input chat-container__form-submit" value="talk" />
        </form>
        <div className="message chat-container__message--mine">
          <p className="message__text">あなた：今の日本についてどう思う？</p>
        </div>
        <div className="message chat-container__message--gal">
          <p className="message__text">
            <span className="message-gal">ぎゃる：</span>
            今の日本って、ね、とっても多様性があるのよね〜！でも、その一方で、格差や孤独死などの問題もあるのよ〜。でも大丈夫、私たちはみんなで協力して、もっと楽しくてハッピーな社会をつくるのだわ〜！ワクワクしちゃうね〜！
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

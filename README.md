# すとり〜むぎゃる
これは、OpenAIの技術に触れるためにテスト用に開発したAIチャットボットです。

https://stream-gal.vercel.app/

## なぜ すとりーむ なのか？
API 呼び出しで返却される値の全ての結果がそろうのを待つのではなく、

ストリーム形式で利用可能になったものから返却される細かい値をリアルタイムで表示できるようにしている。

[詳しくはこちら](https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream)

# はじめに
まずプロジェクトをクローンします。
```
git clone https://github.com/Yohei-Shiina/stream-gal.git
```

ルートディレクトリに `.env` ファイルを作成し、環境変数 `OPENAI_API_KEY` を以下のように追加します。
```
OPENAI_APY_KEY=<Your OpenAI API key here>
```

まだ持っていない場合は、[ここで](https://platform.openai.com/account/api-keys) OpenAI の API key を生成できます。

# 開発サーバーを起動します：
```
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで http://localhost:3000 を開いて結果を確認します。

`pages/index.tsx` や `pages/api/stream-chat.tsx`を編集することでページを編集できます。ファイルを編集するとページが自動更新されます。

# リポジトリで使用している OpenAI API については、以下のリソースをご覧ください：
https://platform.openai.com/docs/guides/chat
https://platform.openai.com/docs/api-reference/chat/create?lang=curl

# このプロジェクトでは以下のものを使用しています：
Next.js
React
Typescript

Vercel にデプロイしています。

# Stream Gal
This is an AI chatbot that I developed for testing to get in touch with OpenAI’s technology.

https://stream-gal.vercel.app/

## Why stream?
Because it calls the api and receives the result in a stream format instead of waiting for the completion, so the users can see the AI's response in real time.

# Getting Started

First, create a `.env` file in the root directory and add the environment variable OPENAI_API_KEY as follows.
```
OPENAI_APY_KEY=<Your OpenAI API key here>
```

You can generate your OpenAI API key [here](https://platform.openai.com/account/api-keys) in case you don't have one yet.

Run the development server:

```
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx` or `pages/api/stream-chat.tsx `. The page auto-updates as you edit the file.

# To learn more about OpenAI API, take a look at the following respirces:
- https://platform.openai.com/docs/guides/chat
- https://platform.openai.com/docs/api-reference/chat/create?lang=curl

# This project uses the following :
- Next.js
- React
- Typescript

Deployed on Vercel

 # js-sdk2-browser-phone

 ## 概要
 Twilio JavaScript SDK (v2.x) を利用して、ブラウザ上で電話の発着信を行うサンプルアプリケーションです。
 - フロントエンド: `assets` フォルダに配置された HTML/JavaScript
 - サーバーサイド: `functions` フォルダ内の Twilio Functions（アクセストークン発行、TwiML生成）

Twilio JavaScript SDK (v2.x) を使った最低限の機能だけを実装したコードなので、UIなどは何も作り込んでいません。
シンプルにSDKの実装や動作を見るためのものです。

 ## フォルダ構成
 ```
 .
 ├─ assets/
 │   ├─ index.html     # ブラウザUI
 │   ├─ app.js         # 通話ロジック
 │   └─ twilio.min.js  # Twilio SDK
 ├─ functions/
 │   ├─ token.js       # アクセストークン発行エンドポイント (/token)
 │   └─ voice.js       # TwiML生成エンドポイント (/voice)
 ├─ package.json
 └─ README.md
 ```

 ## 必要要件
 - Node.js v18
 - npm
 - Twilioアカウント
 - Twilio CLI（`twilio` コマンド）および Serverless Plugin（`@twilio-labs/plugin-serverless`）

 ## 環境変数の設定
 プロジェクトルートに `.env` ファイルを作成し、以下を設定してください:
 ```ini
 ACCOUNT_SID=あなたのアカウントSID
 API_KEY_SID=あなたのAPI Key SID
 API_KEY_SECRET=あなたのAPI Key Secret
 TWIML_APP_SID=あなたのTwiMLアプリSID
 CALLER_ID=発信者番号（e.g. +81XXXXXXXXXX）
 ```

 Twilio Functionsはこれらの値を `context` 経由で参照します。

 ## インストール
 ```bash
 git clone <リポジトリURL>
 cd js-sdk2-browser-phone
 npm install
 ```

 ## 操作方法
 1. 「相手の電話番号」欄に発信先の電話番号を入力  
 2. [発信] ボタンをクリックすると通話発信  
 3. [切断] ボタンで通話終了  
 4. 着信時はダイアログで応答/拒否を選択

 ## デプロイ
 Twilio CLIにログインし、Serverless Pluginを導入後、以下でデプロイできます:
 ```bash
 # Twilio CLIログイン（初回のみ）
 twilio login
 # Plugin導入（初回のみ）
 twilio plugins:install @twilio-labs/plugin-serverless
 # デプロイ
 twilio serverless:deploy

 ```
 デプロイ後、表示されたドメイン（例: `xxxxx-dev.twil.io`）でアプリを利用可能です。

 ## 参考
 - Twilio Voice SDK ドキュメント: https://www.twilio.com/docs/voice/sdks/browser  
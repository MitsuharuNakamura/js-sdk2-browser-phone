let device;
const token_url = '/token';
async function initializeDevice() {
  updateStatus("デバイスの初期化処理");
  try {
    const response = await fetch(token_url);
    const data = await response.json();

    device = new Twilio.Device(data.token, {
      allowIncomingWhileBusy: false, //自分がすでに通話中（busy）でも、新たに着信を受け付けるかどうか
      closeProtection: true, //ブラウザタブを閉じたり、ページをリロードしようとしたときに、警告メッセージを出して通話が切断されるのを防ぐためのオプション
      enableImprovedSignalingErrorPrecision: true, //シグナリングエラー（通話を開始・維持するための通信エラー）について、より詳しく・正確なエラー情報を取得できるようにする
      edge: ['tokyo','singapore'],
      logLevel: 1,
      codecPreferences: ['opus', 'pcmu'],
    });

    device.on("registered", function () {
      updateStatus("初期化処理完了");

    });
    device.register();

    // Incomoing Callの処理は、UI側がなど未実装なんで、将来的に追加する予定 -- ここから
    device.on("incoming", (call) => {
      updateStatus("📲 着信があります");
      // UIで受話・拒否ボタンを表示させる処理など（任意）
      // showIncomingCallUI(call);      
      // 自分が応答したら（＝通話開始）
      call.on("accept", () => {
        updateStatus("通話開始（自分が応答）");
      });
      // 相手が切断 or 自分が切断した場合
      call.on("disconnect", () => {
        updateStatus("通話終了");
      });
      // エラー処理
      call.on("error", (error) => {
        console.error("通話エラー:", error);
        updateStatus("通話中にエラーが発生しました");
      });
    });
    // Incomoing Callの処理は、UI側がなど未実装なんで、将来的に追加する予定　 -- ここまで

  } catch (err) {
    console.error('Failed to initialize device', err);
    updateStatus('初期化失敗');
  } 
}

// Outbound Callの処理
async function makeCall() {
  const number = document.getElementById('phone-number').value;
  if (device) {
    const call = await device.connect({ params: { To: number} }); 
    // callオブジェクトにイベントリスナーを設定
    call.on('ringing', hasEarlyMedia => {
      updateStatus('呼び出しを開始');
      if (!hasEarlyMedia) {
        //音声をカスタマイズする関数を追加する
      }
    }); 
    call.on('accept', call => { //answerOnBridge: trueをTwiMLに入れることで、ちゃんと相手が出た時にイベントが発生する
      updateStatus('通話開始');
    });
    call.on('cancel', () => {
      updateStatus('通話がキャンセルされました');
    });
    call.on('reject', () => {
      updateStatus('通話が拒否されました。');
     });
    call.on('disconnect', () => {
      updateStatus('通話が切断されました');
    });
    call.on('error', (error) => {
      console.log('An error has occurred: ', error);
      updateStatus('エラーが発生しました。');
    });
  }
}

function hangUp() {
  if (device) {
    device.disconnectAll();
  }
}

function updateStatus(message) {
  document.getElementById('status').innerText = message;
}

// 新しく追加した「Tokenを定期的に更新する関数」
async function refreshToken() {
  try {
    const response = await fetch(token_url);
    const data = await response.json();

    if (device) {
      await device.updateToken(data.token);
      console.log('トークンを更新しました');
      updateStatus('トークン更新完了');
    }
  } catch (error) {
    console.error('トークン更新失敗:', error);
    updateStatus('トークン更新失敗');
  }
}


// ページ読み込み時にデバイス初期化
initializeDevice();
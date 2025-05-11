let device;
const token_url = '/token';
async function initializeDevice() {
  updateStatus("初期化処理開始");
  console.log("初期化処理開始");
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
      console.log("Registered.")
    });
    device.register();

  } catch (err) {
    console.error('Failed to initialize device', err);
    updateStatus('初期化失敗');
  }
}

async function makeCall() {
  const number = document.getElementById('phone-number').value;
  if (device) {
    const call = await device.connect({ params: { To: number } }); 
    // callオブジェクトにイベントリスナーを設定
    call.on('accept', call => {
      updateStatus('通話を開始');
    });
    call.on('ringing', hasEarlyMedia => {
      updateStatus('呼び出し中・・・');
      if (!hasEarlyMedia) {
        //音声をカスタマイズする関数を追加する
      }
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
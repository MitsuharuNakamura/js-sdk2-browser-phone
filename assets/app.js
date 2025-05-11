let device;
const token_url = 'https://js-sdk2-browser-phone-7481-dev.twil.io/token';
async function initializeDevice() {
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

    device.on('ready', () => {
      updateStatus('デバイス準備完了');
    });

    device.on('registered', device => {
      console.log('デバイスが受電の準備ができました')
    });
    
    device.on('error', (error) => {
      console.error('Device Error:', error);
      updateStatus(`エラー: ${error.message}`);
    });

    device.on('incoming', (connection) => {
      if (confirm('着信があります。応答しますか？')) {
        connection.accept();
        updateStatus('通話中');
      } else {
        connection.reject();
        updateStatus('着信拒否');
      }
    });

    device.on('connect', () => {    
      updateStatus('通話中');
    });

    device.on('disconnect', () => {
      updateStatus('切断されました');
    });

  } catch (err) {
    console.error('Failed to initialize device', err);
    updateStatus('初期化失敗');
  }
}

function makeCall() {
  const number = document.getElementById('phone-number').value;
  if (device) {
    device.connect({ params: { To: number } }); 
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
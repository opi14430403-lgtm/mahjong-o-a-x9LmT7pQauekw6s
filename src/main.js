const correctHash = import.meta.env.VITE_PASSWORD_HASH;

async function sha256(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const diaries = {
  "1": "<h2>日記1</h2><p>今日は良い天気だった。</p>",
  "2": "<h2>日記2</h2><p>麻雀で倍満をあがった。</p>",
  "3": "<h2>日記3</h2><p>静かな一日だった。</p>"
};

function showMenu() {
  let html = "<h1>日記一覧</h1><ul>";
  for (let key in diaries) {
    html += `<li><a href="#" onclick="openDiary('${key}')">日記${key}</a></li>`;
  }
  html += "</ul>";
  document.getElementById("app").innerHTML = html;
}

window.openDiary = function(id) {
  document.getElementById("app").innerHTML =
    diaries[id] + '<br><br><button onclick="showMenu()">戻る</button>';
};

async function start() {
  const input = prompt("パスワードを入力してください");
  const hash = await sha256(input);

  if (hash.startsWith(correctHash)) {
    showMenu();
  } else {
    document.body.innerHTML = "<h1>アクセス拒否</h1>";
  }
}

start();

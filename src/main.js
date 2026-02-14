const correctHash = import.meta.env.VITE_PASSWORD_HASH;
let bandiera = [];

async function loadBook() {
  const res = await fetch(import.meta.env.BASE_URL + "bandiera.json");
  bandiera = await res.json();
}

async function sha256(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ===== バンディエラ =====
const book1 = {
  title: "バンディエラ",
  get pages() {
    return bandiera;
  }
};

// ===== UI =====

function showBooks() {
  document.getElementById("app").innerHTML = `
    <h1>日記一覧</h1>
    <button onclick="openBook()">バンディエラ</button>
  `;
}

window.openBook = function (pageGroup = 0) {
  const pagesPerGroup = 10;
  const startIndex = pageGroup * pagesPerGroup;
  const endIndex = startIndex + pagesPerGroup;
  const displayPages = book1.pages.slice(startIndex, endIndex);

  let html = `<h1>${book1.title}</h1><p>${startIndex + 1}～${Math.min(endIndex, book1.pages.length)}ページ</p>`;

  displayPages.forEach(page => {
    html += `
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
        <h3>${page.number}ページ</h3>
        <div>${page.content}</div>
      </div>
    `;
  });

  html += "<br>";

  // ナビゲーションボタン
  if (pageGroup > 0) {
    html += `<button onclick="openBook(${pageGroup - 1})">前へ</button>`;
  }
  if (endIndex < book1.pages.length) {
    html += `<button onclick="openBook(${pageGroup + 1})">次へ</button>`;
  }

  html += "<br><br><button onclick='showBooks()'>戻る</button>";

  document.getElementById("app").innerHTML = html;
};

window.openPage = function (pageNumber) {
  const page = book1.pages.find(p => p.number === pageNumber);

  document.getElementById("app").innerHTML = `
    ${page.content}
    <br><br>
    <button onclick="openBook()">目次へ戻る</button>
  `;
};

// ===== パスワードチェック =====
async function start() {
  await loadBook();

  const input = prompt("パスワードを入力してください");
  const hash = await sha256(input);

  if (hash === correctHash) {
    showBooks();
  } else {
    document.body.innerHTML = "<h1>アクセス拒否</h1>";
  }
}

start();

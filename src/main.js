const correctHash = import.meta.env.VITE_PASSWORD_HASH;

async function sha256(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ===== 第1巻（500ページ） =====
const book1 = {
  title: "第1巻",
  pages: bandiera
};


// ===== UI =====

function showBooks() {
  document.getElementById("app").innerHTML = `
    <h1>日記一覧</h1>
    <button onclick="openBook()">第1巻</button>
  `;
}

window.openBook = function () {
  let html = `<h1>${book1.title}</h1><ul>`;

  book1.pages.forEach(page => {
    html += `
      <li>
        <button onclick="openPage(${page.number})">
          ${page.number}ページ
        </button>
      </li>
    `;
  });

  html += "</ul><br><button onclick='showBooks()'>戻る</button>";

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
  const input = prompt("パスワードを入力してください");
  const hash = await sha256(input);

  if (hash === correctHash) {
    showBooks();
  } else {
    document.body.innerHTML = "<h1>アクセス拒否</h1>";
  }
}

start();

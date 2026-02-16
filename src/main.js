const correctHash = import.meta.env.VITE_PASSWORD_HASH;

async function loadBook(fileName) {
  const res = await fetch(import.meta.env.BASE_URL + fileName);
  return await res.json();
}

async function sha256(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ===== ブック定義 =====
const books = [
  { title: "バンディエラ", fileName: "bandiera.json", pages: [] },
  { title: "バンディエラdue", fileName: "bandiera_due.json", pages: [] },
  { title: "バンディエラtre", fileName: "bandiera_tre.json", pages: [] },
  { title: "オピオイド", fileName: "opioid.json", pages: [] },
  { title: "屋烏の愛", fileName: "oku.json", pages: [] },
  { title: "愛を下さいこの通り", fileName: "manashita.json", pages: [] },
  { title: "Minesweeper", fileName: "Minesweeper.json", pages: [] },
  { title: "フルーツバスケット", fileName: "fruits_basket.json", pages: [] }
];

// ===== UI =====

function showBooks() {
  let html = `<h1>日記一覧</h1>`;
  books.forEach((book, index) => {
    html += `
      <button onclick="openBook(${index})" style="
        display: block;
        width: 90%;
        padding: 20px;
        margin: 15px auto;
        font-size: 18px;
        font-weight: bold;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      " 
      onmouseover="this.style.backgroundColor='#0056b3'; this.style.transform='scale(1.05)';"
      onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';">
        ${book.title}
      </button>
    `;
  });
  document.getElementById("app").innerHTML = html;
}

window.openBook = function (bookIndex = 0, pageGroup = 0) {
  const book = books[bookIndex];
  
  // 既存のopioid CSSを削除
  const existingCss = document.getElementById("opioid-css");
  if (existingCss) {
    existingCss.remove();
  }
  
  // オピオイド（bookIndex === 3）の場合、CSSを読み込む
  if (bookIndex === 3) {
    const link = document.createElement("link");
    link.id = "opioid-css";
    link.rel = "stylesheet";
    link.href = import.meta.env.BASE_URL + "opioid/style.css";
    document.head.appendChild(link);
  }

  const pagesPerGroup = 10;
  const startIndex = pageGroup * pagesPerGroup;
  const endIndex = startIndex + pagesPerGroup;
  const displayPages = book.pages.slice(startIndex, endIndex);

  // ページグループのジャンプボタンを作成
  let jumpButtons = "";
  const totalPageGroups = Math.ceil(book.pages.length / pagesPerGroup);
  for (let i = 0; i < totalPageGroups; i++) {
    const pageNum = i * pagesPerGroup + 1;
    if (i === pageGroup) {
      jumpButtons += `<strong>${pageNum}</strong>, `;
    } else {
      jumpButtons += `<button onclick="openBook(${bookIndex}, ${i})" style="background: none; border: none; color: blue; cursor: pointer; text-decoration: underline; padding: 0; margin: 0; font: inherit;">${pageNum}</button>, `;
    }
  }
  jumpButtons = jumpButtons.slice(0, -2); // 最後のコンマを削除

  // 他の日記へのジャンプボタンを作成
  let bookJumpButtons = "";
  books.forEach((b, index) => {
    if (index === bookIndex) {
      bookJumpButtons += `<strong>${b.title}</strong>, `;
    } else {
      bookJumpButtons += `<button onclick="openBook(${index})" style="background: none; border: none; color: blue; cursor: pointer; text-decoration: underline; padding: 0; margin: 0; font: inherit;">${b.title}</button>, `;
    }
  });
  bookJumpButtons = bookJumpButtons.slice(0, -2); // 最後のコンマを削除

  let html = `<p>${bookJumpButtons}</p><h1>${book.title}</h1><p>${jumpButtons}</p><p>${startIndex + 1}～${Math.min(endIndex, book.pages.length)}ページ</p>`;

  displayPages.forEach(page => {
    html += `
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
        <div>${page.content}</div>
      </div>
    `;
  });

  html += "<br>";

  // ナビゲーションボタン
  if (pageGroup > 0) {
    html += `<button onclick="openBook(${bookIndex}, ${pageGroup - 1})">前へ</button>`;
  }
  if (endIndex < book.pages.length) {
    html += `<button onclick="openBook(${bookIndex}, ${pageGroup + 1})">次へ</button>`;
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
  // すべてのブックをロード
  for (let i = 0; i < books.length; i++) {
    books[i].pages = await loadBook(books[i].fileName);
  }

  const input = prompt("パスワードを入力してください");
  const hash = await sha256(input);

  if (hash === correctHash) {
    showBooks();
  } else {
    document.body.innerHTML = "<h1>アクセス拒否</h1>";
  }
}

start();

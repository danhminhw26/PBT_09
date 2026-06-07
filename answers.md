# PHIẾU BÀI TẬP 09 - ANSWERS

## DOM MANIPULATION & EVENTS

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### Câu A1 (5đ) — DOM Tree

#### 1. DOM Tree (Sơ đồ cây):

```
#app
├── header
│   ├── h1 ("Todo App")
│   └── nav
│       ├── a.active ("#")
│       ├── a ("#")
│       └── a ("#")
├── main
│   ├── form#todoForm
│   │   ├── input#todoInput
│   │   └── button (submit)
│   └── ul#todoList
│       ├── li.todo-item ("Learn HTML")
│       └── li.todo-item.completed ("Learn CSS")
```

#### 2. querySelector Selectors:

```javascript
// 1. Chọn thẻ <h1>
document.querySelector("h1");
// hoặc
document.querySelector("#app h1");

// 2. Chọn input trong form
document.querySelector("#todoForm input");
// hoặc
document.querySelector("#todoInput");

// 3. Chọn tất cả .todo-item
document.querySelectorAll(".todo-item");

// 4. Chọn link đang active
document.querySelector("a.active");
// hoặc
document.querySelector("nav a.active");

// 5. Chọn <li> đầu tiên trong #todoList
document.querySelector("#todoList li");
// hoặc
document.querySelector("#todoList li:first-child");

// 6. Chọn tất cả <a> bên trong <nav>
document.querySelectorAll("nav a");
// hoặc
document.querySelectorAll("nav > a");
```

---

### Câu A2 (5đ) — innerHTML vs textContent

#### Sự khác nhau:

| Tính năng        | innerHTML              | textContent        |
| ---------------- | ---------------------- | ------------------ |
| **HTML parsing** | ✅ Phân tích HTML tags | ❌ Không phân tích |
| **Output**       | Nội dung + thẻ HTML    | Chỉ text thuần     |
| **Script tags**  | ⚠️ Có thể thực thi     | ❌ Không thực thi  |
| **XSS risk**     | 🔴 Cao                 | 🟢 Thấp            |
| **Performance**  | Chậm hơn (parse HTML)  | Nhanh hơn          |

#### Ví dụ:

```javascript
const div = document.querySelector("div");

// HTML
div.innerHTML = "<strong>Bold Text</strong>";
// Output: div chứa thẻ <strong>

// textContent
div.textContent = "<strong>Bold Text</strong>";
// Output: div chứa text "<strong>Bold Text</strong>" (không phân tích HTML)
```

#### Khi nào dùng:

- **innerHTML**: Khi cần render HTML content (từ trusted source), tạo DOM structure phức tạp
- **textContent**: Khi chỉ cần set/get text thuần, update thông tin không có HTML

#### Bảo mật - XSS Vulnerability:

**Nguy hiểm:** `innerHTML` có thể thực thi malicious code nếu user nhập dữ liệu không được sanitize.

**Ví dụ minh họa:**

```javascript
// ❌ NGUY HIỂM - XSS Attack
const userInput = document.querySelector("#search").value;
// User nhập: <img src=x onerror="alert('Hacked!')">
document.querySelector("#result").innerHTML = userInput;
// → onclick img tag → trigger onerror → execute JS → alert xuất hiện

// ✅ CÁCH SỬA #1: Dùng textContent
document.querySelector("#result").textContent = userInput;
// → text được escaped, không thực thi code

// ✅ CÁCH SỬA #2: Sanitize HTML trước khi set innerHTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
document.querySelector("#result").innerHTML = escapeHtml(userInput);

// ✅ CÁCH SỬA #3: Dùng library sanitize (DOMPurify)
document.querySelector("#result").innerHTML = DOMPurify.sanitize(userInput);

// ✅ CÁCH SỬA #4: Dùng createTextNode
const resultEl = document.querySelector("#result");
resultEl.innerHTML = "";
resultEl.appendChild(document.createTextNode(userInput));
```

**Best Practice:** Luôn sanitize user input trước khi set `innerHTML`. Ưu tiên dùng `textContent` cho text thuần.

---

### Câu A3 (5đ) — Event Bubbling

#### Code Analysis:

```javascript
document.querySelector("#outer").addEventListener("click", () => {
  console.log("OUTER");
});

document.querySelector("#inner").addEventListener("click", () => {
  console.log("INNER");
});

document.querySelector("#btn").addEventListener("click", (e) => {
  console.log("BUTTON");
  // e.stopPropagation();
});
```

#### HTML Structure:

```html
<div id="outer">
  <!-- Level 3 -->
  <div id="inner">
    <!-- Level 2 -->
    <button id="btn">Click me</button>
    <!-- Level 1 -->
  </div>
</div>
```

#### Output Khi Click Button:

**Không có `stopPropagation()`:**

```
BUTTON
INNER
OUTER
```

**Giải thích:** Event bubbling từ dưới lên:

1. Click #btn → log "BUTTON"
2. Event bubble lên #inner → log "INNER"
3. Event bubble lên #outer → log "OUTER"

---

**Nếu uncomment `stopPropagation()`:**

```
BUTTON
```

**Giải thích:**

- `e.stopPropagation()` ngăn event bubbling
- Event dừng ngay sau khi execute listener trên #btn
- INNER và OUTER không được trigger

---

#### Chú ý khác biệt:

```javascript
// stopPropagation() - ngăn bubbling (event vẫn trigger trên cùng element)
e.stopPropagation();

// preventDefault() - ngăn default behavior (ví dụ form submit)
e.preventDefault();

// stopImmediatePropagation() - ngăn các listener khác trên cùng element
e.stopImmediatePropagation();
```

---

## PHẦN C — DEBUG & PHÂN TÍCH

### Câu C1 (8đ) — Debug DOM Code

#### Tìm các lỗi (ít nhất 7 lỗi):

**Code gốc có lỗi:**

```javascript
// ❌ Lỗi 1: Sử dụng addEventListener("onclick", ...) sai
document
  .querySelector("#decrementBtn")
  .addEventListener("onclick", function () {
    count--;
    countDisplay.innerHTML = count;
  });
// ✅ Sửa: Event name là "click", không phải "onclick"
document.querySelector("#decrementBtn").addEventListener("click", function () {
  count--;
  countDisplay.innerHTML = count;
});

// ❌ Lỗi 2: Gán giá trị cho DOM element thay vì innerText/textContent
countDisplay.innerHTML = count; // ← document.querySelector element
// ✅ Sửa:
countDisplay.textContent = count;
// Hoặc
countDisplay.innerHTML = count; // ← count là primitive, không phải HTML

// ❌ Lỗi 3: Gán giá trị cho element thay vì property
countDisplay = count; // ← countDisplay là DOM element
// ✅ Sửa:
countDisplay.textContent = count;

// ❌ Lỗi 4: item.remove là method cần gọi, không phải property
items.forEach((item) => {
  item.remove; // ← Không gọi function
});
// ✅ Sửa:
items.forEach((item) => {
  item.remove(); // ← Gọi function với ()
});

// ❌ Lỗi 5: localStorage.getItem() trả về string, cần convert
count = localStorage.getItem("count"); // ← "123" (string)
countDisplay.textContent = count; // ← Hiện "123" nhưng kiểu string
count++; // ← "1231" (string concatenation!)
// ✅ Sửa:
count = parseInt(localStorage.getItem("count")) || 0;
// Hoặc
count = Number(localStorage.getItem("count")) || 0;

// ❌ Lỗi 6: localStorage.getItem("history") chứa HTML, không phải JSON
localStorage.setItem("history", historyList.innerHTML);
// Load lại trang sẽ bị innerHTML injection
window.addEventListener("load", () => {
  historyList.innerHTML = localStorage.getItem("history"); // ← Risky
});
// ✅ Sửa: Lưu array JSON thay vì HTML
// Khi save:
const historyData = Array.from(historyList.querySelectorAll("li")).map(
  (li) => ({
    id: li.dataset.id,
    text: li.textContent,
  }),
);
localStorage.setItem("history", JSON.stringify(historyData));

// Load:
const historyData = JSON.parse(localStorage.getItem("history")) || [];
historyData.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item.text;
  historyList.appendChild(li);
});

// ❌ Lỗi 7: historyList.innerHTML = null không xóa (null → "null" string)
historyList.innerHTML = null; // ← Hiển thị "null" text
// ✅ Sửa:
historyList.innerHTML = ""; // ← String rỗng
// Hoặc
historyList.textContent = "";
// Hoặc
while (historyList.firstChild) {
  historyList.removeChild(historyList.firstChild);
}

// ❌ Lỗi 8: Không check element tồn tại trước khi thêm listener
// Nếu #clearHistory không tồn tại → querySelector trả null → error
document.querySelector("#clearHistory").addEventListener("click", () => {
  // ...
});
// ✅ Sửa:
const clearBtn = document.querySelector("#clearHistory");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    // ...
  });
}
```

#### Code sửa hoàn chỉnh:

```javascript
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

let count = 0;

document.querySelector("#incrementBtn").addEventListener("click", function () {
  count++;
  countDisplay.textContent = count;

  const li = document.createElement("li");
  li.textContent = "Count changed to " + count;
  li.addEventListener("click", function () {
    deleteHistory(this);
  });
  historyList.appendChild(li);
});

document.querySelector("#decrementBtn").addEventListener("click", function () {
  count--;
  countDisplay.textContent = count;
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  count = 0;
  countDisplay.textContent = count;
  historyList.innerHTML = "";
});

function deleteHistory(element) {
  element.remove();
}

document.querySelector("#clearHistory")?.addEventListener("click", () => {
  const items = historyList.querySelectorAll("li");
  items.forEach((item) => {
    item.remove();
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("count", count);
  localStorage.setItem(
    "history",
    JSON.stringify(
      Array.from(historyList.querySelectorAll("li")).map(
        (li) => li.textContent,
      ),
    ),
  );
});

window.addEventListener("load", () => {
  count = parseInt(localStorage.getItem("count")) || 0;
  countDisplay.textContent = count;

  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    li.addEventListener("click", function () {
      deleteHistory(this);
    });
    historyList.appendChild(li);
  });
});
```

---

### Câu C2 (7đ) — Performance

#### 1. Tại sao binding event lên 1000 elements riêng lẻ là BAD PRACTICE?

**Vấn đề:**

```javascript
// ❌ BAD - Bind event lên từng element
const items = document.querySelectorAll(".item");
items.forEach((item) => {
  item.addEventListener("click", handleClick); // 1000 listeners
});
```

**Hậu quả:**

- **Memory leak**: 1000 event listeners occupies O(n) memory
- **Performance**: Browser phải track 1000 listeners
- **Maintenance**: Khó update logic khi có dynamic elements
- **DOM manipulation**: Thêm/xóa element phải bind/unbind listener

**Event Delegation giải quyết thế nào:**

```javascript
// ✅ GOOD - Dùng Event Delegation
const container = document.querySelector(".container");
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("item")) {
    handleClick(e); // Chỉ 1 listener trên container
  }
});
```

**Lợi ích:**

- **Memory efficient**: 1 listener thay vì 1000
- **Performance**: JavaScript execution nhanh hơn
- **Scalability**: Dynamic elements tự động được cover
- **Maintenance**: Code đơn giản, dễ bảo trì

**Ví dụ comparison:**

```javascript
// ❌ Without Event Delegation (Slow)
// 10ms × 1000 = 10 seconds!
for (let i = 0; i < 1000; i++) {
  document.querySelector(`#item-${i}`).addEventListener("click", handler);
}

// ✅ With Event Delegation (Fast)
// 10ms × 1 = 10ms
document.querySelector("#list").addEventListener("click", (e) => {
  if (e.target.matches(".item")) handler(e);
});
```

---

#### 2. Refactor dùng DocumentFragment để optimize reflow:

**Code BAD - 1000 reflows:**

```javascript
// ❌ BAD - 1000 lần appendChild = 1000 reflows
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  document.body.appendChild(div); // ← REFLOW mỗi lần!
}
// Tổng time: 1000ms + (1000 × reflow time)
```

**Code GOOD - DocumentFragment:**

```javascript
// ✅ GOOD - 1 lần appendChild = 1 reflow
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  fragment.appendChild(div); // ← Không reflow
}

document.body.appendChild(fragment); // ← 1 reflow duy nhất!
// Tổng time: 10ms
```

**Tại sao DocumentFragment nhanh hơn 100x:**

| Thao tác                             | Time   | Reflow |
| ------------------------------------ | ------ | ------ |
| appendChild 1000 lần                 | 1000ms | 1000x  |
| DocumentFragment + appendChild 1 lần | 10ms   | 1x     |

**Giải thích:**

- **DocumentFragment**: Virtual container (không phải DOM node)
- Khi append multiple elements vào fragment: **không trigger reflow**
- Khi append fragment vào DOM: **chỉ 1 reflow**
- Browser merge tất cả changes và render 1 lần

**Benchmark comparison:**

```javascript
console.time("without fragment");
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  document.body.appendChild(div);
}
console.timeEnd("without fragment");
// ← ~5000ms

console.time("with fragment");
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment);
console.timeEnd("with fragment");
// ← ~50ms (100x faster!)
```

**Best Practices:**

```javascript
// Pattern: DocumentFragment + createElement + appendChild
const fragment = document.createDocumentFragment();
const data = ["A", "B", "C", "D"];

data.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  fragment.appendChild(li);
});

document.querySelector("ul").appendChild(fragment);

// Alternative: innerHTML (nhưng cần sanitize!)
let html = "";
data.forEach((item) => {
  html += `<li>${escapeHtml(item)}</li>`;
});
document.querySelector("ul").innerHTML = html;
```

---

**Tóm tắt Performance Tips:**

1. Dùng **Event Delegation** cho multiple elements
2. Dùng **DocumentFragment** khi appendChild multiple elements
3. Tránh **forced reflows** (read/write DOM nhiều lần)
4. **Batch DOM operations** lại với nhau
5. Dùng **requestAnimationFrame** cho animations

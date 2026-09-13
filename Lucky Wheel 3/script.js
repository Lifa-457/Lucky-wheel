const arrow = document.getElementById("arrow");
const spinButton = document.getElementById("spinButton");
const result = document.getElementById("result");
const lights = document.getElementById("lights");
const wheelCanvas = document.getElementById("wheel");
const ctx = wheelCanvas.getContext("2d");

let currentRotation = 0;
let spinning = false;

// Bảng màu, sẽ lặp lại tuần hoàn nếu số tên nhiều hơn số màu
const COLORS = [
    "#ff8500", "#2d2d38", "#ed3344", "#2d2d38",
    "#ffbd17", "#2d2d38", "#20b878", "#2d2d38",
    "#3b82f6", "#8b5cf6", "#f472b6", "#22d3ee"
];

const WHEEL_SIZE = 600;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = WHEEL_SIZE / 2;


// =========================
// VẼ VÒNG QUAY THEO DANH SÁCH TÊN
// =========================

function drawWheel() {

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    if (names.length === 0) {

        // Chưa có tên: vẽ vòng tròn trống với chữ hướng dẫn
        ctx.beginPath();
        ctx.arc(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#2d2d38";
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Thêm tên để bắt đầu", WHEEL_CENTER, WHEEL_CENTER+ 100);

        return;
    }

    const sliceAngleDeg = 360 / names.length;

    // Cỡ chữ tự co lại khi có nhiều tên
    const fontSize = Math.max(12, Math.min(22, 300 / names.length));

    names.forEach((name, i) => {

        const startDeg = -90 + i * sliceAngleDeg;
        const endDeg = -90 + (i + 1) * sliceAngleDeg;

        const startRad = startDeg * Math.PI / 180;
        const endRad = endDeg * Math.PI / 180;

        // Vẽ ô (slice)
        ctx.beginPath();
        ctx.moveTo(WHEEL_CENTER, WHEEL_CENTER);
        ctx.arc(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, startRad, endRad);
        ctx.closePath();

        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        // Vẽ tên dọc theo bán kính của ô
        const midDeg = (startDeg + endDeg) / 2;
        const midRad = midDeg * Math.PI / 180;

        ctx.save();
        ctx.translate(WHEEL_CENTER, WHEEL_CENTER);
        ctx.rotate(midRad);

        ctx.fillStyle = "#fff";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        // Cắt bớt tên quá dài để không tràn ra ngoài
        let displayName = name;
        const maxChars = Math.max(6, Math.floor(sliceAngleDeg / 6));
        if (displayName.length > maxChars) {
            displayName = displayName.slice(0, maxChars - 1) + "…";
        }

        ctx.fillText(displayName, WHEEL_RADIUS - 18, 0);

        ctx.restore();
    });
}


// =========================
// TẠO 24 BÓNG ĐÈN
// =========================

const numberOfLights = 24;

for (let i = 0; i < numberOfLights; i++) {

    const light = document.createElement("div");

    light.className = "light";

    const angle = (360 / numberOfLights) * i;

    const center = 310;
    const radius = 312;

    const x =
        center +
        Math.cos(angle * Math.PI / 180) * radius;

    const y =
        center +
        Math.sin(angle * Math.PI / 180) * radius;

    light.style.left = `${x - 7.5}px`;
    light.style.top = `${y - 7.5}px`;

    lights.appendChild(light);
}


// =========================
// QUAY MŨI TÊN
// =========================

spinButton.addEventListener("click", () => {

    if (spinning) {
        return;
    }

    if (names.length === 0) {
        result.textContent = "⚠️ Vui lòng thêm ít nhất 1 tên trước khi quay!";
        return;
    }

    spinning = true;
    spinButton.disabled = true;
    result.textContent = "";

    // 5 - 8 vòng
    const rotation =
        1800 + Math.floor(Math.random() * 1800);

    currentRotation += rotation;

    // Chỉ mũi tên quay
    arrow.style.transition =
        "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)";

    arrow.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        spinning = false;
        spinButton.disabled = false;

        // Góc dừng của mũi tên tính từ đỉnh (12h), theo chiều kim đồng hồ
        const finalAngle = ((currentRotation % 360) + 360) % 360;

        const sliceAngleDeg = 360 / names.length;
        const winnerIndex =
            Math.floor(finalAngle / sliceAngleDeg) % names.length;

        const winnerName = names[winnerIndex];

        result.textContent = `🎉 Người thắng cuộc: ${winnerName}!`;

    }, 4000);

});
// =========================
// QUẢN LÝ DANH SÁCH
// =========================

const nameInput = document.getElementById("nameInput");
const addButton = document.getElementById("addButton");
const nameList = document.getElementById("nameList");

let names = [];


// THÊM TÊN
addButton.addEventListener("click", () => {

    const name = nameInput.value.trim();

    if (name === "") {
        return;
    }

    names.push(name);

    nameInput.value = "";

    renderNames();
});


// HIỂN THỊ DANH SÁCH
function renderNames() {

    nameList.innerHTML = "";

    names.forEach((name, index) => {

        const item = document.createElement("div");

        item.className = "name-item";

        item.innerHTML = `
            <span>${name}</span>
            <button onclick="deleteName(${index})">XÓA</button>
        `;

        nameList.appendChild(item);
    });

    drawWheel();
}


// XÓA TÊN
function deleteName(index) {

    names.splice(index, 1);

    renderNames();
}


// Cho phép nhấn Enter để thêm tên
nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addButton.click();
    }
});


// Vẽ vòng quay trống ban đầu
drawWheel();
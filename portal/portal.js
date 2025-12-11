// 创建传送门视频元素
const portal = document.createElement("video");
portal.id = "portal_fx";
portal.style.position = "fixed";
portal.style.inset = "0";
portal.style.width = "100%";
portal.style.height = "100%";
portal.style.objectFit = "contain";
portal.style.background = "transparent";
portal.style.display = "none";
portal.style.cursor = "pointer";
portal.style.pointerEvents = "auto";
portal.muted = true;
portal.playsInline = true;

// 视频源
const source = document.createElement("source");
source.src = "portal.webm";   // ★你的透明 webm 文件
source.type = "video/webm";
portal.appendChild(source);

document.body.appendChild(portal);

let isPlaying = false;
let skipTriggered = false;
let targetURL = "";

// Hook 全部链接点击事件
document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;

    const url = a.href;
    if (!url) return;

    e.preventDefault();

    if (isPlaying) return;

    // 记录目标
    targetURL = url;
    isPlaying = true;

    // 播放传送门动画
    portal.currentTime = 0;
    portal.style.display = "block";
    portal.play();
});

// 点击传送门视频：加速跳转
portal.addEventListener("click", function () {
    if (!isPlaying || skipTriggered) return;

    skipTriggered = true;

    try {
        portal.currentTime = portal.duration * 0.85;
    } catch (e) {}

    setTimeout(() => {
        window.location.href = targetURL;
    }, 150);
});

// 正常播放结束跳转
portal.addEventListener("ended", function () {
    if (!skipTriggered && targetURL) {
        window.location.href = targetURL;
    }
});

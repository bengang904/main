// script.js

// 引入 videoData.js 数据
import { videoData } from './videoData.js';

let filteredVideos = [];  // 存储筛选后的数据
let currentIndex = 0; // 当前显示的索引
const videosPerPage = 10; // 每页显示 10 条

// 页面加载时
document.addEventListener("DOMContentLoaded", function () {
    filteredVideos = [...videoData]; // 初始时，全部数据可用
    currentIndex = 0;
    renderVideos(true);

    // 监听搜索框的回车键并加入防抖
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", debounce(searchVideos, 300)); // 防抖优化
});

// 防抖函数
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

// 渲染视频列表
function renderVideos(reset = false) {
    const container = document.getElementById("video-list");
    if (reset) {
        container.innerHTML = ""; // 只在搜索或初次加载时清空
        currentIndex = 0;
    }

    const videosToShow = filteredVideos.slice(currentIndex, currentIndex + videosPerPage);
    videosToShow.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("video-card");

        // 添加点击事件监听器
        card.addEventListener("click", function () {
            window.open(video.link, "_blank"); // 打开链接
        });

        card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
            <h3>${video.title}</h3>
            <p>类型: ${video.type}</p>
        `;

        container.appendChild(card);
    });

    currentIndex += videosToShow.length; // 更新索引

    // 控制 "查看更多" 按钮的显示
    const loadMoreBtn = document.getElementById("load-more");
    if (currentIndex < filteredVideos.length) {
        loadMoreBtn.style.display = "block";
    } else {
        loadMoreBtn.style.display = "none";
    }
}

// 搜索功能
function searchVideos() {
    const query = document.getElementById("search-input").value.trim();
    if (query === "") {
        filteredVideos = [...videoData]; // 为空时恢复所有
    } else {
        try {
            const regex = new RegExp(query, "i"); // 创建正则表达式，"i" 忽略大小写
            filteredVideos = videoData.filter(video => regex.test(video.title));
        } catch (error) {
            console.error("无效的正则表达式:", error);
            alert("搜索关键字格式错误，请检查后重试！");
            return;
        }
    }
    renderVideos(true);
}

// 加载更多
function loadMoreVideos() {
    renderVideos(false);
}

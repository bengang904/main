let itemData = [];
let filteredItems = [];
let currentIndex = 0;
const itemsPerPage = 8;

document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            itemData = data;
            
            const urlParams = new URLSearchParams(window.location.search);
            const initialQuery = urlParams.get('q');
            
            if (initialQuery) {
                const searchInput = document.getElementById("search-input");
                searchInput.value = initialQuery;
                executeSearch(initialQuery);
            } else {
                filteredItems = [...itemData]; 
                currentIndex = 0;
                renderItems(true);
            }
        })
        .catch(error => console.error("加载 JSON 失败:", error));

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            search();
        }
    });
});

function renderItems(reset = false) {
    const container = document.getElementById("list");
    const loadMoreBtn = document.getElementById("load-more");

    if (reset) {
        container.innerHTML = "";
        currentIndex = 0;
    }
    if (filteredItems.length === 0) {
        container.innerHTML = `<p style="font-size:18px;color:#666;margin-top:40px;">未找到匹配的结果</p>`;
        loadMoreBtn.style.display = "none";
        return;
    }

    const itemsToShow = filteredItems.slice(currentIndex, currentIndex + itemsPerPage);
    itemsToShow.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("item-card");
        
        card.addEventListener("click", function () {
            window.open(item.link, "_blank");
        });

        card.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>类型: ${item.type}</p>
        `;

        container.appendChild(card);
    });

    currentIndex += itemsToShow.length;

    if (currentIndex < filteredItems.length) {
        loadMoreBtn.style.display = "block";
    } else {
        loadMoreBtn.style.display = "none";
    }
}

function executeSearch(query) {
    if (query === "") {
        filteredItems = [...itemData];
    } else {
        try {
            const regex = new RegExp(query, "i"); 
            filteredItems = itemData.filter(item => regex.test(item.title));
        } catch (error) {
            console.error("无效的正则表达式:", error);
            alert("搜索关键字格式错误，请检查后重试！");
            filteredItems = [...itemData];
        }
    }
    renderItems(true);
}

function search() {
    const query = document.getElementById("search-input").value.trim();
    
    const baseUrl = window.location.origin + window.location.pathname;
    let newUrl;
    
    if (query === "") {
        newUrl = baseUrl;
    } else {
        newUrl = `${baseUrl}?q=${encodeURIComponent(query)}`;
    }
    
    window.location.href = newUrl;
}

function loadMoreItems() {
    renderItems(false);
}

function openShareModal() {
    const modal = document.getElementById("share-modal");
    modal.style.display = "flex"; 
}

function closeShareModal() {
    const modal = document.getElementById("share-modal");
    modal.style.display = "none";
}

async function shareViaNative() {
    closeShareModal(); 
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: document.title,
                text: "查看我在十月存档中发现的内容！",
                url: window.location.href,
            });
            console.log('成功使用原生分享');
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('原生分享失败:', error);
                alert("原生分享失败或被取消。请尝试跳转至主页。");
            }
        }
    } else {
        alert("您的浏览器不支持原生分享功能。请尝试跳转至主页。");
    }
}

function redirectToCustomLink() {
    const customUrl = "https://wwww.2024-10-24.zip"; 
    window.open(customUrl, "_blank");
    closeShareModal();
}

window.onclick = function(event) {
    const modal = document.getElementById("share-modal");
    if (event.target == modal) {
        closeShareModal();
    }
}

function openChat() {
    window.open("https://2024-10-24.zip/chat.txt", "_blank");
}

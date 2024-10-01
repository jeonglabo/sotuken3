const itemsPerPage = 4; // 1ページに表示するアイテム数
let currentContent = []; // 現在表示しているコンテンツを保持
let selectedTags = []; // 選択されたタグを保持する配列
let allPages = []; //全てのディレクトリから読み込んだページのメタデータを保持する配列

// 読み込むディレクトリを定義
const directories = [
    './tryit/algebra',
    './tryit/linear_algebra',
    './tryit/geometry',
    './tryit/calculus',
    './tryit/statistics',
    './tryit/probability',
    './tryit/fractal',
    './tryit/differential_equation',
    './tryit/discrete_math',
    './tryit/complex_analysis',
    './tryit/numerical_analysis',
    './tryit/stochastic_process'
];

// 各ディレクトリの meta.json を読み込む
function loadPageData() {
    allPages = []; // allPages をリセット

    const promises = directories.map(directory => {
        const metaPath = `./${directory}/meta.json`;
        return fetch(metaPath)
            .then(response => response.json())
            .then(data => {
                data.link = `./${directory}/index.html`;
                if (data.thumbnail) {
                    data.imgSrc = `./${directory}/${data.thumbnail}`;
                } else {
                    data.imgSrc = `./${directory}/thumbnail.png`;
                }
                allPages.push(data);
            })
            .catch(error => console.error('Error loading meta data:', error));
    });

    Promise.all(promises).then(() => {
        const sortedContents = sortContentsByDate(allPages);
        currentContent = sortedContents;
        generatePageContent(sortedContents, 1);
        generatePagination(sortedContents, 1);
        generateTagList(sortedContents);
    });
}

// 日付の形式を「20240320」から「2024年3月20日」に変換する関数
function formatDate(yyyymmdd) {
    const year = yyyymmdd.substring(0, 4);
    const month = parseInt(yyyymmdd.substring(4, 6), 10); // 月は整数値に変換
    const day = parseInt(yyyymmdd.substring(6, 8), 10);   // 日も整数値に変換
    return `${year}年${month}月${day}日`;
}

// ページコンテンツを更新日順にソートする関数
function sortContentsByDate(contents) {
    return contents.sort((a, b) => parseInt(b.lastUpdated) - parseInt(a.lastUpdated)); // 数値として比較
}

// ページコンテンツを生成する関数
function generatePageContent(content, pageNumber) {
    currentContent = content; // 現在表示しているコンテンツを保持
    const grid = document.querySelector('.grid');
    grid.innerHTML = ''; // 現在のコンテンツをクリア
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const contentToShow = content.slice(startIndex, endIndex); // 現在のページに表示するコンテンツを取得

    contentToShow.forEach(item => {
        const tagsHTML = item.tags.map(tag => 
            `<span class="tag" onclick="handleTagClick(event)">${tag}</span>`
        ).join('');
        const gridItem = `
            <div class="grid-item">
                <a href="${item.link}">
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="grid-item-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div>${tagsHTML}</div>
                        <p>最終更新日: ${formatDate(item.lastUpdated)}</p>
                    </div>
                </a>
            </div>
        `;
        grid.innerHTML += gridItem; // 新しいコンテンツを追加
    });
}

// タグリストを生成する関数
function generateTagList(allPages) {
    const allTags = new Set(); // 重複を排除するためにSetを使用

    // すべてのコンテンツからタグを抽出
    allPages.forEach(item => {
        item.tags.forEach(tag => allTags.add(tag));
    });

    // タグ検索エリアにタグを表示
    const tagSearch = document.querySelector('.tag-search');
    tagSearch.innerHTML = '<h3>タグ検索</h3>'; // タイトルを再設定
    allTags.forEach(tag => {
        const tagLink = `<a href="#" onclick="handleTagClick(event)">${tag}</a> `;
        tagSearch.innerHTML += tagLink; // タグリンクを追加
    });
}

// タグでフィルタリングされたコンテンツを生成する関数
function generateFilteredContent(tag) {
    // タグが選択されていない場合のみ追加
    if (!selectedTags.includes(tag)) {
        selectedTags.push(tag);
    }
    filterAndDisplayContent(); // フィルタリングと表示を実行
}

// 選択されたタグを削除する関数
function removeTag(tag) {
    selectedTags = selectedTags.filter(selectedTag => selectedTag !== tag);
    filterAndDisplayContent();
}

// 選択されたタグを基にコンテンツをフィルタリングし、表示する関数
function filterAndDisplayContent() {
    let filteredContent;
    if (selectedTags.length === 0) {
        filteredContent = allPages.slice(); // 全てのコンテンツを表示
    } else {
        filteredContent = allPages.filter(item =>
            selectedTags.every(selectedTag => item.tags.includes(selectedTag))
        );
    }
    currentContent = filteredContent; // currentContent を更新
    generatePageContent(filteredContent, 1);
    generatePagination(filteredContent, 1);
    displaySelectedTags();
}

// 選択されたタグを表示する関数
function displaySelectedTags() {
    const selectedTagElement = document.getElementById('selected-tags');
    if (selectedTags.length === 0) {
        selectedTagElement.style.display = 'none';
        return;
    }
    selectedTagElement.style.display = 'block';
    const tagsHTML = selectedTags.map(tag =>
        `<span class="tag"><span class="remove-tag" onclick="removeTag('${tag}')">×</span>${tag}</span>`
    ).join(' ');
    selectedTagElement.innerHTML = `選択されたタグ: ${tagsHTML}`;
}

// サイト内検索
function handleSearch(event) {
    event.preventDefault();
    const searchKeyword = document.querySelector('.search-box input').value.trim().toLowerCase();
    const filteredContent = currentContent.filter(item => item.title.toLowerCase().includes(searchKeyword));

    if (filteredContent.length > 0) {
        generatePageContent(filteredContent, 1); // 1ページ目の結果を表示
        generatePagination(filteredContent, 1); // 検索結果に基づいてページネーションを生成
    } else {
        const grid = document.querySelector('.grid');
        grid.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
        document.getElementById('pagination').innerHTML = ''; // ページネーションを非表示に
    }
}

// ページネーションの生成
function generatePagination(content, currentPage) {
    const totalPages = Math.ceil(content.length / itemsPerPage); // 総ページ数を計算
    const pagination = document.getElementById('pagination');
    let paginationHTML = '';

    if (totalPages > 1) {
        if (currentPage > 1) {
            paginationHTML += `<a href="#" onclick="changePage(${currentPage - 1})">前のページ</a> `;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `<span class="current">${i}</span>`;
            } else {
                paginationHTML += `<a href="#" onclick="changePage(${i})">${i}</a>`;
            }
        }

        if (currentPage < totalPages) {
            paginationHTML += ` <a href="#" onclick="changePage(${currentPage + 1})">次のページ</a>`;
        }
    }

    pagination.innerHTML = paginationHTML;
}

// ページを変更する関数
function changePage(newPage) {
    generatePageContent(currentContent, newPage); // 現在のコンテンツでページを更新
    generatePagination(currentContent, newPage); // ページネーションを更新
}

// タグクリック時にフィルタリングする関数
function handleTagClick(event) {
    event.preventDefault();
    const tag = event.target.textContent;
    if (!selectedTags.includes(tag)) {
        selectedTags.push(tag);
    }
    filterAndDisplayContent();
}

// 検索ボックスでエンターキーが押されたら検索を実行
document.querySelector('.search-box input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch(event);
    }
});

// 初期化関数を定義
function init() {
    loadPageData(); // ページデータを読み込む
}

// ページロード時に初期化関数を呼び出す
window.onload = init;

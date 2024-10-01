const itemsPerPage = 4; // 1ページに表示するアイテム数
let currentContent = []; // 現在表示しているコンテンツを保持
let allPages = []; //全てのディレクトリから読み込んだページのメタデータを保持する配列

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

//const directories = [ 'linear_algebra'];

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

// 初期化関数を定義
function init() {
    generateBreadcrumb(); // パンくずリスト生成
    loadPageData(); // ページデータを読み込む
}

// ページロード時に初期化関数を呼び出す
window.onload = init;

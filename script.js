const itemsPerPage = 4; // 1ページに表示するアイテム数
let currentContent = []; // 現在表示しているコンテンツを保持
let selectedTags = []; // 選択されたタグを保持する配列

// 読み込むディレクトリを定義
const directories = [
    'algebra',
    'linear_algebra',
    'geometry',
    'calculus',
    'statistics',
    'probability',
    'fractal',
    'differential_equation',
    'discrete_math',
    'complex_analysis',
    'numerical_analysis',
    'stochastic_process'
];

/*
const pageContents = [
    [
        {
            imgSrc: "./algebra/algebra.png", // 代数のアイコン画像パスに変更
            alt: "代数",
            title: "代数",
            description: "数と文字を使った数式による表現",
            tags: ["代数", "数式"],
            link: "algebra/index.html", // 個別ページへのリンク
            lastUpdated: "20240325" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "線形代数",
            title: "線形代数",
            description: "ベクトルと行列に関する数学概念",
            tags: ["線形代数", "ベクトル"],
            link: "linear_algebra/index.html", // 個別ページへのリンク
            lastUpdated: "20240312" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "幾何学",
            title: "幾何学",
            description: "図形とその性質に関する研究",
            tags: ["幾何学", "図形"],
            link: "geometry/index.html", // 個別ページへのリンク
            lastUpdated: "20240310" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "微積分",
            title: "微積分",
            description: "関数の変化と累積に関する理論",
            tags: ["微積分", "関数"],
            link: "calculus/index.html", // 個別ページへのリンク
            lastUpdated: "20240309" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "統計",
            title: "統計",
            description: "データの収集、分析、解釈の方法",
            tags: ["統計", "データ"],
            link: "statistics/index.html", // 個別ページへのリンク
            lastUpdated: "20240311" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "確率論",
            title: "確率論",
            description: "偶然性と不確実性の数学的研究",
            tags: ["確率論", "確率"],
            link: "probability/index.html", // 個別ページへのリンク
            lastUpdated: "20240314" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "フラクタル",
            title: "フラクタル",
            description: "自己相似性を持つ幾何学的構造",
            tags: ["フラクタル", "幾何学"],
            link: "fractal/index.html", // 個別ページへのリンク
            lastUpdated: "20240313" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "微分方程式",
            title: "微分方程式",
            description: "変化を記述する方程式",
            tags: ["微分方程式", "数式"],
            link: "differential_equation/index.html", // 個別ページへのリンク
            lastUpdated: "20240316" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "離散数学",
            title: "離散数学",
            description: "有限の対象に関する数学",
            tags: ["離散数学", "数式"],
            link: "discrete_math/index.html", // 個別ページへのリンク
            lastUpdated: "20240318" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "複素解析",
            title: "複素解析",
            description: "複素数を用いた関数解析",
            tags: ["複素解析", "関数"],
            link: "complex_analysis/index.html", // 個別ページへのリンク
            lastUpdated: "20240317" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "数値解析",
            title: "数値解析",
            description: "数値的に問題を解く方法",
            tags: ["数値解析", "計算"],
            link: "numerical_analysis/index.html", // 個別ページへのリンク
            lastUpdated: "20240319" // YYYYMMDD形式の更新日
        },
        {
            imgSrc: "/api/placeholder/400/150",
            alt: "確率過程",
            title: "確率過程",
            description: "確率的な時間発展に関する理論",
            tags: ["確率過程", "確率"],
            link: "stochastic_process/index.html", // 個別ページへのリンク
            lastUpdated: "20240320" // YYYYMMDD形式の更新日
        }
    ]
];*/

// 各ディレクトリの meta.json を読み込む
function loadPageData() {
    let allPages = [];

    const promises = directories.map(directory => {
        const metaPath = `./${directory}/meta.json`; // 各ディレクトリの meta.json を参照
        return fetch(metaPath)
            .then(response => response.json())
            .then(data => {
                // ディレクトリ名からリンクを生成
                data.link = `./${directory}/index.html`;
                data.imgSrc = data.thumbnail || `./${directory}/thumbnail.png`; // サムネイル画像パスを設定
                allPages.push(data); // ページ情報を全体の配列に追加
            })
            .catch(error => console.error('Error loading meta data:', error));
    });

    // 全てのメタデータが読み込まれた後にページを生成
    Promise.all(promises).then(() => {
        const sortedContents = sortContentsByDate(allPages); // 更新日順にソート
        generatePageContent(sortedContents, 1); // 初期表示
        generatePagination(sortedContents, 1);  // ページネーションを生成
        generateTagList(sortedContents); // タグリストを生成
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
    if (!selectedTags.includes(tag)) {
        selectedTags.push(tag); // タグが既に選択されていない場合のみ追加
    }
    filterAndDisplayContent(); // フィルタリングと表示を実行
}

// 選択されたタグを削除する関数
function removeTag(tag) {
    selectedTags = selectedTags.filter(selectedTag => selectedTag !== tag); // タグを削除
    filterAndDisplayContent(); // フィルタリングと表示を実行
}

// 選択されたタグを表示し、フィルタリングを行う関数
function filterAndDisplayContent() {
    const filteredContent = currentContent.filter(item =>
        selectedTags.every(selectedTag => item.tags.includes(selectedTag))
    );
    
    generatePageContent(filteredContent, 1); // 1ページ目の結果を表示
    generatePagination(filteredContent, 1); // フィルタ結果に基づいてページネーションを生成
    displaySelectedTags(); // 選択されたタグを表示
}

// 選択されたタグを解説ページの上に表示する関数
function displaySelectedTags() {
    const selectedTagElement = document.getElementById('selected-tags');
    
    if (selectedTags.length === 0) {
        selectedTagElement.style.display = 'none'; // タグが選択されていない場合は非表示
        return;
    }

    selectedTagElement.style.display = 'block'; // タグがある場合は表示
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
    generateFilteredContent(tag); // タグに基づいてコンテンツをフィルタリング
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

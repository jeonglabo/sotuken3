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

// 検索ボックスでエンターキーが押されたら検索を実行
document.querySelector('.search-box input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch(event);
    }
});

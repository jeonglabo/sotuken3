let selectedTags = []; // 選択されたタグを保持する配列

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

// タグクリック時にフィルタリングする関数
function handleTagClick(event) {
    event.preventDefault();
    const tag = event.target.textContent;
    if (!selectedTags.includes(tag)) {
        selectedTags.push(tag);
    }
    filterAndDisplayContent();
}

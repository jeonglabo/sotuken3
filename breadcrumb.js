// パンくずリストを生成する関数
function generateBreadcrumb() {
    const breadcrumbElement = document.getElementById('breadcrumb');
    const pathArray = window.location.pathname.split('/').filter(Boolean);
    let breadcrumbHTML = '<li><a href="https://jeonglabo.github.io/sotuken3/">ホーム</a></li>';

    let accumulatedPath = '';
    pathArray.forEach((path, index) => {
        // 'index.html'を表示しないようにする
        if (path.toLowerCase() !== 'index.html') {
            accumulatedPath += `/${path}`;
            if (index === pathArray.length - 1) {
                breadcrumbHTML += `<li>${decodeURIComponent(path)}</li>`;
            } else {
                breadcrumbHTML += `<li><a href="${accumulatedPath}/index.html">${decodeURIComponent(path)}</a></li>`;
            }
        }
    });

    breadcrumbElement.innerHTML = breadcrumbHTML;
}

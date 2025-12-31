const listItems = [
    { 
        title:'Docs', items: [
            { url : '/docs/what-is.html', icon: 'fa-thin fa-question', text: 'What is?' },
            { url : '/docs/installation.html', icon: 'fa-thin fa-download', text: 'Installation' },
            { url : '/docs/system-overview.html', icon: 'fa-thin fa-window', text: 'System Overview' },
            { url : '/docs/crud-generator.html', icon: 'fa-thin fa-diagram-project', text: 'CRUD Generator' },
        ]
    },
];

let menuHTML = `
    <a href="/" aria-current="page" class="brand-link w-inline-block w--current">
        <img src="/img/ibs.svg" loading="lazy" alt="" class="brand-image"/>
    </a>`;

listItems.forEach(section => {
    menuHTML += `<div class="sidebar-menu-list-wrapper">`;
    menuHTML += `<div class="sidebar-menu-heading">${section.title}</div>`;
    menuHTML += `<div class="sidebar-menu-collection-list-wrapper w-dyn-list">`;
    menuHTML += `<div role="list" class="sidebar-menu-collection-list w-dyn-items">`;

    section.items.forEach(item => {
        menuHTML += `
            <div role="listitem" class="sidebar-menu-collection-item w-dyn-item">
                <a href="${item.url}" class="sidebar-menu-link w-inline-block">
                    <i class="${item.icon}" loading="lazy" alt=""></i>
                    <div class="sidebar-menu-link-text">${item.text}</div>
                </a>
            </div>
        `;
    });

    menuHTML += `</div></div></div>`;
});

document.getElementById('sidebar-menu').innerHTML = menuHTML;

if(document.getElementById('hero-cards')) {
    const images = `
            <div class="hero-card-wrapper">
                <img src="/img/template-preview-card.svg" loading="lazy" alt="" class="hero-card-image" />
            </div>`.repeat(6) + `
            <div class="hero-card-wrapper">
                <img src="/img/template-preview-card.svg" loading="lazy" alt="" class="hero-card-image is-invisible" />
            </div>`
    
    document.getElementById('hero-cards').innerHTML = images;
}

const footer = `
    <div class="padding-global">
        <div class="container-m">
            <div class="padding-section-s">
            <div class="footer-content">
                <a
                href="index.html"
                aria-current="page"
                class="brand-link w-inline-block w--current"
                ><img
                    src="/img/ibs.svg"
                    loading="lazy"
                    alt=""
                    class="brand-image"
                /></a>
                <div class="w-layout-grid footer-link-list">
                <a href="https://icebearsoft.com/" target="_blank" class="footer-link">Powered by IceBearSoft</a>
                </div>
            </div>
            </div>
        </div>
    </div>`;

document.getElementById('footer').innerHTML = footer;
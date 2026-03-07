// Social Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    renderPage('discover');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const pageId = item.getAttribute('data-page');
            if (!pageId) return;
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            renderPage(pageId);
        });
    });

    const shareBtn = document.getElementById('shareProfileBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => alert('Profile Link Copied to Clipboard!'));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Logout?')) BookApp.logout();
        });
    }

    const profileSection = document.querySelector('.user-profile-mini');
    if (profileSection) {
        profileSection.style.cursor = 'pointer';
        profileSection.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            renderPage('profile');
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-follow')) {
            const btn = e.target;
            const isFollowing = btn.textContent.trim() === 'Following';
            btn.textContent = isFollowing ? 'Follow' : 'Following';
            btn.style.background = isFollowing ? 'transparent' : 'var(--primary)';
            btn.style.color = isFollowing ? 'var(--primary)' : 'white';
        }
    });

    initTheme();
    initNotifications();
});

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
    const updateUI = (isDark) => {
        if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
        if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';
        if (themeText) themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    };
    
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    updateUI(isDark);
    
    themeToggle.addEventListener('click', () => {
        const dark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        updateUI(dark);
    });
}

function initNotifications() {
    const bell = document.getElementById('notificationBtn');
    const badge = document.getElementById('notificationBadge');
    if (bell && badge) {
        bell.addEventListener('click', () => {
            badge.classList.toggle('active');
            if (badge.classList.contains('active')) alert('All notifications cleared!');
            else alert('No new notifications.');
        });
    }
}

function showNotification() {
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.classList.add('active');
}

let userStats = { readingGoal: 30, booksRead: 12 };

let myLibrary = [
    { title: "Project Hail Mary", author: "Andy Weir", cover: "pic/burning-ground.jpg", genre: "Sci-Fi", price: "$14.99" },
    { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", genre: "Sci-Fi", price: "$12.50" },
    { title: "The Fourth Girl", author: "S.B. Caves", cover: "pic/available-dark.jpg", genre: "Horror", price: "$10.50" },
    { title: "Since We Fell", author: "Dennis Lehane", cover: "pic/since-we-fell.jpg", genre: "Thriller", price: "$11.90" },
    { title: "The Bees", author: "Laline Paull", cover: "pic/the-bees.jpg", genre: "Thriller", price: "$14.00" },
    { title: "Sorrow and Bliss", author: "Meg Mason", cover: "pic/sorrow-and-bliss.jpg", genre: "Romance", price: "$12.00" }
];

function getGenreStats() {
    const total = myLibrary.length;
    const counts = {};
    myLibrary.forEach(b => counts[b.genre] = (counts[b.genre] || 0) + 1);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0] || ["None", 0];
    const percent = total > 0 ? ((dominant[1] / total) * 100).toFixed(0) : 0;
    return { counts, total, dominantGenre: dominant[0], dominantPercent: percent };
}

function renderPage(pageKey) {
    const container = document.getElementById('page-content');
    if (!container) return;
    container.innerHTML = '';
    
    switch (pageKey) {
        case 'discover': renderDiscover(container); break;
        case 'library': renderLibrary(container); break;
        case 'favorites': renderFavorites(container); break;
        case 'add-books': renderAddBookForm(container); break;
        case 'rent': renderRentPage(container); break;
        case 'messages': renderMessages(container); break;
        case 'settings': renderSettings(container); break;
        case 'profile': renderProfile(container); break;
        default: container.innerHTML = '<h2>Coming Soon</h2>';
    }
}

function renderDiscover(container) {
    const stats = getGenreStats();
    const recs = [
        { title: "Project Hail Mary", author: "Andy Weir", cover: "pic/burning-ground.jpg", price: "$14.99" },
        { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", price: "$12.50" },
        { title: "Atomic Habits", author: "James Clear", cover: "pic/psychology-of-money.jpg", price: "$16.00" }
    ];
    
    container.innerHTML = `
        <div class="ai-analyst-card">
            <h3>AI Collection Analyst</h3>
            <p>Your library is <strong>${stats.dominantPercent}% ${stats.dominantGenre}</strong></p>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
                ${recs.map(b => `<div style="min-width: 150px;"><img src="${b.cover}" style="width:100px;"><h4>${b.title}</h4><p>${b.author}</p><button class="btn-buy" onclick="alert('Added!')">${b.price}</button></div>`).join('')}
            </div>
        <h2 class="section-title">Your Books</h2>
        <div class="books-grid">
            ${myLibrary.map(b => `<div class="book-card"><img src="${b.cover}" style="width:100px;"><h4>${b.title}</h4><p>${b.author}</p></div>`).join('')}
        </div>
    `;
}

function renderLibrary(container, genre = 'All') {
    const genres = ['All', 'Romance', 'Horror', 'Thriller', 'Sci-Fi'];
    const stats = getGenreStats();
    const filtered = genre === 'All' ? myLibrary : myLibrary.filter(b => b.genre === genre);
    
    container.innerHTML = `
        <h2 class="section-title">Collection Insights</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div class="insight-card">
                <h3>Library Breakdown</h3>
                ${Object.entries(stats.counts).map(([g, c]) => `<div style="margin: 10px 0;"><div style="display:flex;justify-content:space-between;"><span>${g}</span><span>${((c/stats.total)*100).toFixed(0)}%</span></div><div style="height:6px;background:#eee;border-radius:3px;"><div style="width:${((c/stats.total)*100)}%;height:100%;background:var(--primary);border-radius:3px;"></div>`).join('')}
            </div>
            <div class="insight-card">
                <h3>2026 Reading Goal</h3>
                <div style="height:10px;background:#eee;border-radius:5px;margin:15px 0;"><div style="width:${(userStats.booksRead/userStats.readingGoal*100)}%;height:100%;background:var(--accent);border-radius:5px;"></div>
                <p>${userStats.booksRead} / ${userStats.readingGoal} Books</p>
                <button onclick="setGoal()" style="cursor:pointer;">Set Goal</button>
            </div>
        <h2 class="section-title">My Library</h2>
        <div style="display:flex;gap:10px;margin-bottom:20px;">
            ${genres.map(g => `<button class="category-tab ${genre===g?'active':''}" onclick="renderLib('${g}')">${g}</button>`).join('')}
        </div>
        <div class="books-grid">
            ${filtered.length ? filtered.map(b => `<div class="book-card"><img src="${b.cover}" style="width:100px;"><h4>${b.title}</h4><span style="font-size:12px;background:rgba(0,105,92,0.1);color:#00695c;padding:2px 6px;border-radius:4px;">Owned</span></div>`).join('') : '<p>No books</p>'}
        </div>
    `;
}

window.setGoal = () => {
    const g = prompt('Set goal:', userStats.readingGoal);
    if (g && !isNaN(g)) { userStats.readingGoal = parseInt(g); renderPage('library'); }
};
window.renderLib = (g) => renderLibrary(document.getElementById('page-content'), g);

function renderFavorites(container, view = 'collection') {
    const favs = [
        { title: "Sorrow and Bliss", author: "Meg Mason", cover: "pic/sorrow-and-bliss.jpg" },
        { title: "Since We Fell", author: "Dennis Lehane", cover: "pic/since-we-fell.jpg" },
        { title: "Atomic Habits", author: "James Clear", cover: "pic/psychology-of-money.jpg" }
    ];
    const wish = [
        { title: "The Midnight Library", author: "Matt Haig", cover: "pic/burning-ground.jpg", source: "Sarah J." },
        { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", source: "Alex M." }
    ];
    
    container.innerHTML = `
        <h2 class="section-title">Hearted Collection</h2>
        <div style="display:flex;gap:10px;margin-bottom:20px;">
            <button class="fav-toggle-btn ${view==='collection'?'active':''}" onclick="renderFav('collection')">My Collection</button>
            <button class="fav-toggle-btn ${view==='wishlist'?'active':''}" onclick="renderFav('wishlist')">Community Wishlist</button>
        </div>
        <div class="books-grid">
            ${(view==='collection'?favs:wish).map(b => `<div class="book-card"><img src="${b.cover}" style="width:100px;"><h4>${b.title}</h4><p>${b.author}</p>${view==='wishlist'?`<button onclick="alert('Request sent!')">Ask to Borrow</button>`:`<button onclick="alert('Removed!')">❤️</button>`}</div>`).join('')}
        </div>
    `;
}
window.renderFav = (v) => renderFavorites(document.getElementById('page-content'), v);

function renderAddBookForm(container) {
    container.innerHTML = `
        <h2 class="section-title">Add to Collection</h2>
        <form onsubmit="addBook(event)" style="max-width:500px;">
            <div class="form-group"><label>Title</label><input type="text" id="bt" required></div>
            <div class="form-group"><label>Author</label><input type="text" id="ba" required></div>
            <div class="form-group"><label>Genre</label><select id="bg"><option>Romance</option><option>Horror</option><option>Thriller</option><option>Sci-Fi</option></select></div>
            <div class="form-group"><label>Year</label><input type="number" id="by" required></div>
            <button type="submit" class="pro-btn">Add Book</button>
        </form>
    `;
}
window.addBook = (e) => {
    e.preventDefault();
    myLibrary.push({ title: document.getElementById('bt').value, author: document.getElementById('ba').value, genre: document.getElementById('bg').value, year: document.getElementById('by').value, cover: "pic/city-we-became.jpg", price: "$15" });
    alert('Book added!');
    renderPage('library');
};

function renderRentPage(container) {
    const rentals = JSON.parse(localStorage.getItem('myRentals')) || [
        { bookName: "The Bees", renterName: "Sarah Jenkins", dueDate: "2026-02-15", status: "Active" },
        { bookName: "The Fourth Girl", renterName: "Michael Ross", dueDate: "2026-02-01", status: "Overdue" }
    ];
    
    container.innerHTML = `
        <h2 class="section-title">Lending & Rentals</h2>
        <div style="display:flex;gap:20px;margin-bottom:20px;">
            <div class="stat-card-mini"><span class="label">Lent Out</span><span class="value">${rentals.filter(r=>r.status==='Active').length}</span></div>
            <div class="stat-card-mini"><span class="label">Earned</span><span class="value">$${(rentals.length*2.5).toFixed(2)}</span></div>
            <div class="stat-card-mini"><span class="label">Overdue</span><span class="value" style="color:red;">${rentals.filter(r=>r.status==='Overdue').length}</span></div>
        <table style="width:100%;border-collapse:collapse;">
            <tr style="background:var(--bg-main);text-align:left;"><th>Book</th><th>Renter</th><th>Due Date</th><th>Status</th></tr>
            ${rentals.map(r => `<tr style="border-bottom:1px solid var(--border);"><td>${r.bookName}</td><td>${r.renterName}</td><td style="${r.status==='Overdue'?'color:red':''}">${new Date(r.dueDate).toLocaleDateString()}</td><td><span style="color:${r.status==='Active'?'green':'red'};background:${r.status==='Active'?'rgba(0,105,92,0.1)':'rgba(255,0,0,0.1)'};padding:4px 8px;border-radius:4px;">${r.status}</span></td></tr>`).join('')}
        </table>
    `;
}

// ========== MESSAGES PAGE - FULLY WORKING ==========
function renderMessages(container) {
    let convs = JSON.parse(localStorage.getItem('messages_data'));
    if (!convs) {
        convs = [
            { id: 1, name: "Sarah Johnson", lastMsg: "Hey, do you still have that Dune edition?", time: "2m", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=D4AF37&color=fff", active: true, messages: [
                { text: "Hey! That 1965 Dune copy is incredible!", type: "received", time: "10:42 AM" },
                { text: "Thanks Sarah! It's one of my favorites.", type: "sent", time: "10:45 AM" },
                { text: "I'd love to discuss a trade!", type: "received", time: "2m ago" }
            ]},
            { id: 2, name: "Michael Chen", lastMsg: "The trade sounds good!", time: "1h", avatar: "https://ui-avatars.com/api/?name=Mike+C&background=2C3E50&color=fff", active: false, messages: [
                { text: "Is 'The Martian' still available?", type: "received", time: "Yesterday" },
                { text: "Yes! Looking for $15.", type: "sent", time: "Yesterday" },
                { text: "The trade sounds good!", type: "received", time: "1h ago" }
            ]},
            { id: 3, name: "Emily Watson", lastMsg: "Thanks for the recommendation!", time: "5h", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=E74C3C&color=fff", active: false, messages: [
                { text: "Any sci-fi recommendations?", type: "received", time: "5h ago" },
                { text: "Check out 'Project Hail Mary'!", type: "sent", time: "5h ago" },
                { text: "Thanks!", type: "received", time: "5h ago" }
            ]}
        ];
        localStorage.setItem('messages_data', JSON.stringify(convs));
    }

    const active = convs.find(c => c.active) || convs[0];

    container.innerHTML = `
        <div style="display:flex(100vh - 200px);border;height:calc-radius:15px;overflow:hidden;background:white;box-shadow:0 2px10px rgba(0,0,0,0.1);">
            <div style="width:300px;border-right:1px solid #ddd;display:flex;flex-direction:column;">
                <div style="padding:15px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;">Messages</h3>
                    <button onclick="newChat()" style="background:none;border:none;cursor:pointer;font-size:1.2rem;">✏️</button>
                </div>
                <div style="flex:1;overflow-y:auto;">
                    ${convs.map(c => `
                        <div onclick="switchChat(${c.id})" style="padding:12px;display:flex;gap:10px;cursor:pointer;border-bottom:1px solid #eee;${c.active?'background:rgba(43,76,126,0.1);':''}">
                            <img src="${c.avatar}" style="width:40px;height:40px;border-radius:50%;">
                            <div style="flex:1;overflow:hidden;">
                                <div style="display:flex;justify-content:space-between;"><h4 style="margin:0;font-size:0.9rem;">${c.name}</h4><span style="font-size:0.7rem;opacity:0.6;">${c.time}</span></div>
                                <p style="margin:5px 0 0;font-size:0.75rem;opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.lastMsg}</p>
                            </div>
                    `).join('')}
                </div>
            <div style="flex:1;display:flex;flex-direction:column;">
                <div style="padding:15px;border-bottom:1px solid #ddd;display:flex;align-items:center;gap:10px;">
                    <img src="${active.avatar}" style="width:40px;height:40px;border-radius:50%;">
                    <div><h4 style="margin:0;">${active.name}</h4><p style="margin:0;font-size:0.75rem;color:green;">Online</p></div>
                <div id="chatScroll" style="flex:1;padding:15px;overflow-y:auto;">
                    ${active.messages.map(m => `
                        <div style="max-width:70%;padding:10px 15px;border-radius:15px;margin-bottom:10px;${m.type==='sent'?'background:var(--primary);color:white;margin-left:auto;':'background:#f0f0f0;color:black;'}">
                            <p style="margin:0;">${m.text}</p>
                            <span style="font-size:0.65rem;opacity:0.7;display:block;text-align:right;margin-top:5px;">${m.time}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="padding:15px;border-top:1px solid #ddd;display:flex;gap:10px;">
                    <button onclick="attachFile()" style="background:none;border:none;cursor:pointer;font-size:1.2rem;">📎</button>
                    <input type="text" id="msgInput" placeholder="Type..." onkeypress="if(event.key==='Enter')sendMsg()" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:25px;outline:none;">
                    <button onclick="sendMsg()" style="background:var(--primary);color:white;border:none;padding:10px 20px;border-radius:25px;cursor:pointer;">Send</button>
                </div>
        </div>
    `;
    
    setTimeout(() => {
        const s = document.getElementById('chatScroll');
        if (s) s.scrollTop = s.scrollHeight;
    }, 100);
}

window.switchChat = (id) => {
    let c = JSON.parse(localStorage.getItem('messages_data')) || [];
    c = c.map(x => ({...x, active: x.id === id}));
    localStorage.setItem('messages_data', JSON.stringify(c));
    renderMessages(document.getElementById('page-content'));
};

window.sendMsg = () => {
    const input = document.getElementById('msgInput');
    const text = input?.value.trim();
    if (!text) return;
    
    let c = JSON.parse(localStorage.getItem('messages_data')) || [];
    const i = c.findIndex(x => x.active);
    if (i === -1) return;
    
    c[i].messages.push({ text, type: 'sent', time: 'Just now' });
    c[i].lastMsg = text;
    c[i].time = 'Just now';
    localStorage.setItem('messages_data', JSON.stringify(c));
    renderMessages(document.getElementById('page-content'));
    
    setTimeout(() => {
        let c2 = JSON.parse(localStorage.getItem('messages_data')) || [];
        const ti = c2.findIndex(x => x.id === c[i].id);
        if (ti !== -1) {
            const reps = ["Thanks!", "Got it!", "I'll respond soon!", "Sounds good!"];
            c2[ti].messages.push({ text: reps[Math.floor(Math.random()*reps.length)], type: 'received', time: 'Just now' });
            c2[ti].lastMsg = "New message";
            c2[ti].time = 'Just now';
            localStorage.setItem('messages_data', JSON.stringify(c2));
            if (c2.find(x => x.active)?.id === c2[ti].id) {
                renderMessages(document.getElementById('page-content'));
                showNotification();
            } else showNotification();
        }
    }, 2000);
};

window.newChat = () => {
    const name = prompt('Enter name:');
    if (!name) return;
    let c = JSON.parse(localStorage.getItem('messages_data')) || [];
    if (c.find(x => x.name.toLowerCase() === name.toLowerCase())) {
        switchChat(c.find(x => x.name.toLowerCase() === name.toLowerCase()).id);
        return;
    }
    c.unshift({ id: Date.now(), name, lastMsg: 'New chat', time: 'Now', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`, active: false, messages: [] });
    localStorage.setItem('messages_data', JSON.stringify(c));
    switchChat(c[0].id);
};

window.attachFile = () => alert('File attachment coming soon!');

function renderSettings(container) {
    container.innerHTML = `
        <h2 class="section-title">Settings</h2>
        <div style="padding:20px;background:white;border-radius:15px;max-width:600px;">
            <div style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #ddd;">
                <h3>Appearance</h3>
                <p>Dark Mode - Toggle theme</p>
                <button onclick="toggleDark()" class="pro-btn">Switch Theme</button>
            </div>
            <div style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #ddd;">
                <h3>Notifications</h3>
                <label style="display:flex;gap:10px;margin:10px 0;"><input type="checkbox" checked> Email notifications</label>
                <label style="display:flex;gap:10px;margin:10px 0;"><input type="checkbox" checked> Overdue alerts</label>
            </div>
            <button onclick="alert('Coming soon!')" style="background:#777;color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;">Deactivate Account</button>
        </div>
    `;
}
window.toggleDark = () => {
    const d = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', d ? 'dark' : 'light');
};

function renderProfile(container) {
    container.innerHTML = `
        <div style="height:200px;background:linear-gradient(135deg,#2B4C7E,#1a3a5c);position:relative;">
            <button onclick="alert('Coming!')" style="position:absolute;bottom:10px;right:10px;background:white;border:none;padding:8px 15px;border-radius:20px;cursor:pointer;">📷</button>
        </div>
        <div style="padding:20px;">
            <div style="display:flex;gap:20px;align-items:flex-start;margin-top:-60px;">
                <img src="https://ui-avatars.com/api/?name=Arin+Shrivastava&background=2B4C7E&color=fff&size=128" style="width:120px;height:120px;border-radius:50%;border:4px solid white;">
                <div style="margin-top:70px;">
                    <h2 style="margin:0;">Arin Shrivastava</h2>
                    <p style="margin:5px 0;opacity:0.7;">Master Librarian 📚</p>
                    <button onclick="alert('Edit!')" class="pro-btn">Edit Profile</button>
                </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-top:30px;">
                <div style="text-align:center;padding:20px;background:white;border-radius:15px;box-shadow:0 2px10px rgba(0,0,0,0.1);"><h3 style="color:var(--primary);margin:0;">${myLibrary.length}</h3><p>Books</p></div>
                <div style="text-align:center;padding:20px;background:white;border-radius:15px;box-shadow:0 2px10px rgba(0,0,0,0.1);"><h3 style="color:var(--primary);margin:0;">42</h3><p>Followers</p></div>
                <div style="text-align:center;padding:20px;background:white;border-radius:15px;box-shadow:0 2px10px rgba(0,0,0,0.1);"><h3 style="color:var(--primary);margin:0;">89</h3><p>Trust Score</p></div>
            <div style="margin-top:30px;background:white;padding:20px;border-radius:15px;box-shadow:0 2px10px rgba(0,0,0,0.1);">
                <h3>Biography</h3>
                <p style="line-height:1.8;opacity:0.8;">Passionate reader and collector of rare Sci-Fi editions!</p>
            </div>
    `;
}

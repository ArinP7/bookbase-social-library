// Social Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    renderPage('discover');

    // Navigation Listener
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

    // Share Button
    const shareBtn = document.getElementById('shareProfileBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Profile link copied to clipboard!');
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to logout?')) {
                BookApp.logout();
            }
        });
    }

    // Profile Section Click
    const profileSection = document.querySelector('.user-profile-mini');
    if (profileSection) {
        profileSection.style.cursor = 'pointer';
        profileSection.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            renderPage('profile');
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    // Close sidebar on mobile when clicking nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Follow Button Handler
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
    loadUserProfile();
});

// Load User Profile from Firebase
async function loadUserProfile() {
    try {
        const user = BookApp.auth.currentUser;
        if (user) {
            console.log("Loading profile for:", user.email);
            
            // Update sidebar profile
            const nameEl = document.querySelector('.user-info .name');
            const statusEl = document.querySelector('.user-info .status');
            const avatarImg = document.querySelector('.user-profile-mini img');
            
            if (nameEl) nameEl.textContent = user.displayName || user.email.split('@')[0];
            if (statusEl) statusEl.textContent = 'Online';
            if (avatarImg) {
                avatarImg.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=2B4C7E&color=fff`;
            }

            // Try to fetch from Firestore
            try {
                const doc = await BookApp.db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    const data = doc.data();
                    console.log("User data:", data);
                    
                    // Update profile in localStorage for offline access
                    localStorage.setItem('userProfile', JSON.stringify({
                        name: data.name || user.displayName || user.email.split('@')[0],
                        email: data.email || user.email,
                        avatar: data.avatar || user.photoURL,
                        bio: data.bio || '',
                        readingGoal: data.readingGoal || 50
                    }));
                }
            } catch (e) {
                console.log("Using local profile data");
            }
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// Theme Initialization
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

// Notifications
function initNotifications() {
    const bell = document.getElementById('notificationBtn');
    const badge = document.getElementById('notificationBadge');
    if (bell && badge) {
        bell.addEventListener('click', () => {
            badge.classList.toggle('active');
            alert(badge.classList.contains('active') ? 'Notifications cleared!' : 'No new notifications');
        });
    }
}

function showNotification() {
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.classList.add('active');
}

// State Management
let userStats = { readingGoal: 30, booksRead: 12 };
let currentUser = null;

// Mock Library Data
let myLibrary = [
    { title: "Project Hail Mary", author: "Andy Weir", cover: "pic/burning-ground.jpg", genre: "Sci-Fi", price: "$14.99" },
    { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", genre: "Sci-Fi", price: "$12.50" },
    { title: "The Fourth Girl", author: "S.B. Caves", cover: "pic/available-dark.jpg", genre: "Horror", price: "$10.50" },
    { title: "Since We Fell", author: "Dennis Lehane", cover: "pic/since-we-fell.jpg", genre: "Thriller", price: "$11.90" },
    { title: "The Bees", author: "Laline Paull", cover: "pic/the-bees.jpg", genre: "Thriller", price: "$14.00" },
    { title: "Sorrow and Bliss", author: "Meg Mason", cover: "pic/sorrow-and-bliss.jpg", genre: "Romance", price: "$12.00" }
];

// Get user from Firebase and update profile
BookApp.auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log("User logged in:", user.email);
        
        // Update UI with user data
        const nameEl = document.querySelector('.user-info .name');
        if (nameEl) {
            nameEl.textContent = user.displayName || user.email.split('@')[0];
        }
        
        const avatarImg = document.querySelector('.user-profile-mini img');
        if (avatarImg) {
            avatarImg.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=2B4C7E&color=fff`;
        }
        
        // Store user info
        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL
        }));
        
        // Reload profile page to show user data
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav && activeNav.getAttribute('data-page') === 'profile') {
            renderPage('profile');
        }
    } else {
        currentUser = null;
        console.log("User logged out");
    }
});

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

// Discover Page
function renderDiscover(container) {
    const stats = getGenreStats();
    const recs = [
        { title: "Project Hail Mary", author: "Andy Weir", cover: "pic/burning-ground.jpg", price: "$14.99" },
        { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", price: "$12.50" },
        { title: "Atomic Habits", author: "James Clear", cover: "pic/psychology-of-money.jpg", price: "$16.00" }
    ];
    
    container.innerHTML = `
        <div class="ai-analyst-card" style="background: white; padding: 20px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: var(--primary); margin-bottom: 10px;">AI Collection Analyst</h3>
            <p>Your library is <strong>${stats.dominantPercent}% ${stats.dominantGenre}</strong></p>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
                ${recs.map(b => `
                    <div style="min-width: 150px; text-align: center;">
                        <img src="${b.cover}" style="width: 100px; height: 150px; object-fit: cover; border-radius: 8px;">
                        <h4 style="font-size: 14px; margin: 10px 0 5px;">${b.title}</h4>
                        <p style="font-size: 12px; color: #666;">${b.author}</p>
                        <button onclick="alert('Added to cart: ${b.price}')" style="background: var(--primary); color: white; border: none; padding: 5px 15px; border-radius: 20px; cursor: pointer; margin-top: 5px;">${b.price}</button>
                    </div>
                `).join('')}
            </div>
        
        <h2 class="section-title" style="margin-bottom: 20px;">Your Library Books</h2>
        <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;">
            ${myLibrary.map(b => `
                <div class="book-card" style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${b.cover}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    <h4 style="font-size: 14px; margin: 10px 0 5px;">${b.title}</h4>
                    <p style="font-size: 12px; color: #666;">${b.author}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Library Page
function renderLibrary(container, genre = 'All') {
    const genres = ['All', 'Romance', 'Horror', 'Thriller', 'Sci-Fi'];
    const stats = getGenreStats();
    const filtered = genre === 'All' ? myLibrary : myLibrary.filter(b => b.genre === genre);
    
    container.innerHTML = `
        <h2 class="section-title">Collection Insights</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="insight-card" style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 15px;">Library Breakdown</h3>
                ${Object.entries(stats.counts).map(([g, c]) => `
                    <div style="margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px;"><span>${g}</span><span>${((c/stats.total)*100).toFixed(0)}%</span></div>
                        <div style="height: 8px; background: #eee; border-radius: 4px;">
                            <div style="width: ${((c/stats.total)*100)}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
                    </div>
                `).join('')}
            </div>
            <div class="insight-card" style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 15px;">2026 Reading Goal</h3>
                <div style="height: 12px; background: #eee; border-radius: 6px; margin: 15px 0;">
                    <div style="width: ${(userStats.booksRead/userStats.readingGoal*100)}%; height: 100%; background: var(--accent); border-radius: 6px;"></div>
                <p>${userStats.booksRead} / ${userStats.readingGoal} Books</p>
                <button onclick="setReadingGoal()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin-top: 10px;">Set Goal</button>
            </div>
        
        <h2 class="section-title" style="margin-bottom: 15px;">My Library</h2>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
            ${genres.map(g => `
                <button onclick="filterLibrary('${g}')" style="padding: 8px 16px; border: 1px solid var(--primary); background: ${genre===g?'var(--primary)':'transparent'}; color: ${genre===g?'white':'var(--primary)'}; border-radius: 20px; cursor: pointer;">${g}</button>
            `).join('')}
        </div>
        
        <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;">
            ${filtered.length ? filtered.map(b => `
                <div class="book-card" style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${b.cover}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    <h4 style="font-size: 14px; margin: 10px 0 5px;">${b.title}</h4>
                    <span style="font-size: 11px; background: rgba(0,105,92,0.1); color: #00695c; padding: 2px 8px; border-radius: 10px;">Owned</span>
                </div>
            `).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No books found</p>'}
        </div>
    `;
}

window.setReadingGoal = () => {
    const g = prompt('Set your 2026 reading goal:', userStats.readingGoal);
    if (g && !isNaN(g)) { userStats.readingGoal = parseInt(g); renderPage('library'); }
};

window.filterLibrary = (genre) => renderLibrary(document.getElementById('page-content'), genre);

// Favorites Page
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
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button onclick="renderFavPage('collection')" style="padding: 10px 20px; background: ${view==='collection'?'var(--primary)':'transparent'}; color: ${view==='collection'?'white':'var(--primary)'}; border: 1px solid var(--primary); border-radius: 20px; cursor: pointer;">My Collection</button>
            <button onclick="renderFavPage('wishlist')" style="padding: 10px 20px; background: ${view==='wishlist'?'var(--primary)':'transparent'}; color: ${view==='wishlist'?'white':'var(--primary)'}; border: 1px solid var(--primary); border-radius: 20px; cursor: pointer;">Community Wishlist</button>
        </div>
        <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;">
            ${(view==='collection'?favs:wish).map(b => `
                <div class="book-card" style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${b.cover}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    <h4 style="font-size: 14px; margin: 10px 0 5px;">${b.title}</h4>
                    <p style="font-size: 12px; color: #666;">${b.author}</p>
                    ${view==='wishlist' ? `<button onclick="alert('Request sent to ${b.source}!')" style="background: var(--primary); color: white; border: none; padding: 5px 15px; border-radius: 15px; cursor: pointer; margin-top: 10px;">Ask to Borrow</button>` : `<button onclick="alert('Removed from favorites!')" style="background: #ff4757; color: white; border: none; padding: 5px 15px; border-radius: 15px; cursor: pointer; margin-top: 10px;">❤️</button>`}
                </div>
            `).join('')}
        </div>
    `;
}
window.renderFavPage = (v) => renderFavorites(document.getElementById('page-content'), v);

// Add Book Form
function renderAddBookForm(container) {
    container.innerHTML = `
        <h2 class="section-title">Add to Collection</h2>
        <form onsubmit="addNewBook(event)" style="max-width: 500px; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Book Title</label>
                <input type="text" id="bookTitle" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Author</label>
                <input type="text" id="bookAuthor" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Genre</label>
                <select id="bookGenre" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
                    <option value="">Select Genre</option>
                    <option>Romance</option>
                    <option>Horror</option>
                    <option>Thriller</option>
                    <option>Sci-Fi</option>
                    <option>Other</option>
                </select>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Published Year</label>
                <input type="number" id="bookYear" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            </div>
            <button type="submit" style="width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer;">Add to Library</button>
        </form>
    `;
}
window.addNewBook = (e) => {
    e.preventDefault();
    const newBook = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        genre: document.getElementById('bookGenre').value,
        year: document.getElementById('bookYear').value,
        cover: "pic/city-we-became.jpg",
        price: "$15.00"
    };
    myLibrary.push(newBook);
    alert('Book added successfully!');
    renderPage('library');
};

// Rent Page
function renderRentPage(container) {
    const rentals = JSON.parse(localStorage.getItem('myRentals')) || [
        { bookName: "The Bees", renterName: "Sarah Jenkins", dueDate: "2026-02-15", status: "Active" },
        { bookName: "The Fourth Girl", renterName: "Michael Ross", dueDate: "2026-02-01", status: "Overdue" }
    ];
    
    container.innerHTML = `
        <h2 class="section-title">Lending & Rentals</h2>
        <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 30px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; min-width: 120px;">
                <h3 style="color: var(--primary);">${rentals.filter(r=>r.status==='Active').length}</h3>
                <p style="font-size: 14px;">Lent Out</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; min-width: 120px;">
                <h3 style="color: var(--accent);">$${(rentals.length*2.5).toFixed(2)}</h3>
                <p style="font-size: 14px;">Earned</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; min-width: 120px;">
                <h3 style="color: #ff4757;">${rentals.filter(r=>r.status==='Overdue').length}</h3>
                <p style="font-size: 14px;">Overdue</p>
            </div>
        <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: var(--bg-secondary); text-align: left;">
                    <th style="padding: 15px;">Book</th>
                    <th style="padding: 15px;">Renter</th>
                    <th style="padding: 15px;">Due Date</th>
                    <th style="padding: 15px;">Status</th>
                </tr>
                ${rentals.map(r => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 15px;"><strong>${r.bookName}</strong></td>
                        <td style="padding: 15px;">${r.renterName}</td>
                        <td style="padding: 15px; color: ${r.status==='Overdue'?'#ff4757':''}">${new Date(r.dueDate).toLocaleDateString()}</td>
                        <td style="padding: 15px;"><span style="color: ${r.status==='Active'?'green':'#ff4757'}; background: ${r.status==='Active'?'rgba(0,105,92,0.1)':'rgba(255,71,87,0.1)'}; padding: 4px 12px; border-radius: 15px; font-size: 12px;">${r.status}</span></td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// Messages Page - Fully Working
function renderMessages(container) {
    let convs = JSON.parse(localStorage.getItem('messages_data'));
    if (!convs) {
        convs = [
            { id: 1, name: "Sarah Johnson", lastMsg: "Hey, do you still have that Dune edition?", time: "2m", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=D4AF37&color=fff", active: true, messages: [
                { text: "Hey! That 1965 Dune copy is incredible!", type: "received", time: "10:42 AM" },
                { text: "Thanks Sarah!", type: "sent", time: "10:45 AM" },
                { text: "I'd love to discuss a trade!", type: "received", time: "2m ago" }
            ]},
            { id: 2, name: "Michael Chen", lastMsg: "The trade sounds good!", time: "1h", avatar: "https://ui-avatars.com/api/?name=Mike+C&background=2C3E50&color=fff", active: false, messages: [
                { text: "Is 'The Martian' still available?", type: "received", time: "Yesterday" },
                { text: "Yes! $15", type: "sent", time: "Yesterday" }
            ]},
            { id: 3, name: "Emily Watson", lastMsg: "Thanks!", time: "5h", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=E74C3C&color=fff", active: false, messages: [] }
        ];
        localStorage.setItem('messages_data', JSON.stringify(convs));
    }

    const active = convs.find(c => c.active) || convs[0];

    container.innerHTML = `
        <div style="display: flex; height: calc(100vh - 250px); min-height: 500px; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="width: 300px; border-right: 1px solid #eee; display: flex; flex-direction: column;">
                <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">Messages</h3>
                    <button onclick="newChat()" style="background: none; border: none; font-size: 18px; cursor: pointer;">✏️</button>
                </div>
                <div style="flex: 1; overflow-y: auto;">
                    ${convs.map(c => `
                        <div onclick="switchChat(${c.id})" style="padding: 12px; display: flex; gap: 10px; cursor: pointer; border-bottom: 1px solid #f5f5f5; background: ${c.active?'rgba(43,76,126,0.1)':'transparent'};">
                            <img src="${c.avatar}" style="width: 45px; height: 45px; border-radius: 50%;">
                            <div style="flex: 1; overflow: hidden;">
                                <div style="display: flex; justify-content: space-between;"><h4 style="margin: 0; font-size: 14px;">${c.name}</h4><span style="font-size: 11px; color: #999;">${c.time}</span></div>
                                <p style="margin: 5px 0 0; font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.lastMsg}</p>
                            </div>
                    `).join('')}
                </div>
            <div style="flex: 1; display: flex; flex-direction: column;">
                <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px;">
                    <img src="${active.avatar}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div><h4 style="margin: 0; font-size: 15px;">${active.name}</h4><p style="margin: 0; font-size: 12px; color: green;">Online</p></div>
                <div id="chatScroll" style="flex: 1; padding: 15px; overflow-y: auto;">
                    ${active.messages.length ? active.messages.map(m => `
                        <div style="max-width: 70%; padding: 10px 15px; border-radius: 15px; margin-bottom: 10px; ${m.type==='sent'?'background: var(--primary); color: white; margin-left: auto;':'background: #f0f0f0; color: black;'}">
                            <p style="margin: 0; font-size: 14px;">${m.text}</p>
                            <span style="font-size: 10px; opacity: 0.7; display: block; text-align: right; margin-top: 5px;">${m.time}</span>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #999; margin-top: 50px;">No messages yet</p>'}
                </div>
                <div style="padding: 15px; border-top: 1px solid #eee; display: flex; gap: 10px;">
                    <input type="text" id="msgInput" placeholder="Type a message..." onkeypress="if(event.key==='Enter')sendMsg()" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 25px; outline: none;">
                    <button onclick="sendMsg()" style="background: var(--primary); color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer;">Send</button>
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
            const active = c2.find(x => x.active);
            if (active && active.id === c2[ti].id) {
                renderMessages(document.getElementById('page-content'));
                showNotification();
            } else {
                showNotification();
            }
        }
    }, 2000);
};

window.newChat = () => {
    const name = prompt('Enter name for new conversation:');
    if (!name) return;
    let c = JSON.parse(localStorage.getItem('messages_data')) || [];
    c.unshift({ id: Date.now(), name, lastMsg: 'New chat', time: 'Now', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`, active: false, messages: [] });
    localStorage.setItem('messages_data', JSON.stringify(c));
    switchChat(c[0].id);
};

// Settings Page
function renderSettings(container) {
    container.innerHTML = `
        <h2 class="section-title">Settings</h2>
        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px;">
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                <h3 style="margin-bottom: 15px;">Appearance</h3>
                <p style="color: #666; margin-bottom: 10px;">Dark Mode - Toggle between light and dark themes</p>
                <button onclick="toggleDark()" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">Switch Theme</button>
            </div>
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                <h3 style="margin-bottom: 15px;">Notifications</h3>
                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                    <input type="checkbox" checked> Email notifications for new messages
                </label>
                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                    <input type="checkbox" checked> Alerts for overdue rentals
                </label>
            </div>
            <button onclick="alert('Account deactivation coming soon!')" style="background: #777; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">Deactivate Account</button>
        </div>
    `;
}
window.toggleDark = () => {
    const d = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', d ? 'dark' : 'light');
};

// Profile Page - Shows User Data
function renderProfile(container) {
    // Get user data from Firebase or localStorage
    let userData = { name: 'User', email: '', bio: 'Book lover!' };
    
    if (currentUser) {
        userData = {
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            photoURL: currentUser.photoURL
        };
    } else {
        const stored = JSON.parse(localStorage.getItem('currentUser'));
        if (stored) {
            userData.name = stored.name;
            userData.email = stored.email;
        }
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="height: 200px; background: linear-gradient(135deg, #2B4C7E, #1a3a5c); position: relative;">
                <button onclick="alert('Cover photo change coming soon!')" style="position: absolute; bottom: 15px; right: 15px; background: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer;">📷 Change Cover</button>
            </div>
            <div style="padding: 20px;">
                <div style="display: flex; gap: 20px; align-items: flex-start; margin-top: -70px;">
                    <img src="${userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2B4C7E&color=fff&size=128`}" style="width: 130px; height: 130px; border-radius: 50%; border: 5px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="margin-top: 75px;">
                        <h2 style="margin: 0;">${userData.name}</h2>
                        <p style="margin: 5px 0; color: #666;">${userData.email || 'No email'}</p>
                        <p style="margin: 5px 0; color: var(--accent);">Master Librarian 📚</p>
                        <button onclick="alert('Edit profile coming soon!')" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; margin-top: 10px;">Edit Profile</button>
                    </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 30px;">
                    <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                        <h3 style="color: var(--primary); margin: 0;">${myLibrary.length}</h3>
                        <p style="margin: 5px 0 0; font-size: 14px;">Books</p>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                        <h3 style="color: var(--primary); margin: 0;">42</h3>
                        <p style="margin: 5px 0 0; font-size: 14px;">Followers</p>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                        <h3 style="color: var(--primary); margin: 0;">89</h3>
                        <p style="margin: 5px 0 0; font-size: 14px;">Trust Score</p>
                    </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                    <h3 style="margin-bottom: 15px;">Biography</h3>
                    <p style="line-height: 1.8; color: #666;">Passionate reader and collector of rare Sci-Fi editions. Always looking for good trades and discussing great books!</p>
                    <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <span style="background: rgba(43,76,126,0.1); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 12px;">#SciFiCollector</span>
                        <span style="background: rgba(43,76,126,0.1); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 12px;">#RareBooks</span>
                        <span style="background: rgba(43,76,126,0.1); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 12px;">#BookLover</span>
                    </div>
            </div>
    `;
}

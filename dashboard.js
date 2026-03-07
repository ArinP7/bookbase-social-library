// Social Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderPage('discover');

    // Navigation Listener
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const pageId = item.getAttribute('data-page');
            if (!pageId) return; // Ignore theme toggle or others without data-page

            e.preventDefault();

            // UI Update
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Page Render
            renderPage(pageId);
        });
    });

    // Share Button Listener
    document.getElementById('shareProfileBtn').addEventListener('click', () => {
        alert('Profile Link Copied to Clipboard!');
    });

    // Logout Listener
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent profile click
        if (confirm('Are you sure you want to logout?')) {
            BookApp.logout();
        }
    });

    // Profile Section Click Listener
    const profileSection = document.querySelector('.user-profile-mini');
    if (profileSection) {
        profileSection.style.cursor = 'pointer';
        profileSection.addEventListener('click', () => {
            // UI Update
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            renderPage('profile');
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking menu items on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Follow Button Listener (Global Delegation)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-follow')) {
            const btn = e.target;
            const isFollowing = btn.textContent.trim() === 'Following';

            if (isFollowing) {
                btn.textContent = 'Follow';
                btn.style.background = 'transparent';
                btn.style.color = 'var(--primary)';
            } else {
                btn.textContent = 'Following';
                btn.style.background = 'var(--primary)';
                btn.style.color = 'white';

                // Optional success pulse effect
                btn.classList.add('pulse-effect');
                setTimeout(() => btn.classList.remove('pulse-effect'), 500);
            }
        }
    });

    initTheme();
    initNotifications();
});

function initNotifications() {
    const bell = document.getElementById('notificationBtn');
    const badge = document.getElementById('notificationBadge');

    if (bell && badge) {
        bell.addEventListener('click', () => {
            if (badge.classList.contains('active')) {
                badge.classList.remove('active');
                alert('All notifications cleared!');
            } else {
                alert('No new notifications.');
            }
        });
    }
}

function showNotification() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.classList.add('active');
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle?.querySelector('.sun-icon');
    const moonIcon = themeToggle?.querySelector('.moon-icon');
    const themeText = themeToggle?.querySelector('.theme-text');

    const updateThemeUI = (isDark) => {
        if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
        if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';
        if (themeText) themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    };

    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        updateThemeUI(isDark);
    };

    // Check saved theme
    const isDark = localStorage.getItem('theme') === 'dark';
    applyTheme(isDark);

    themeToggle?.addEventListener('click', () => {
        const currentlyDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
        updateThemeUI(currentlyDark);
    });

    // Sync theme across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            applyTheme(e.newValue === 'dark');
        }
    });
}


// State Management
let userStats = {
    readingGoal: 30,
    booksRead: 12
};

// Data Store
let myLibrary = [];

// Initialize Data
async function initData() {
    const user = BookApp.auth.currentUser;
    if (user) {
        try {
            // Fetch books from Firestore
            myLibrary = await BookApp.getUserBooks(user.uid);
            console.log("Books loaded:", myLibrary.length);
        } catch (error) {
            console.error("Failed to load books:", error);
        }
    } else {
        console.log("User not logged in, waiting for auth state...");
        // Use local storage generic mock data if no user is logged in yet (or while loading)
        myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];
    }

    // Re-render the current page with data
    const activePage = document.querySelector('.nav-item.active')?.getAttribute('data-page') || 'discover';
    renderPage(activePage);
}

// Listen for Auth State Changes
BookApp.auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User authenticated:", user.email);

        // Update Profile UI
        document.querySelector('.user-info .name').textContent = user.displayName || user.email.split('@')[0];
        document.querySelector('.user-profile-mini img').src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=2B4C7E&color=fff`;

        // Load Data
        await initData();
    } else {
        console.log("User signed out");
        // Redirect if on a protected page? For now just stay.
        window.location.href = 'login.html';
    }
});

// Mock Data (Fallback / Demo)
// Mock Data removed, using myLibrary directly

function getGenreStats() {
    const total = myLibrary.length;
    const counts = {};
    myLibrary.forEach(b => counts[b.genre] = (counts[b.genre] || 0) + 1);

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0] || ["None", 0];
    const percent = total > 0 ? ((dominant[1] / total) * 100).toFixed(0) : 0;

    return { counts, total, dominantGenre: dominant[0], dominantPercent: percent };
}

// Page Renderer
function renderPage(pageKey) {
    const container = document.getElementById('page-content');
    container.innerHTML = ''; // Clear content

    switch (pageKey) {
        case 'discover':
            renderDiscover(container);
            break;
        case 'library':
            renderLibrary(container);
            break;
        case 'favorites':
            renderFavorites(container);
            break;
        case 'add-books':
            renderAddBookForm(container);
            break;
        case 'rent':
            renderRentPage(container);
            break;
        case 'messages':
            renderMessages(container);
            break;
        case 'settings':
            renderSettings(container);
            break;
        case 'profile':
            renderProfile(container);
            break;
        default:
            container.innerHTML = `<h2>Page Under Construction</h2>`;
    }
}

// --- Component Functions ---

function renderDiscover(container) {
    const stats = getGenreStats();

    // AI Buy Analyst Section
    const recommendedBooks = [
        { title: "Project Hail Mary", author: "Andy Weir", cover: "pic/burning-ground.jpg", price: "$14.99" },
        { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", price: "$12.50" },
        { title: "Atomic Habits", author: "James Clear", cover: "pic/psychology-of-money.jpg", price: "$16.00" }
    ];

    const aiAnalystHTML = `
        <div class="ai-analyst-card">
            <div class="ai-header-slim">
                <h3>AI Collection Analyst</h3>
                <p>Your library is <strong>${stats.dominantPercent}% ${stats.dominantGenre}</strong>. Balance your collection with these:</p>
            </div>
            
            <div class="ai-recommendations-row">
                ${recommendedBooks.map(book => `
                    <div class="recommendation-card" style="position: relative;">
                        <img src="${book.cover}" alt="${book.title}">
                        <button class="heart-btn" style="width: 24px; height: 24px; font-size: 0.8rem; top: 5px; right: 5px;" onclick="alert('Added to Hearted Collection!')">❤️</button>
                        <h4>${book.title}</h4>
                        <p>${book.author}</p>
                        <button class="btn-buy">Buy ${book.price}</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // 2. Famous Books Grid
    const booksGridHTML = `
        <div class="section-header">
            <h2 class="section-title">Trending / Famous Books</h2>
            <a href="#" class="view-all">See All Trending <span>→</span></a>
        </div>
        <div class="books-grid">
            ${myLibrary.map(book => `
                <div class="book-card">
                    <div class="book-card-cover">
                        <img src="${book.cover}" alt="${book.title}">
                        <button class="heart-btn" onclick="alert('Added to Hearted Collection!')">❤️</button>
                    </div>
                    <div style="padding: 1rem;">
                        <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">${book.title}</h4>
                        <p style="font-size: 0.8rem; color: #777;">${book.author}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = aiAnalystHTML + booksGridHTML;
}

function renderAddBookForm(container) {
    container.innerHTML = `
        <h2 class="section-title">Add to Collection</h2>
        <div class="pro-form-card">
            <div class="step-indicator">
                <div class="step-dot active" data-step="Details"></div>
                <div class="step-dot" data-step="Photos"></div>
                <div class="step-dot" data-step="Verification"></div>
            </div>

            <form onsubmit="handleBookSubmit(event)">
                <div class="form-row">
                    <div class="floating-group">
                        <input type="text" id="bookTitle" placeholder=" " required>
                        <label for="bookTitle">Book Title</label>
                    </div>
                    <div class="floating-group">
                        <input type="text" id="bookAuthor" placeholder=" " required>
                        <label for="bookAuthor">Author Name</label>
                    </div>
                </div>

                <div class="form-row">
                    <div class="floating-group">
                        <select id="bookGenre" required>
                            <option value="" disabled selected>Select Genre</option>
                            <option>Romance</option>
                            <option>Horror</option>
                            <option>Thriller</option>
                            <option>Sci-Fi</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div class="floating-group">
                        <input type="number" id="bookYear" placeholder=" " required>
                        <label for="bookYear">Published Year</label>
                    </div>
                </div>

                <div class="floating-group">
                    <textarea id="bookDesc" rows="4" placeholder=" " style="resize: none;"></textarea>
                    <label for="bookDesc" style="top: 2rem;">Brief Description (Optional)</label>
                </div>

                <div class="file-upload-trigger" style="margin-bottom: 2rem;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin-bottom: 1rem;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="font-weight: 600; font-size: 0.9rem;">Upload Book Photos</p>
                    <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 5px;">Drag & drop or click to browse (Max 5 photos)</p>
                    <input type="file" multiple accept="image/*" style="display: none;">
                </div>

                <button type="submit" class="pro-btn">
                    <span>Finalize & Submit</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </form>
        </div>
    `;
}

function renderRentPage(container) {
    container.innerHTML = `
        <h2 class="section-title">Lending & Rentals</h2>
        
        <div class="stats-row">
            <div class="stat-card-mini">
                <span class="label">Lent Out</span>
                <span class="value">04</span>
            </div>
            <div class="stat-card-mini">
                <span class="label">Earned</span>
                <span class="value">$42.50</span>
            </div>
            <div class="stat-card-mini">
                <span class="label">Overdue</span>
                <span class="value" style="color: #ff4757;">01</span>
            </div>
        </div>

        <div style="background: white; border-radius: 15px; border: 1px solid var(--border); overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                    <tr style="background: var(--bg-main); text-align: left;">
                        <th style="padding: 1.2rem;">Book</th>
                        <th style="padding: 1.2rem;">Renter</th>
                        <th style="padding: 1.2rem;">Due Date</th>
                        <th style="padding: 1.2rem;">Status</th>
                        <th style="padding: 1.2rem;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 1.2rem;"><strong>The Bees</strong></td>
                        <td style="padding: 1.2rem;">Sarah Jenkins</td>
                        <td style="padding: 1.2rem;">Feb 15, 2026</td>
                        <td style="padding: 1.2rem;"><span style="color: #00695c; background: rgba(0,105,92,0.1); padding: 4px 8px; border-radius: 4px;">Active</span></td>
                        <td style="padding: 1.2rem;"><button style="background: none; border: 1px solid var(--border); padding: 5px 10px; border-radius: 4px; cursor: pointer;">Nudge</button></td>
                    </tr>
                    <tr>
                        <td style="padding: 1.2rem;"><strong>The Fourth Girl</strong></td>
                        <td style="padding: 1.2rem;">Michael Ross</td>
                        <td style="padding: 1.2rem; color: #ff4757;">Feb 01, 2026</td>
                        <td style="padding: 1.2rem;"><span style="color: #ff4757; background: rgba(255,71,87,0.1); padding: 4px 8px; border-radius: 4px;">Overdue</span></td>
                        <td style="padding: 1.2rem;"><button style="background: var(--primary); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Send Alert</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderMessages(container) {
    container.innerHTML = `
        <h2 class="section-title">Message Center</h2>
        <div class="chat-container">
            <div class="contacts-list">
                <div class="contact-item active">
                    <div class="contact-avatar">SJ</div>
                    <div>
                        <h4 style="font-size: 0.9rem;">Sarah Jenkins</h4>
                        <p style="font-size: 0.75rem; opacity: 0.6;">I'll return "The Bees" by Fri...</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-avatar" style="background: #5d5fef;">MR</div>
                    <div>
                        <h4 style="font-size: 0.9rem;">Michael Ross</h4>
                        <p style="font-size: 0.75rem; opacity: 0.6;">Hey, do you have any Horro...</p>
                    </div>
                </div>
            </div>
            <div class="chat-window">
                <div class="chat-header">
                    <div class="contact-avatar" style="width: 35px; height: 35px;">SJ</div>
                    <h4 style="font-size: 1rem;">Sarah Jenkins</h4>
                </div>
                <div class="chat-messages">
                    <div class="message-bubble received">
                        Hey! I'm really enjoying "The Bees". Just wanted to let you know I might need a few extra days?
                    </div>
                    <div class="message-bubble sent">
                        No problem at all Sarah! Enjoy the read.
                    </div>
                    <div class="message-bubble received">
                        Thank you so much! You're the best.
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" placeholder="Type a message...">
                    <button class="pro-btn" style="padding: 0 1.5rem; height: 45px; width: auto; border-radius: 25px;">Send</button>
                </div>
            </div>
        </div>
    `;
}

function renderLibrary(container, activeGenre = 'All') {
    const genres = ['All', 'Romance', 'Horror', 'Thriller', 'Sci-Fi'];

    // Calculate Genre Stats
    const stats = getGenreStats();

    // Filter books
    const filteredBooks = activeGenre === 'All'
        ? myLibrary
        : myLibrary.filter(book => book.genre === activeGenre);

    container.innerHTML = `
        <h2 class="section-title">Collection Insights</h2>
        <div class="insights-grid" style="margin-bottom: 2.5rem;">
            <div class="insight-card">
                <h3>Library Breakdown</h3>
                <div class="genre-bars" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.8rem;">
                    ${Object.entries(stats.counts).map(([genre, count]) => {
        const percent = ((count / stats.total) * 100).toFixed(0);
        return `
                            <div class="genre-stat">
                                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                                    <span>${genre}</span>
                                    <span>${percent}%</span>
                                </div>
                                <div style="height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px;">
                                    <div style="width: ${percent}%; height: 100%; background: var(--primary); border-radius: 3px;"></div>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
            <div class="insight-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>2026 Reading Goal</h3>
                    <button onclick="setReadingGoal()" style="font-size: 0.7rem; color: var(--primary); font-weight: 600; background: none; border: none; cursor: pointer;">Set Goal</button>
                </div>
                <div style="height: 10px; background: rgba(0,0,0,0.05); margin: 15px 0; border-radius: 5px;">
                    <div style="width: ${(userStats.booksRead / userStats.readingGoal * 100).toFixed(0)}%; height: 100%; background: var(--accent); border-radius: 5px;"></div>
                </div>
                <p style="font-size: 0.85rem;">${userStats.booksRead} / ${userStats.readingGoal} Books read</p>
            </div>
        </div>

        <h2 class="section-title">My Library</h2>
        
        <div class="category-tabs">
            ${genres.map(genre => `
                <div class="category-tab ${activeGenre === genre ? 'active' : ''}" 
                     onclick="renderLibrary(document.getElementById('page-content'), '${genre}')">
                    ${genre}
                </div>
            `).join('')}
        </div>

        <div class="books-grid">
            ${filteredBooks.length > 0 ? filteredBooks.map(book => `
                <div class="book-card">
                    <div class="book-card-cover">
                        <img src="${book.cover}" alt="${book.title}">
                        <button class="heart-btn" onclick="alert('Added to Hearted Collection!')">❤️</button>
                    </div>
                    <div style="padding: 1rem;">
                        <h4>${book.title}</h4>
                        <span style="font-size: 0.75rem; background: rgba(0, 105, 92, 0.1); padding: 2px 6px; border-radius: 4px; color: #00695c;">Owned</span>
                    </div>
                </div>
            `).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; opacity: 0.5;">No books found in this category.</p>'}
        </div>
    `;

    window.renderLibrary = renderLibrary;
}

function renderFavorites(container, view = 'collection') {
    const myFavorites = [
        { title: "Sorrow and Bliss", author: "Meg Mason", cover: "pic/sorrow-and-bliss.jpg", genre: "Romance" },
        { title: "Since We Fell", author: "Dennis Lehane", cover: "pic/since-we-fell.jpg", genre: "Thriller" },
        { title: "Atomic Habits", author: "James Clear", cover: "pic/psychology-of-money.jpg", genre: "Self-Help" }
    ];

    const communityWishlist = [
        { title: "The Midnight Library", author: "Matt Haig", cover: "pic/burning-ground.jpg", source: "Sarah J." },
        { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", source: "Alex M." }
    ];

    container.innerHTML = `
        <h2 class="section-title">Hearted Collection</h2>
        
        <div class="favorites-toggle-container">
            <button class="fav-toggle-btn ${view === 'collection' ? 'active' : ''}" 
                    onclick="renderFavorites(document.getElementById('page-content'), 'collection')">
                My Collection
            </button>
            <button class="fav-toggle-btn ${view === 'wishlist' ? 'active' : ''}" 
                    onclick="renderFavorites(document.getElementById('page-content'), 'wishlist')">
                Community Wishlist
            </button>
        </div>

        ${view === 'collection' ? `
            <p style="text-align: center; margin-bottom: 2rem; opacity: 0.7; font-weight: 500;">
                <span class="heart-animation pulsing">❤️</span> Books you own and absolutely love.
            </p>
            <div class="books-grid">
                ${myFavorites.map(book => `
                    <div class="book-card fav-book-card">
                        <div class="book-card-cover">
                            <img src="${book.cover}" alt="${book.title}">
                            <div class="book-actions">
                                <button class="btn-primary-small" style="background: #ff4757;" onclick="alert('Removed from your Hearted Collection!')">Unheart</button>
                            </div>
                        </div>
                        <div style="padding: 1rem;">
                            <h4 style="margin-bottom: 5px;">${book.title}</h4>
                            <p style="font-size: 0.8rem; color: #777;">${book.author}</p>
                            <div style="margin-top: 10px; font-size: 0.75rem; color: #ff4757; font-weight: 700;">
                                <span class="heart-animation">❤️</span> TOP FAVORITE
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <p style="text-align: center; margin-bottom: 2rem; opacity: 0.7; font-weight: 500;">
                Books owned by your connected community that you're eyeing.
            </p>
            <div class="books-grid">
                ${communityWishlist.map(book => `
                    <div class="book-card fav-book-card">
                        <div class="book-card-cover">
                            <img src="${book.cover}" alt="${book.title}">
                            <div class="wishlist-badge">Owned by ${book.source}</div>
                            <div class="book-actions">
                                <button class="btn-primary-small" onclick="alert('Borrow request sent to ${book.source}!')">Ask to Borrow</button>
                            </div>
                        </div>
                        <div style="padding: 1rem;">
                            <h4 style="margin-bottom: 5px;">${book.title}</h4>
                            <p style="font-size: 0.8rem; color: #777;">${book.author}</p>
                            <span style="font-size: 0.7rem; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 3px 8px; border-radius: 4px; font-weight: 600;">WISHLISTED</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    `;

    window.renderFavorites = renderFavorites;
}

window.renderFavorites = renderFavorites;

// Logic Handlers
function renderSettings(container) {
    container.innerHTML = `
        <h2 class="section-title">Settings</h2>
        <div class="pro-form-card" style="padding: 2rem;">
            <div style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);">
                <h3 style="margin-bottom: 1rem;">Appearance</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-weight: 600;">Dark Mode</p>
                        <p style="font-size: 0.8rem; opacity: 0.6;">Toggle between light and dark themes.</p>
                    </div>
                    <button onclick="toggleTheme()" class="pro-btn" style="width: auto; padding: 0.8rem 1.5rem; border-radius: 30px;">
                        Switch Theme
                    </button>
                </div>
            </div>

            <div style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);">
                <h3 style="margin-bottom: 1rem;">Notifications</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" checked> Email notifications for new messages
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" checked> Alerts for overdue rentals
                    </label>
                </div>
            </div>

            <button class="pro-btn" style="background: #777;">Deactivate Account</button>
        </div>
    `;
}

function renderProfile(container) {
    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-header-banner" id="profileBanner" style="${localStorage.getItem('profileBanner') ? `background-image: url(${localStorage.getItem('profileBanner')})` : ''}">
                <button class="change-cover-btn" onclick="triggerCoverUpload()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    Change Cover
                </button>
                <input type="file" id="coverPhotoInput" style="display: none;" accept="image/*" onchange="handleCoverChange(this)">
            </div>
            
            <div class="profile-info-section">
                <div class="profile-avatar-wrapper">
                    <img src="https://ui-avatars.com/api/?name=Arin+Shrivastava&background=2B4C7E&color=fff&size=128" alt="Arin" class="profile-avatar-main" id="profileAvatar">
                    <button class="change-photo-btn" onclick="triggerPhotoUpload()" title="Change Photo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                    </button>
                    <input type="file" id="profilePhotoInput" style="display: none;" accept="image/*" onchange="handlePhotoChange(this)">
                </div>

                <div class="profile-main-meta">
                    <div class="profile-title-area">
                        <h2>Arin Shrivastava</h2>
                        <p>Collector Level: Master Librarian 📚</p>
                    </div>
                    <div class="profile-actions">
                        <button class="pro-btn" onclick="openEditProfileModal()">Edit Profile</button>
                        <button class="btn-primary-small" style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); border: 1px solid var(--primary);" onclick="alert('Profile shared!')">Share Profile</button>
                    </div>
                </div>

                <div class="profile-tabs-nav">
                    <div class="profile-tab-item active" onclick="switchProfileTab(this, 'about')">About</div>
                    <div class="profile-tab-item" onclick="switchProfileTab(this, 'shelf')">My Shelf</div>
                    <div class="profile-tab-item" onclick="switchProfileTab(this, 'activity')">Activity</div>
                </div>

                <div id="profile-tab-content">
                    <div class="profile-content-grid">
                        <div class="profile-main-column">
                            <div class="profile-sidebar-card" style="margin-bottom: 2rem; background: var(--bg-white);">
                                <h4>Biography</h4>
                                <p style="line-height: 1.8; opacity: 0.8; margin-bottom: 1.5rem;">Passionate reader and collector of rare Sci-Fi editions. Always looking for a good trade and discussing narrative structures in 20th-century literature. Currently building a comprehensive collection of first-edition Dune books.</p>
                                
                                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                                    <span style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">#SciFiCollector</span>
                                    <span style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">#RareBooks</span>
                                    <span style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">#DuneFan</span>
                                </div>
                            </div>

                            <div class="stats-row">
                                <div class="stat-card-mini">
                                    <span class="value">112</span>
                                    <span class="label">Total Books</span>
                                </div>
                                <div class="stat-card-mini">
                                    <span class="value">42</span>
                                    <span class="label">Followers</span>
                                </div>
                                <div class="stat-card-mini">
                                    <span class="value">89</span>
                                    <span class="label">Trust Score</span>
                                </div>
                            </div>
                        </div>

                        <div class="profile-side-column">
                            <div class="profile-sidebar-card">
                                <h4>Personal Info</h4>
                                <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem;">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="opacity: 0.6;">Joined</span>
                                        <strong>Jan 2024</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="opacity: 0.6;">Location</span>
                                        <strong>New Delhi, IN</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="opacity: 0.6;">Top Genre</span>
                                        <strong>Sci-Fi / Thriller</strong>
                                    </div>
                                </div>
                            <div class="profile-sidebar-card" style="margin-top: 1.5rem;">
                                <h4>Recently Read</h4>
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <img src="pic/burning-ground.jpg" style="width: 50px; border-radius: 4px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
                                    <img src="pic/fourth-girl.jpg" style="width: 50px; border-radius: 4px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
                                    <div style="width: 50px; height: 75px; background: var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; opacity: 0.5;">+5</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="editModalContainer"></div>
    `;
}

// Logic Handlers
window.setReadingGoal = () => {
    const newGoal = prompt("Set your 2026 reading goal:", userStats.readingGoal);
    if (newGoal && !isNaN(newGoal)) {
        userStats.readingGoal = parseInt(newGoal);
        renderLibrary(document.getElementById('page-content'));
    }
};

window.toggleTheme = () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

window.handleBookSubmit = async (e) => {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Adding...';
    submitBtn.disabled = true;

    const newBook = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        genre: document.getElementById('bookGenre').value,
        year: document.getElementById('bookYear').value,
        cover: "pic/city-we-became.jpg", // Default placeholder for now
        price: "$15.00",
        notes: document.getElementById('bookDesc').value
    };

    try {
        await BookApp.addBook(newBook);

        // Refresh local data
        myLibrary.push(newBook); // Optimistic update
        await initData(); // Full refresh

        alert("Success! Book added to your library.");
        renderPage('library');

        // Trigger Notification for new book
        setTimeout(() => {
            showNotification();
        }, 1500);

    } catch (error) {
        alert("Error adding book: " + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// --- PROFILE LOGIC HANDLERS ---

window.triggerPhotoUpload = () => {
    document.getElementById('profilePhotoInput').click();
};

window.handlePhotoChange = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profileAvatar').src = e.target.result;
            // Also update the sidebar avatar
            document.querySelector('.user-profile-mini img').src = e.target.result;
            alert('Profile photo updated successfully!');
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.switchProfileTab = (element, tabName) => {
    document.querySelectorAll('.profile-tab-item').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    const content = document.getElementById('profile-tab-content');
    if (tabName === 'shelf') {
        content.innerHTML = `<div class="books-grid">${myLibrary.slice(0, 4).map(book => `
            <div class="book-card" style="min-height: 250px;">
                <div class="book-card-cover"><img src="${book.cover}"></div>
                <div style="padding: 1rem;"><h4>${book.title}</h4></div>
            </div>
        `).join('')}</div>`;
    } else if (tabName === 'activity') {
        content.innerHTML = `<div class="profile-sidebar-card">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <p>📖 Finished reading <strong>Dune: Messiah</strong> • 2 days ago</p>
                <p>🤝 Lent <strong>Atomic Habits</strong> to Sarah Johnson • 5 days ago</p>
                <p>❤️ Added <strong>Foundation</strong> to Hearted Collection • 1 week ago</p>
            </div>
        </div>`;
    } else {
        renderProfile(document.getElementById('page-content'));
    }
};

window.openEditProfileModal = () => {
    const modalContainer = document.getElementById('editModalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3 style="margin-bottom: 1.5rem;">Edit Profile</h3>
                <div class="floating-group">
                    <input type="text" id="editName" value="Arin Shrivastava" placeholder=" ">
                    <label>Full Name</label>
                </div>
                <div class="floating-group">
                    <textarea id="editBio" placeholder=" " style="height: 100px;">Passionate reader and collector of rare Sci-Fi editions. Always looking for a good trade!</textarea>
                    <label>Bio</label>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="pro-btn" style="flex: 1;" onclick="saveProfile()">Save Changes</button>
                    <button class="pro-btn" style="flex: 1; background: #777;" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;
};

window.closeModal = () => {
    document.getElementById('editModalContainer').innerHTML = '';
};

window.saveProfile = () => {
    const newName = document.getElementById('editName').value;
    alert(`Profile updated for ${newName}!`);
    closeModal();
};

function renderMessages(container) {
    const conversations = [
        { id: 1, name: "Sarah Johnson", lastMsg: "Hey, do you still have that Dune edition?", time: "2m", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=D4AF37&color=fff", active: true },
        { id: 2, name: "Michael Chen", lastMsg: "The trade sounds good to me!", time: "1h", avatar: "https://ui-avatars.com/api/?name=Mike+C&background=2C3E50&color=fff", active: false },
        { id: 3, name: "Emily Watson", lastMsg: "Thanks for the recommendation!", time: "5h", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=E74C3C&color=fff", active: false }
    ];

    container.innerHTML = `
        <div class="messages-page-wrapper">
            <div class="messages-card">
                <div class="chat-sidebar">
                    <div class="chat-sidebar-header">
                        <h3>Messages</h3>
                        <button class="new-chat-btn"><i class="fas fa-edit"></i></button>
                    </div>
                    <div class="conversations-list">
                        ${conversations.map(conv => `
                            <div class="conv-item ${conv.active ? 'active' : ''}" onclick="window.switchConversation(${conv.id})">
                                <img src="${conv.avatar}" alt="${conv.name}">
                                <div class="conv-info">
                                    <div class="conv-name-row">
                                        <h4>${conv.name}</h4>
                                        <span>${conv.time}</span>
                                    </div>
                                    <p>${conv.lastMsg}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="chat-main">
                    <div class="chat-header">
                        <img src="${conversations[0].avatar}" alt="${conversations[0].name}">
                        <div class="chat-user-info">
                            <h4>${conversations[0].name}</h4>
                            <p>Online</p>
                        </div>
                        <div class="chat-actions">
                            <button><i class="fas fa-phone-alt"></i></button>
                            <button><i class="fas fa-video"></i></button>
                            <button><i class="fas fa-info-circle"></i></button>
                        </div>
                    </div>
                    <div class="chat-messages" id="chat-messages-scroll">
                        <div class="message-bubble received">
                            <p>Hey! I saw your collection earlier. That 1965 Dune copy is incredible!</p>
                            <span class="msg-time">10:42 AM</span>
                        </div>
                        <div class="message-bubble sent">
                            <p>Thanks Sarah! It's one of my favorites. Took me years to track down a near-mint version.</p>
                            <span class="msg-time">10:45 AM</span>
                        </div>
                        <div class="message-bubble received">
                            <p>I can imagine. Hey, do you still have that Dune edition? I'd love to discuss a potential trade if you're interested.</p>
                            <span class="msg-time">2m ago</span>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <button class="attach-btn"><i class="fas fa-plus"></i></button>
                        <input type="text" placeholder="Type a message..." id="messageInput">
                        <button class="send-msg-btn" onclick="window.sendMessage()"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Scroll to bottom
    setTimeout(() => {
        const scroll = document.getElementById('chat-messages-scroll');
        if (scroll) scroll.scrollTop = scroll.scrollHeight;
    }, 100);
}

window.switchConversation = (id) => {
    // Mock switch - for now just alert or re-render same
    alert(`Switching to conversation ${id} (Mock)`);
};

window.sendMessage = () => {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    const scroll = document.getElementById('chat-messages-scroll');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-bubble sent';
    msgDiv.innerHTML = `
        <p>${text}</p>
        <span class="msg-time">Just now</span>
    `;
    scroll.appendChild(msgDiv);
    input.value = '';
    scroll.scrollTop = scroll.scrollHeight;

    // Simulate Reply Notification
    setTimeout(() => {
        showNotification();
        console.log("Mock Reply Notification Triggered");
    }, 3000);
};

// --- COVER PHOTO HANDLERS ---
window.triggerCoverUpload = () => {
    document.getElementById('coverPhotoInput').click();
};

window.handleCoverChange = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const banner = document.getElementById('profileBanner');
            if (banner) {
                banner.style.backgroundImage = `url(${e.target.result})`;
                localStorage.setItem('profileBanner', e.target.result);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};

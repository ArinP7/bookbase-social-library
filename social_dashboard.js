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

    // Logout Listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                BookApp.logout();
            }
        });
    }

    // AUTH LISTENER FOR REAL-TIME DATA SYNC
    if (BookApp.auth) {
        BookApp.auth.onAuthStateChanged(user => {
            if (user) {
                console.log("Dashboard: User authenticated, refreshing view...");
                // Reload current page to reflect user data (e.g. Profile name)
                const activeNav = document.querySelector('.nav-item.active');
                const pageId = activeNav ? activeNav.getAttribute('data-page') : 'discover';
                renderPage(pageId);

                // Update User Profile Mini if present
                const miniProfile = document.querySelector('.user-profile-mini span');
                if (miniProfile) miniProfile.textContent = user.displayName || "User";
            }
        });
    }
});

// ... (initNotifications, showNotification, initTheme remain same) ...

// State Management
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    readingGoal: 30,
    booksRead: 12
};

// Mock Data
const mockBooks = JSON.parse(localStorage.getItem('myLibrary')) || [
    { title: "Project Hail Mary", author: "Andy Weir", cover: "pic/city-we-became.jpg", genre: "Sci-Fi", price: "$14.99" },
    { title: "Dune", author: "Frank Herbert", cover: "pic/fourth-girl.jpg", genre: "Sci-Fi", price: "$12.50" },
    { title: "Klara and the Sun", author: "Kazuo Ishiguro", cover: "pic/foster.jpg", genre: "Sci-Fi", price: "$15.00" },
    { title: "Since We Fell", author: "Dennis Lehane", cover: "pic/since-we-fell.jpg", genre: "Thriller", price: "$11.90" },
    { title: "The Midnight Library", author: "Matt Haig", cover: "pic/burning-ground.jpg", genre: "Fantasy", price: "$13.25" },
    { title: "Sorrow and Bliss", author: "Meg Mason", cover: "pic/sorrow-and-bliss.jpg", genre: "Romance", price: "$12.00" },
    { title: "The Fourth Girl", author: "S.B. Caves", cover: "pic/available-dark.jpg", genre: "Horror", price: "$10.50" },
    { title: "Truevine", author: "Beth Macy", cover: "pic/truevine.jpg", genre: "Thriller", price: "$11.00" },
    { title: "Order from Chaos", author: "Lizzy Bennet", cover: "pic/order-from-chaos.jpg", genre: "Romance", price: "$9.99" },
    { title: "The Bees", author: "Laline Paull", cover: "pic/the-bees.jpg", genre: "Thriller", price: "$14.00" },
    { title: "Wrong Unit", author: "Rob Dircks", cover: "pic/wrong-unit.jpg", genre: "Sci-Fi", price: "$11.50" },
];

function getGenreStats() {
    const total = mockBooks.length;
    const counts = {};
    mockBooks.forEach(b => counts[b.genre] = (counts[b.genre] || 0) + 1);

    // Sort buy highest percentage to find dominant genre
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
            ${mockBooks.map(book => `
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

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const allBooks = document.querySelectorAll('.book-card');

            allBooks.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const author = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(term) || author.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
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

                    <div class="file-upload-trigger" style="margin-bottom: 2rem;" onclick="document.querySelector('.file-upload-trigger input[type=\'file\']').click()">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin-bottom: 1rem;">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p style="font-weight: 600; font-size: 0.9rem;">Upload Book Photos</p>
                        <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 5px;">Drag & drop or click to browse (Max 5 photos)</p>
                        <input type="file" multiple accept="image/*" style="display: none;" onclick="event.stopPropagation()">
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
    const rentals = JSON.parse(localStorage.getItem('myRentals')) || [];

    // Calculate stats
    const activeRentals = rentals.filter(r => new Date(r.dueDate) > new Date() && r.status === 'Active').length;
    const overdueRentals = rentals.filter(r => new Date(r.dueDate) < new Date() && r.status === 'Active').length;

    container.innerHTML = `
        <h2 class="section-title">Lending & Rentals</h2>
        
        <div class="stats-row">
            <div class="stat-card-mini">
                <span class="label">Lent Out</span>
                <span class="value">${activeRentals}</span>
            </div>
            <div class="stat-card-mini">
                <span class="label">Earned</span>
                <span class="value">$${(rentals.length * 2.50).toFixed(2)}</span>
            </div>
            <div class="stat-card-mini">
                <span class="label">Overdue</span>
                <span class="value" style="color: #ff4757;">${overdueRentals}</span>
            </div>
        </div>

        <div style="margin-bottom: 2rem; display: flex; justify-content: flex-end;">
            <button class="pro-btn" onclick="openRentModal()">
                <span>+ Log New Rental</span>
            </button>
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
                <tbody id="rentalTableBody">
                    ${rentals.length > 0 ? rentals.map((r, index) => {
        const isOverdue = new Date(r.dueDate) < new Date() && r.status === 'Active';
        const statusClass = isOverdue ? 'color: #ff4757; background: rgba(255,71,87,0.1);' : 'color: #00695c; background: rgba(0,105,92,0.1);';
        const statusText = isOverdue ? 'Overdue' : r.status;

        return `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 1.2rem;"><strong>${r.bookName}</strong></td>
                            <td style="padding: 1.2rem;">${r.renterName}</td>
                            <td style="padding: 1.2rem; ${isOverdue ? 'color: #ff4757;' : ''}">${new Date(r.dueDate).toLocaleDateString()}</td>
                            <td style="padding: 1.2rem;"><span style="${statusClass} padding: 4px 8px; border-radius: 4px;">${statusText}</span></td>
                            <td style="padding: 1.2rem;">
                                ${r.status === 'Active' ?
                `<button onclick="markAsReturned(${index})" style="background: none; border: 1px solid var(--primary); color: var(--primary); padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Return</button>` :
                `<span style="opacity: 0.5;">Completed</span>`
            }
                            </td>
                        </tr>`;
    }).join('') : `<tr><td colspan="5" style="padding: 2rem; text-align: center; opacity: 0.6;">No active rentals. Log one to get started!</td></tr>`}
                </tbody>
            </table>
        </div>
        
        <div id="rentModalContainer"></div>
    `;
}

window.openRentModal = () => {
    const modalContainer = document.getElementById('rentModalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-content" style="background: white; padding: 2rem; border-radius: 15px; width: 90%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 1.5rem;">Log New Rental</h3>
                
                <div class="floating-group" style="margin-bottom: 1rem;">
                    <input type="text" id="rentBookName" placeholder=" " required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    <label style="position: absolute; left: 12px; top: -10px; background: white; padding: 0 5px; font-size: 0.8rem; color: #666;">Book Name</label>
                </div>

                <div class="floating-group" style="margin-bottom: 1rem;">
                    <input type="text" id="renterName" placeholder=" " required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    <label style="position: absolute; left: 12px; top: -10px; background: white; padding: 0 5px; font-size: 0.8rem; color: #666;">Renter Name</label>
                </div>

                <div class="floating-group" style="margin-bottom: 2rem;">
                    <input type="date" id="rentDueDate" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    <label style="position: absolute; left: 12px; top: -10px; background: white; padding: 0 5px; font-size: 0.8rem; color: #666;">Due Date</label>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button class="pro-btn" style="flex: 1;" onclick="handleRentSubmit()">Log Rental</button>
                    <button class="pro-btn" style="flex: 1; background: #777;" onclick="document.getElementById('rentModalContainer').innerHTML = ''">Cancel</button>
                </div>
            </div>
        </div>
    `;
};

window.handleRentSubmit = () => {
    const bookName = document.getElementById('rentBookName').value;
    const renterName = document.getElementById('renterName').value;
    const dueDate = document.getElementById('rentDueDate').value;

    if (!bookName || !renterName || !dueDate) {
        alert("Please fill in all fields.");
        return;
    }

    const newRental = {
        bookName,
        renterName,
        dueDate,
        status: 'Active',
        dateLent: new Date().toISOString()
    };

    const rentals = JSON.parse(localStorage.getItem('myRentals')) || [];
    rentals.unshift(newRental);
    localStorage.setItem('myRentals', JSON.stringify(rentals));

    alert("Rental logged successfully!");
    document.getElementById('rentModalContainer').innerHTML = '';
    renderRentPage(document.getElementById('page-content'));
};

window.markAsReturned = (index) => {
    const rentals = JSON.parse(localStorage.getItem('myRentals')) || [];
    if (rentals[index]) {
        rentals[index].status = 'Returned';
        localStorage.setItem('myRentals', JSON.stringify(rentals));
        renderRentPage(document.getElementById('page-content'));
    }
};


function renderLibrary(container, activeGenre = 'All') {
    const genres = ['All', 'Romance', 'Horror', 'Thriller', 'Sci-Fi'];

    // Calculate Genre Stats
    const stats = getGenreStats();

    // Filter books
    const filteredBooks = activeGenre === 'All'
        ? mockBooks
        : mockBooks.filter(book => book.genre === activeGenre);

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
    const user = BookApp.auth.currentUser;
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {
        name: user ? (user.displayName || "User") : "Loading Profile...",
        bio: "Passionate reader and collector of rare Sci-Fi editions. Always looking for a good trade and discussing narrative structures in 20th-century literature. Currently building a comprehensive collection of first-edition Dune books."
    };

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
                    <img src="${BookApp.auth.currentUser ? (BookApp.auth.currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=2B4C7E&color=fff&size=128`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=2B4C7E&color=fff&size=128`}" alt="${profileData.name}" class="profile-avatar-main" id="profileAvatar">
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
                        <h2>${profileData.name}</h2>
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
                                <p style="line-height: 1.8; opacity: 0.8; margin-bottom: 1.5rem;">${profileData.bio}</p>
                                
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
        localStorage.setItem('userStats', JSON.stringify(userStats));
        renderLibrary(document.getElementById('page-content'));

        // Also update discover page if valid
        const discoverContainer = document.querySelector('.ai-analyst-card'); // Simple check if on discover page
        if (discoverContainer) renderDiscover(document.getElementById('page-content'));
    }
};

window.toggleTheme = () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

window.handleBookSubmit = (e) => {
    e.preventDefault();

    const fileInput = document.querySelector('.file-upload-trigger input[type="file"]');
    const file = fileInput.files[0];

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Uploading...';
    submitBtn.disabled = true;

    const saveBook = (coverUrl) => {
        const newBook = {
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            genre: document.getElementById('bookGenre').value,
            year: document.getElementById('bookYear').value,
            cover: coverUrl || "pic/city-we-became.jpg",
            price: "$15.00",
            ownerId: BookApp.auth.currentUser ? BookApp.auth.currentUser.uid : 'anonymous'
        };

        mockBooks.push(newBook);
        localStorage.setItem('myLibrary', JSON.stringify(mockBooks));

        alert("Success! Book added to your library.");
        renderPage('library');

        // Trigger Notification for new book
        setTimeout(() => {
            showNotification();
            console.log("Book Upload Notification Triggered");
        }, 1500);
    };

    if (file) {
        const path = `books/${Date.now()}_${file.name}`;
        BookApp.uploadFile(file, path)
            .then(url => {
                saveBook(url);
            })
            .catch(error => {
                console.error("Cover upload failed:", error);
                alert("Cover upload failed, using default image. Error: " + error.message);
                saveBook(null);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    } else {
        saveBook(null);
    }
};

// --- PROFILE LOGIC HANDLERS ---

window.triggerPhotoUpload = () => {
    document.getElementById('profilePhotoInput').click();
};

window.handlePhotoChange = (input) => {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const user = BookApp.auth.currentUser;

        if (!user) {
            alert("You must be logged in to upload a photo.");
            return;
        }

        // Show loading state (optional but good UX)
        const btn = document.querySelector('.change-photo-btn');
        const originalBtnContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        const path = `users/${user.uid}/avatar_${Date.now()}_${file.name}`;

        BookApp.uploadFile(file, path)
            .then(url => {
                document.getElementById('profileAvatar').src = url;
                document.querySelector('.user-profile-mini img').src = url;

                // Update Firestore
                return BookApp.db.collection('users').doc(user.uid).update({
                    avatar: url
                });
            })
            .then(() => {
                alert('Profile photo updated successfully!');
            })
            .catch(error => {
                console.error("Upload failed:", error);
                alert("Upload failed: " + error.message);
            })
            .finally(() => {
                btn.innerHTML = originalBtnContent;
            });
    }
};

window.switchProfileTab = (element, tabName) => {
    document.querySelectorAll('.profile-tab-item').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    const content = document.getElementById('profile-tab-content');
    if (tabName === 'shelf') {
        content.innerHTML = `<div class="books-grid">${mockBooks.slice(0, 4).map(book => `
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
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {
        name: "Arin Shrivastava",
        bio: "Passionate reader and collector of rare Sci-Fi editions. Always looking for a good trade!"
    };

    const modalContainer = document.getElementById('editModalContainer');
    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3 style="margin-bottom: 1.5rem;">Edit Profile</h3>
                <div class="floating-group">
                    <input type="text" id="editName" value="${profileData.name}" placeholder=" ">
                    <label>Full Name</label>
                </div>
                <div class="floating-group">
                    <textarea id="editBio" placeholder=" " style="height: 100px;">${profileData.bio}</textarea>
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
    const newBio = document.getElementById('editBio').value;

    const profileData = {
        name: newName,
        bio: newBio
    };

    localStorage.setItem('userProfile', JSON.stringify(profileData));

    // Update UI immediately
    const nameEl = document.querySelector('.profile-title-area h2');
    const bioEl = document.querySelector('.profile-sidebar-card p');
    if (nameEl) nameEl.textContent = newName;
    if (bioEl) bioEl.textContent = newBio;

    alert(`Profile updated for ${newName}!`);
    closeModal();
};

const defaultConversations = [
    {
        id: 1,
        name: "Sarah Johnson",
        lastMsg: "Hey, do you still have that Dune edition?",
        time: "2m",
        avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=D4AF37&color=fff",
        active: true,
        messages: [
            { text: "Hey! I saw your collection earlier. That 1965 Dune copy is incredible!", type: "received", time: "10:42 AM" },
            { text: "Thanks Sarah! It's one of my favorites. Took me years to track down a near-mint version.", type: "sent", time: "10:45 AM" },
            { text: "I can imagine. Hey, do you still have that Dune edition? I'd love to discuss a potential trade if you're interested.", type: "received", time: "2m ago" }
        ]
    },
    {
        id: 2,
        name: "Michael Chen",
        lastMsg: "The trade sounds good to me!",
        time: "1h",
        avatar: "https://ui-avatars.com/api/?name=Mike+C&background=2C3E50&color=fff",
        active: false,
        messages: [
            { text: "Is the copy of 'The Martian' still available?", type: "received", time: "Yesterday" },
            { text: "Yes, it is! Looking for $15.", type: "sent", time: "Yesterday" },
            { text: "The trade sounds good to me!", type: "received", time: "1h ago" }
        ]
    },
    {
        id: 3,
        name: "Emily Watson",
        lastMsg: "Thanks for the recommendation!",
        time: "5h",
        avatar: "https://ui-avatars.com/api/?name=Emily+W&background=E74C3C&color=fff",
        active: false,
        messages: [
            { text: "Do you have any sci-fi recommendations?", type: "received", time: "5h ago" },
            { text: "Definitely check out 'Project Hail Mary'.", type: "sent", time: "5h ago" },
            { text: "Thanks for the recommendation!", type: "received", time: "5h ago" }
        ]
    }
];

function renderMessages(container) {
    let conversations = JSON.parse(localStorage.getItem('messages_data'));
    if (!conversations) {
        conversations = defaultConversations;
        localStorage.setItem('messages_data', JSON.stringify(conversations));
    }

    const activeConv = conversations.find(c => c.active) || conversations[0];

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
                            <div class="conv-item ${conv.active ? 'active' : ''}" data-id="${conv.id}" onclick="window.switchConversation(${conv.id})">
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
                        <img src="${activeConv.avatar}" alt="${activeConv.name}">
                        <div class="chat-user-info">
                            <h4>${activeConv.name}</h4>
                            <p>Online</p>
                        </div>
                        <div class="chat-actions">
                            <button><i class="fas fa-phone-alt"></i></button>
                            <button><i class="fas fa-video"></i></button>
                            <button><i class="fas fa-info-circle"></i></button>
                        </div>
                    </div>
                    <div class="chat-messages" id="chat-messages-scroll">
                        ${activeConv.messages.map(msg => `
                            <div class="message-bubble ${msg.type}">
                                <p>${msg.text}</p>
                                <span class="msg-time">${msg.time}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chat-input-area">
                        <button class="attach-btn"><i class="fas fa-plus"></i></button>
                        <input type="text" placeholder="Type a message..." id="messageInput" onkeypress="handleEnter(event)">
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

    window.handleEnter = (e) => {
        if (e.key === 'Enter') window.sendMessage();
    };
}

window.switchConversation = (id) => {
    // Update active class
    document.querySelectorAll('.conv-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.id) === id) {
            item.classList.add('active');
        }
    });

    const conversations = [
        { id: 1, name: "Sarah Johnson", lastMsg: "Hey, do you still have that Dune edition?", time: "2m", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=D4AF37&color=fff", active: true },
        { id: 2, name: "Michael Chen", lastMsg: "The trade sounds good to me!", time: "1h", avatar: "https://ui-avatars.com/api/?name=Mike+C&background=2C3E50&color=fff", active: false },
        { id: 3, name: "Emily Watson", lastMsg: "Thanks for the recommendation!", time: "5h", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=E74C3C&color=fff", active: false }
    ];

    const selectedConv = conversations.find(c => c.id === id);
    if (selectedConv) {
        // Update Header
        const header = document.querySelector('.chat-header');
        if (header) {
            header.innerHTML = `
                <img src="${selectedConv.avatar}" alt="${selectedConv.name}">
                <div class="chat-user-info">
                    <h4>${selectedConv.name}</h4>
                    <p>Online</p>
                </div>
                <div class="chat-actions">
                    <button><i class="fas fa-phone-alt"></i></button>
                    <button><i class="fas fa-video"></i></button>
                    <button><i class="fas fa-info-circle"></i></button>
                </div>
            `;
        }

        // Clear previous mock messages and show a welcome or previous history
        const scroll = document.getElementById('chat-messages-scroll');
        if (scroll) {
            scroll.innerHTML = `
                <div class="message-bubble received">
                    <p>Sample history with ${selectedConv.name}...</p>
                    <span class="msg-time">Earlier</span>
                </div>
                <div class="message-bubble received">
                    <p>${selectedConv.lastMsg}</p>
                    <span class="msg-time">${selectedConv.time}</span>
                </div>
            `;
        }
    }
};

window.sendMessage = () => {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    let conversations = JSON.parse(localStorage.getItem('messages_data'));
    const activeConvIndex = conversations.findIndex(c => c.active);
    if (activeConvIndex === -1) return;

    const newMessage = {
        text: text,
        type: "sent",
        time: "Just now"
    };

    // Update Local State
    conversations[activeConvIndex].messages.push(newMessage);
    conversations[activeConvIndex].lastMsg = text;
    conversations[activeConvIndex].time = "Just now";

    // Save to localStorage
    localStorage.setItem('messages_data', JSON.stringify(conversations));

    // Re-render to update UI
    renderMessages(document.getElementById('page-content'));

    // Simulate Reply
    setTimeout(() => {
        let currentConvs = JSON.parse(localStorage.getItem('messages_data'));
        // Find index again as iter might have changed if user switched (though unlikely in 3s without re-render issues)
        // Better to use ID
        const targetId = conversations[activeConvIndex].id;
        const targetIndex = currentConvs.findIndex(c => c.id === targetId);

        if (targetIndex !== -1) {
            const replyMsg = {
                text: "Thanks for your message! This is an automated reply.",
                type: "received",
                time: "Just now"
            };
            currentConvs[targetIndex].messages.push(replyMsg);
            currentConvs[targetIndex].lastMsg = "Thanks for your message! This is an automated reply.";
            currentConvs[targetIndex].time = "Just now";

            localStorage.setItem('messages_data', JSON.stringify(currentConvs));

            // Only re-render if we are still on that page
            const currentActive = currentConvs.find(c => c.active);
            if (currentActive && currentActive.id === targetId) {
                renderMessages(document.getElementById('page-content'));
                showNotification();
            } else {
                showNotification();
            }
        }
    }, 1500);
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

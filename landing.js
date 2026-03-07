// Book data for carousel and trending
const demoBooks = [
    { title: 'Available Dark', author: 'Elizabeth Hand', cover: 'available-dark.jpg' },
    { title: 'Burning Ground', author: 'Elara Vance', cover: 'burning-ground.jpg' },
    { title: 'The City We Became', author: 'N.K. Jemisin', cover: 'city-we-became.jpg' },
    { title: 'Company of One', author: 'Paul Jarvis', cover: 'company-of-one.jpg' },
    { title: 'Foster', author: 'Claire Keegan', cover: 'foster.jpg' },
    { title: 'The Fourth Girl', author: 'Author Name', cover: 'fourth-girl.jpg' },
    { title: 'He Was There', author: 'Eleanor Blackwood', cover: 'he-was-there.jpg' },
    { title: 'How Fire Runs', author: 'Author Name', cover: 'how-fire-runs.jpg' },
    { title: 'How Innovation Works', author: 'Matt Ridley', cover: 'how-innovation-works.jpg' },
    { title: 'In Another Life', author: 'Lara Chen', cover: 'in-another-life.jpg' },
    { title: 'Order from Chaos', author: 'Author Name', cover: 'order-from-chaos.jpg' },
    { title: 'The Psychology of Money', author: 'Morgan Housel', cover: 'psychology-of-money.jpg' },
    { title: 'Since We Fell', author: 'Ava Reid', cover: 'since-we-fell.jpg' },
    { title: 'Sorrow and Bliss', author: 'Meg Mason', cover: 'sorrow-and-bliss.jpg' },
    { title: 'The Bees', author: 'Laline Paull', cover: 'the-bees.jpg' },
    { title: 'Truevine', author: 'Beth Macy', cover: 'truevine.jpg' },
    { title: 'The Wrong Unit', author: 'Author Name', cover: 'wrong-unit.jpg' }
];

// Initialize carousel
function initCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;

    // Duplicate books for infinite scroll
    const allBooks = [...demoBooks, ...demoBooks];

    allBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'carousel-book';
        bookElement.innerHTML = `
            <img src="pic/${book.cover}" alt="${book.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%232B4C7E%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22white%22 font-size=%2216%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${book.title}%3C/text%3E%3C/svg%3E'">
        `;
        carouselTrack.appendChild(bookElement);
    });
}

// Initialize trending section
function initTrending() {
    const trendingGrid = document.getElementById('trendingGrid');
    if (!trendingGrid) return;

    // Show first 8 books
    const trendingBooks = demoBooks.slice(0, 8);

    trendingBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'trending-book';
        bookElement.innerHTML = `
            <div class="trending-book-cover">
                <img src="pic/${book.cover}" alt="${book.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22420%22%3E%3Crect fill=%22%232B4C7E%22 width=%22280%22 height=%22420%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22white%22 font-size=%2218%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${book.title}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="trending-book-info">
                <div class="trending-book-title">${book.title}</div>
                <div class="trending-book-author">${book.author}</div>
                <div class="trending-book-meta">
                    <span>⭐ 4.5</span>
                    <span>• ${Math.floor(Math.random() * 500 + 100)} readers</span>
                </div>
            </div>
        `;
        trendingGrid.appendChild(bookElement);
    });
}

// Theme Initialization
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    const updateIcons = (isDark) => {
        if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
        if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';
    };

    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        updateIcons(isDark);
    };

    // Check saved theme
    const isDark = localStorage.getItem('theme') === 'dark';
    applyTheme(isDark);

    themeToggle.addEventListener('click', () => {
        const currentlyDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
        updateIcons(currentlyDark);
    });

    // Sync theme across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            applyTheme(e.newValue === 'dark');
        }
    });
}

// Hero Search Functionality
function performHeroSearch() {
    const searchInput = document.getElementById('heroSearchInput');
    const searchTerm = searchInput?.value.trim();
    
    if (!searchTerm) {
        alert('Please enter a search term to find books.');
        if (searchInput) searchInput.focus();
        return;
    }

    // Check if demoBooks contains the search term
    const results = demoBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length > 0) {
        // Store search results and navigate to discover section
        localStorage.setItem('searchResults', JSON.stringify(results));
        localStorage.setItem('searchTerm', searchTerm);
        
        // Scroll to discover section or show results
        const discoverSection = document.getElementById('discover');
        if (discoverSection) {
            discoverSection.scrollIntoView({ behavior: 'smooth' });
            
            // Show search results in trending grid
            const trendingGrid = document.getElementById('trendingGrid');
            if (trendingGrid) {
                trendingGrid.innerHTML = '';
                results.forEach(book => {
                    const bookElement = document.createElement('div');
                    bookElement.className = 'trending-book';
                    bookElement.innerHTML = `
                        <div class="trending-book-cover">
                            <img src="pic/${book.cover}" alt="${book.title}">
                        </div>
                        <div class="trending-book-info">
                            <div class="trending-book-title">${book.title}</div>
                            <div class="trending-book-author">${book.author}</div>
                            <div class="trending-book-meta">
                                <span>⭐ 4.5</span>
                                <span>• ${Math.floor(Math.random() * 500 + 100)} readers</span>
                            </div>
                        </div>
                    `;
                    trendingGrid.appendChild(bookElement);
                });
            }
            
            // Update section title to show search results
            const sectionTitle = document.querySelector('#discover .section-title');
            if (sectionTitle) {
                sectionTitle.textContent = `Search Results for "${searchTerm}"`;
            }
            
            alert(`Found ${results.length} book(s) matching "${searchTerm}". Check the Discover section below!`);
        }
    } else {
        alert(`No books found matching "${searchTerm}". Try searching for titles like "Available Dark", "The Bees", or authors like "N.K. Jemisin".`);
    }
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Feedback form submission
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your feedback! We will get back to you soon.');
        feedbackForm.reset();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initTrending();
    initTheme();
    
    // Hero Search - Allow Enter key to trigger search
    const searchInput = document.getElementById('heroSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performHeroSearch();
            }
        });
    }
});


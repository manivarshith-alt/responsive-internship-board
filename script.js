let allInternships = [];

// DOM Elements
const listContainer = document.getElementById('internship-list');
const searchInput = document.getElementById('search-input');
const domainFilter = document.getElementById('domain-filter');
const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');

// Fetch Data from data.json
async function loadInternships() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load JSON');
        }
        const data = await response.json();
        allInternships = data.internships || [];
        renderCards(allInternships);
    } catch (error) {
        console.error('Error fetching data:', error);
        errorState.hidden = false;
        listContainer.innerHTML = '';
    }
}

// Function to render internship cards
function renderCards(internships) {
    listContainer.innerHTML = '';

    if (internships.length === 0) {
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    internships.forEach(item => {
        const card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('tabindex', '0'); // Make focusable for keyboard navigation

        const skillsHTML = item.skills
            ? item.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
            : '';

        card.innerHTML = `
            <div>
                <h3>${item.title}</h3>
                <span class="badge">${item.domain}</span>
                <p><strong>Mode:</strong> ${item.mode} (${item.location})</p>
                <p><strong>Openings:</strong> ${item.openings}</p>
                <div class="skills">${skillsHTML}</div>
            </div>
        `;

        listContainer.appendChild(card);
    });
}

// Filter Function
function filterInternships() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedDomain = domainFilter.value;

    const filtered = allInternships.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
            (item.skills && item.skills.some(skill => skill.toLowerCase().includes(searchTerm)));

        const matchesDomain = selectedDomain === '' || item.domain === selectedDomain;

        return matchesSearch && matchesDomain;
    });

    renderCards(filtered);
}

// Event Listeners
searchInput.addEventListener('input', filterInternships);
domainFilter.addEventListener('change', filterInternships);

// Initialize
loadInternships();
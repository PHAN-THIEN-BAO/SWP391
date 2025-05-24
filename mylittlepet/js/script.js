// Game Admin Dashboard JavaScript

// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const pages = document.querySelectorAll('.page');
const playerModal = document.getElementById('player-modal');
const itemModal = document.getElementById('item-modal');
const addPlayerBtn = document.getElementById('add-player');
const addItemBtn = document.getElementById('add-item');
const closeModalBtns = document.querySelectorAll('.close-modal');
const playerForm = document.getElementById('player-form');
const itemForm = document.getElementById('item-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Navigation functionality
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(item => item.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        // Hide all pages
        pages.forEach(page => page.classList.add('hidden'));
        
        // Show the corresponding page
        const pageName = link.getAttribute('data-page');
        if (pageName) {
            document.getElementById(`${pageName}-page`).classList.remove('hidden');
        }
    });
});

// Modal functionality
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Add event listeners for opening modals
if (addPlayerBtn) {
    addPlayerBtn.addEventListener('click', () => {
        document.getElementById('player-modal-title').textContent = 'Add New Player';
        document.getElementById('player-form').reset();
        openModal(playerModal);
    });
}

if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
        document.getElementById('item-modal-title').textContent = 'Add New Item';
        document.getElementById('item-form').reset();
        openModal(itemModal);
    });
}

// Close modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Form submission
if (playerForm) {
    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const username = document.getElementById('player-username').value;
        const email = document.getElementById('player-email').value;
        const level = document.getElementById('player-level').value;
        const status = document.getElementById('player-status').value;
        
        // In a real app, you'd send this data to a server
        console.log('Player data:', { username, email, level, status });
        
        // For demo purposes, add to table
        const playersTable = document.getElementById('players-table');
        const tbody = playersTable.querySelector('tbody');
        const rowCount = tbody.rows.length;
        
        const newRow = tbody.insertRow();
        newRow.innerHTML = `
            <td>${rowCount + 1}</td>
            <td>${username}</td>
            <td>${email}</td>
            <td>${level}</td>
            <td>${getCurrentDate()}</td>
            <td><span class="status ${status}">${status === 'active' ? 'Active' : status === 'inactive' ? 'Suspended' : 'Banned'}</span></td>
            <td>
                <button class="btn-action view"><i class="fas fa-eye"></i></button>
                <button class="btn-action edit"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to the new buttons
        addActionButtonListeners(newRow);
        
        // Close the modal
        closeModal(playerModal);
    });
}

if (itemForm) {
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const rarity = document.getElementById('item-rarity').value;
        const value = document.getElementById('item-value').value;
        const owner = document.getElementById('item-owner').value;
        
        // In a real app, you'd send this data to a server
        console.log('Item data:', { name, category, rarity, value, owner });
        
        // For demo purposes, add to table
        const itemsTable = document.getElementById('items-table');
        const tbody = itemsTable.querySelector('tbody');
        const rowCount = tbody.rows.length;
        
        const newRow = tbody.insertRow();
        newRow.innerHTML = `
            <td>${100 + rowCount + 1}</td>
            <td>${name}</td>
            <td>${capitalizeFirstLetter(category)}</td>
            <td><span class="rarity ${rarity}">${capitalizeFirstLetter(rarity)}</span></td>
            <td>${value}</td>
            <td>${owner}</td>
            <td>
                <button class="btn-action view"><i class="fas fa-eye"></i></button>
                <button class="btn-action edit"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to the new buttons
        addActionButtonListeners(newRow);
        
        // Close the modal
        closeModal(itemModal);
    });
}

// Search functionality
if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Determine which page is active
    const activePage = document.querySelector('.page:not(.hidden)');
    const isPlayersPage = activePage.id === 'players-page';
    
    // Get the appropriate table
    const table = isPlayersPage ? 
        document.getElementById('players-table') : 
        document.getElementById('items-table');
    
    // Search in the table
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        let found = false;
        const cells = row.querySelectorAll('td');
        
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                found = true;
            }
        });
        
        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Table row action buttons
function addActionButtonListeners(row) {
    // View button
    const viewBtn = row.querySelector('.view');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            const rowData = Array.from(row.cells).map(cell => cell.textContent.trim());
            alert(`Viewing details for: ${rowData[1]}`);
            // In a real app, you'd display detailed information
        });
    }
    
    // Edit button
    const editBtn = row.querySelector('.edit');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const cells = row.cells;
            const currentPage = document.querySelector('.page:not(.hidden)').id;
            
            if (currentPage === 'players-page') {
                document.getElementById('player-modal-title').textContent = 'Edit Player';
                document.getElementById('player-username').value = cells[1].textContent;
                document.getElementById('player-email').value = cells[2].textContent;
                document.getElementById('player-level').value = cells[3].textContent;
                
                // Set status based on text content
                const statusText = cells[5].querySelector('.status').textContent;
                let statusValue = 'active';
                if (statusText === 'Suspended') statusValue = 'inactive';
                if (statusText === 'Banned') statusValue = 'banned';
                document.getElementById('player-status').value = statusValue;
                
                openModal(playerModal);
            } else {
                document.getElementById('item-modal-title').textContent = 'Edit Item';
                document.getElementById('item-name').value = cells[1].textContent;
                
                // Set category based on text content
                const categoryText = cells[2].textContent;
                document.getElementById('item-category').value = categoryText.toLowerCase();
                
                // Set rarity based on class
                const rarityClass = cells[3].querySelector('.rarity').classList[1];
                document.getElementById('item-rarity').value = rarityClass;
                
                document.getElementById('item-value').value = cells[4].textContent;
                document.getElementById('item-owner').value = cells[5].textContent;
                
                openModal(itemModal);
            }
        });
    }
    
    // Delete button
    const deleteBtn = row.querySelector('.delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this item?')) {
                row.remove();
            }
        });
    }
}

// Initialize action buttons for existing rows
document.querySelectorAll('.data-table tbody tr').forEach(row => {
    addActionButtonListeners(row);
});

// Pagination functionality
document.getElementById('prev-page').addEventListener('click', () => {
    // In a real app, this would load the previous page of data
    alert('Loading previous page...');
});

document.getElementById('next-page').addEventListener('click', () => {
    // In a real app, this would load the next page of data
    alert('Loading next page...');
});

document.getElementById('prev-page-items').addEventListener('click', () => {
    // In a real app, this would load the previous page of data
    alert('Loading previous page...');
});

document.getElementById('next-page-items').addEventListener('click', () => {
    // In a real app, this would load the next page of data
    alert('Loading next page...');
});

// Helper functions
function getCurrentDate() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${month}/${day}/${year}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Statistics Dashboard
let playersChart, itemsChart, statusChart, categoryChart, rarityChart, activePlayersChart;

function initializeStatsDashboard() {
    const refreshStatsBtn = document.getElementById('refresh-stats');
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener('click', updateAllStats);
    }
    
    // Initialize all charts
    createPlayersTrendChart();
    createItemsTrendChart();
    createActivePlayersChart();
    createStatusDistributionChart();
    createPlayerItemsChart();
    createRarityDistributionChart();
    
    // Update the stats counters
    updateStatsCounters();
}

function updateStatsCounters() {
    // Count players
    const playersTable = document.getElementById('players-table');
    const playerRows = playersTable ? playersTable.querySelectorAll('tbody tr') : [];
    const totalPlayers = playerRows.length;
    
    // Count active players
    let activePlayersCount = 0;
    playerRows.forEach(row => {
        const statusCell = row.cells[5];
        const statusText = statusCell.textContent.trim();
        if (statusText === 'Active') {
            activePlayersCount++;
        }
    });
    
    // Count items
    const itemsTable = document.getElementById('items-table');
    const itemRows = itemsTable ? itemsTable.querySelectorAll('tbody tr') : [];
    const totalItems = itemRows.length;
    
    // Update counters
    const totalPlayersElement = document.getElementById('total-players');
    const totalItemsElement = document.getElementById('total-items');
    const activePlayersElement = document.getElementById('active-players-count');
    
    if (totalPlayersElement) totalPlayersElement.textContent = totalPlayers;
    if (totalItemsElement) totalItemsElement.textContent = totalItems;
    if (activePlayersElement) activePlayersElement.textContent = activePlayersCount;
}

function createPlayersTrendChart() {
    const ctx = document.getElementById('players-chart');
    if (!ctx) return;
    
    // Sample data - in a real application, this would come from the backend
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'New Players',
            data: [1, 2, 1, 0, 1],
            backgroundColor: 'rgba(74, 108, 247, 0.2)',
            borderColor: 'rgba(74, 108, 247, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    // Destroy previous chart if it exists
    if (playersChart) {
        playersChart.destroy();
    }
    
    playersChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function createItemsTrendChart() {
    const ctx = document.getElementById('items-chart');
    if (!ctx) return;
    
    // Sample data - in a real application, this would come from the backend
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'New Items',
            data: [1, 1, 2, 0, 1],
            backgroundColor: 'rgba(40, 167, 69, 0.2)',
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    // Destroy previous chart if it exists
    if (itemsChart) {
        itemsChart.destroy();
    }
    
    itemsChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function createStatusDistributionChart() {
    const ctx = document.getElementById('status-chart');
    if (!ctx) return;
    
    // Count players by status
    const playersTable = document.getElementById('players-table');
    const playerRows = playersTable ? playersTable.querySelectorAll('tbody tr') : [];
    
    let activeCount = 0;
    let suspendedCount = 0;
    let bannedCount = 0;
    
    playerRows.forEach(row => {
        const statusCell = row.cells[5];
        const statusText = statusCell.textContent.trim();
        
        if (statusText === 'Active') activeCount++;
        else if (statusText === 'Suspended') suspendedCount++;
        else if (statusText === 'Banned') bannedCount++;
    });
    
    // Create chart
    const data = {
        labels: ['Active', 'Suspended', 'Banned'],
        datasets: [{
            label: 'Player Status',
            data: [activeCount, suspendedCount, bannedCount],
            backgroundColor: [
                'rgba(40, 167, 69, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(220, 53, 69, 0.7)'
            ],
            borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 53, 69, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Destroy previous chart if it exists
    if (statusChart) {
        statusChart.destroy();
    }
    
    statusChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function createPlayerItemsChart() {
    const ctx = document.getElementById('player-items-chart');
    if (!ctx) return;
    
    // Count items by player (owner)
    const itemsTable = document.getElementById('items-table');
    const itemRows = itemsTable ? itemsTable.querySelectorAll('tbody tr') : [];
    
    const playerItemCounts = {};
    
    // Get player data to match IDs with names
    const playersTable = document.getElementById('players-table');
    const playerRows = playersTable ? playersTable.querySelectorAll('tbody tr') : [];
    const playerNames = {};
    
    playerRows.forEach(row => {
        const playerId = row.cells[0].textContent.trim();
        const playerName = row.cells[1].textContent.trim();
        playerNames[playerId] = playerName;
        
        // Initialize counts for all players (even those with no items)
        playerItemCounts[playerId] = 0;
    });
    
    // Count items by player ID
    itemRows.forEach(row => {
        const cells = row.cells;
        if (cells.length >= 6) { // Make sure it's a valid item row with enough cells
            const ownerId = cells[5].textContent.trim();
            
            if (ownerId) {
                if (playerItemCounts[ownerId] !== undefined) {
                    playerItemCounts[ownerId]++;
                } else {
                    playerItemCounts[ownerId] = 1;
                }
            }
        }
    });
    
    // Prepare data for chart
    const playerIds = Object.keys(playerItemCounts);
    const labels = playerIds.map(id => playerNames[id] || `Player ${id}`);
    const data = playerIds.map(id => playerItemCounts[id]);
    
    // Define colors
    const backgroundColors = [
        'rgba(74, 108, 247, 0.7)',
        'rgba(40, 167, 69, 0.7)', 
        'rgba(255, 193, 7, 0.7)',
        'rgba(23, 162, 184, 0.7)',
        'rgba(108, 117, 125, 0.7)'
    ];
    
    const borderColors = [
        'rgba(74, 108, 247, 1)',
        'rgba(40, 167, 69, 1)', 
        'rgba(255, 193, 7, 1)',
        'rgba(23, 162, 184, 1)',
        'rgba(108, 117, 125, 1)'
    ];
    
    // Create chart data
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Items Owned',
            data: data,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: borderColors.slice(0, labels.length),
            borderWidth: 1
        }]
    };
    
    // Destroy previous chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Items Owned by Each Player'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} items`;
                        }
                    }
                }
            }
        }
    });
}

function createRarityDistributionChart() {
    const ctx = document.getElementById('rarity-chart');
    if (!ctx) return;
    
    // Count items by rarity
    const itemsTable = document.getElementById('items-table');
    const itemRows = itemsTable ? itemsTable.querySelectorAll('tbody tr') : [];
    
    let commonCount = 0;
    let uncommonCount = 0;
    let rareCount = 0;
    let epicCount = 0;
    let legendaryCount = 0;
    
    itemRows.forEach(row => {
        const rarityCell = row.cells[3];
        const raritySpan = rarityCell.querySelector('.rarity');
        if (!raritySpan) return;
        
        const rarityClass = Array.from(raritySpan.classList).find(cls => 
            ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(cls)
        );
        
        if (rarityClass === 'common') commonCount++;
        else if (rarityClass === 'uncommon') uncommonCount++;
        else if (rarityClass === 'rare') rareCount++;
        else if (rarityClass === 'epic') epicCount++;
        else if (rarityClass === 'legendary') legendaryCount++;
    });
    
    // Calculate total and percentages
    const total = commonCount + uncommonCount + rareCount + epicCount + legendaryCount;
    
    // Set legendary to 3%
    const legendaryPercent = 3;
    // Adjust other percentages proportionally
    const remainingPercent = 100 - legendaryPercent;
    const otherTotal = total - legendaryCount;
    
    // Calculate proportions for other rarities
    const commonPercent = Math.round((commonCount / otherTotal) * remainingPercent);
    const uncommonPercent = Math.round((uncommonCount / otherTotal) * remainingPercent);
    const rarePercent = Math.round((rareCount / otherTotal) * remainingPercent);
    const epicPercent = Math.round((epicCount / otherTotal) * remainingPercent);
    
    // Create chart
    const data = {
        labels: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
        datasets: [{
            label: 'Items by Rarity',
            data: [commonPercent, uncommonPercent, rarePercent, epicPercent, legendaryPercent],
            backgroundColor: [
                'rgba(142, 146, 151, 0.7)',
                'rgba(30, 255, 0, 0.7)',
                'rgba(0, 112, 221, 0.7)',
                'rgba(163, 53, 238, 0.7)',
                'rgba(255, 128, 0, 0.7)'
            ],
            borderColor: [
                'rgba(142, 146, 151, 1)',
                'rgba(30, 255, 0, 1)',
                'rgba(0, 112, 221, 1)',
                'rgba(163, 53, 238, 1)',
                'rgba(255, 128, 0, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Destroy previous chart if it exists
    if (rarityChart) {
        rarityChart.destroy();
    }
    
    rarityChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function createActivePlayersChart() {
    const ctx = document.getElementById('active-players-chart');
    if (!ctx) return;
    
    // Get current date for the last 7 days
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        dates.push(formattedDate);
    }
    
    // Sample data - in a real application, this would come from the backend
    // The last value matches our current count of active players (4)
    const activePlayers = [3, 3, 4, 3, 3, 4, 4];
    
    // Create chart data
    const data = {
        labels: dates,
        datasets: [{
            label: 'Active Players',
            data: activePlayers,
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(255, 193, 7, 1)'
        }]
    };
    
    // Destroy previous chart if it exists
    if (activePlayersChart) {
        activePlayersChart.destroy();
    }
    
    activePlayersChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    },
                    suggestedMax: 5 // Adjust based on your data
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItem) {
                            return 'Date: ' + tooltipItem[0].label;
                        },
                        label: function(tooltipItem) {
                            return 'Active Players: ' + tooltipItem.raw;
                        }
                    }
                }
            }
        }
    });
}

function updateAllStats() {
    updateStatsCounters();
    createActivePlayersChart();
    createStatusDistributionChart();
    createPlayerItemsChart();
    createRarityDistributionChart();
}

// Initialize the dashboard
window.addEventListener('DOMContentLoaded', () => {
    // Show the first page by default
    navLinks[0].classList.add('active');
    pages[0].classList.remove('hidden');
    
    // Initialize the statistics dashboard
    initializeStatsDashboard();
});

const API_BASE = '/api';

let currentPage = 'dashboard';

// Navigation function
async function navigateTo(page) {
    currentPage = page;
    const mainContent = document.getElementById('main-content');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        const icon = btn.querySelector('.material-symbols-outlined');
        const text = btn.querySelector('p');
        if (icon) icon.classList.remove('text-primary', 'font-fill');
        if (text) text.classList.remove('text-primary');
        if (icon) icon.classList.add('text-slate-400', 'dark:text-slate-500');
        if (text) text.classList.add('text-slate-400', 'dark:text-slate-500');
    });
    
    const activeBtn = document.querySelector(`[data-page="${page}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        const icon = activeBtn.querySelector('.material-symbols-outlined');
        const text = activeBtn.querySelector('p');
        if (icon) icon.classList.remove('text-slate-400', 'dark:text-slate-500');
        if (text) text.classList.remove('text-slate-400', 'dark:text-slate-500');
        if (icon) icon.classList.add('text-primary');
        if (text) text.classList.add('text-primary');
        if (page === 'dashboard' && icon) icon.classList.add('font-fill');
    }
    
    // Load page content
    try {
        const response = await fetch(`pages/${page}.html`);
        const html = await response.text();
        mainContent.innerHTML = html;
        
        // Load page-specific data
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'shipments':
                loadShipments();
                break;
            case 'tracking':
                loadTracking();
                break;
        }
    } catch (error) {
        console.error('Error loading page:', error);
    }
}

// Dashboard functions
async function loadDashboard() {
    // Load recent activity
    try {
        const response = await fetch(`${API_BASE}/shipments`);
        const shipments = await response.json();

        const activityDiv = document.getElementById('recent-activity');
        let activityHtml = '';

        // Mock recent activity based on shipments or default items
        const defaultItems = [
            { origin: 'Chennai', destination: 'Madurai', type: 'Electronic Parts', weight: '420 kg', status: 'Express', eta: 'Arriving in 4h' },
            { origin: 'Coimbatore', destination: 'Tuticorin', type: 'Textile Export', weight: '1,200 kg', status: 'Standard', eta: 'Scheduled' },
            { origin: 'Salem', destination: 'Tiruchirappalli', type: 'Agricultural Goods', weight: '850 kg', status: 'Perishable', eta: 'In Transit' }
        ];

        defaultItems.forEach(item => {
            const statusColor = item.status === 'Express' ? 'blue' : item.status === 'Standard' ? 'emerald' : 'orange';
            activityHtml += `
                <div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined">${item.status === 'Express' ? 'local_shipping' : item.status === 'Standard' ? 'inventory_2' : 'box'}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <p class="font-bold">${item.origin} ➔ ${item.destination}</p>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-${statusColor}-500/20 text-${statusColor}-500 uppercase">${item.status}</span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400">${item.type} • ${item.weight} • ${item.eta}</p>
                    </div>
                </div>
            `;
        });

        activityDiv.innerHTML = activityHtml;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Shipments functions
async function loadShipments() {
    try {
        const response = await fetch(`${API_BASE}/shipments`);
        const shipments = await response.json();
        
        const shipmentsDiv = document.getElementById('shipments-list');
        let shipmentsHtml = '';
        
        Object.entries(shipments).forEach(([id, shipment]) => {
            shipmentsHtml += `
                <div class="p-4 bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-4" onclick="navigateTo('tracking')">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined">local_shipping</span>
                            </div>
                            <div>
                                <p class="text-[10px] text-slate-500 font-bold">#${id}</p>
                                <p class="text-lg font-bold">${shipment.weight || 'N/A'} tons</p>
                            </div>
                        </div>
                        <span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase">In Transit</span>
                    </div>
                    <div class="flex justify-between items-center px-2">
                        <div>
                            <p class="text-[10px] text-slate-500 mb-1 uppercase">Origin</p>
                            <p class="text-sm font-bold">${shipment.origin || 'Unknown'}</p>
                        </div>
                        <span class="material-symbols-outlined text-slate-600">arrow_forward</span>
                        <div class="text-right">
                            <p class="text-[10px] text-slate-500 mb-1 uppercase">Destination</p>
                            <p class="text-sm font-bold">${shipment.destination || 'Unknown'}</p>
                        </div>
                    </div>
                    <div class="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-500">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                                <span class="material-symbols-outlined text-xs">person</span>
                            </div>
                        </div>
                        <p>ETA: Oct 24, 04:30 PM</p>
                    </div>
                </div>
            `;
        });
        
        shipmentsDiv.innerHTML = shipmentsHtml;
    } catch (error) {
        console.error('Error loading shipments:', error);
    }
}

// Create shipment function
async function analyzeShipment() {
    const form = document.getElementById('create-shipment-form');
    const formData = new FormData(form);
    
    const shipmentData = {
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        load_type: document.getElementById('load-type').value,
        weight: parseFloat(document.getElementById('weight').value)
    };
    
    try {
        // Create shipment
        const createResponse = await fetch(`${API_BASE}/create-shipment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shipmentData)
        });
        
        const result = await createResponse.json();
        console.log('Shipment created:', result);
        
        // Navigate to cargo optimization
        navigateTo('dead-space');
        
        // Load cargo match
        loadCargoMatch(shipmentData);
        
    } catch (error) {
        console.error('Error creating shipment:', error);
    }
}

// Load cargo match
async function loadCargoMatch(shipmentData) {
    try {
        const response = await fetch(`${API_BASE}/cargo-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shipmentData)
        });
        
        const matchResult = await response.json();
        
        const matchDiv = document.getElementById('cargo-match-result');
        matchDiv.innerHTML = `
            <div class="p-4 border-b border-borderGray flex justify-between items-center">
                <span class="text-xs font-bold uppercase text-slate-500">Proposed Match</span>
                <span class="text-accentGreen text-[10px] font-bold px-2 py-0.5 bg-accentGreen/10 rounded">94% Efficiency Match</span>
            </div>
            <div class="p-5 space-y-4">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xs text-slate-400">Your Cargo</p>
                        <p class="text-lg font-bold">${shipmentData.weight} Tons</p>
                    </div>
                    <div class="text-primary">
                        <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-slate-400">Available Space</p>
                        <p class="text-lg font-bold">12.0 Tons</p>
                    </div>
                </div>
                <div class="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div class="absolute inset-y-0 left-0 bg-primary w-[70%]"></div>
                    <div class="absolute inset-y-0 left-[70%] bg-accentGreen/50 w-[20%]"></div>
                </div>
                <div class="flex justify-between text-[10px] font-bold">
                    <span class="text-primary uppercase">Your Load</span>
                    <span class="text-accentGreen uppercase">Co-Loader Match</span>
                    <span class="text-slate-600 uppercase">Dead Space</span>
                </div>
            </div>
            <div class="bg-primary/5 p-4 flex justify-between items-center border-t border-borderGray">
                <p class="text-xs font-medium">Estimated Savings:</p>
                <p class="text-accentGreen font-bold">₹4,200 (18%)</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading cargo match:', error);
    }
}

// Route optimization
async function loadRouteOptimization() {
    const routeMap = document.getElementById('route-map');
    const routeOptions = document.getElementById('route-options');
    
    // Mock route map
    routeMap.innerHTML = `
        <div class="absolute inset-0 opacity-20" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVy6QHakP4amC6S22vAjj09areJZ91snyQOBq4eNyZbMP7UTyOmg6ZzJmEHXoFTEHrFbuLbSKwq0USVGE3cQuaETwavNoMn3NQ6y3V9pCX8vGAI4VqqRpEAoYW14xSdvdmMHCc3fGTt5exlV4f9hIdmO2JHH4Bec60IBC1e4QzyPsDd4DJdOJqLw8L7BPpG5hi5yKDHLaVByIkl7CyEoOvMdMtm1l8u_LuBg_W7-BIIJvRw0R8wAgzJ2nhhllSwUGuPWPh22o_GBM'); background-size: cover;"></div>
        <svg class="absolute inset-0 w-full h-full">
            <path d="M50,180 L150,150 L280,100" fill="none" stroke="#ef4444" stroke-dasharray="5,5" stroke-width="3"></path>
            <path d="M50,180 L120,220 L220,200 L280,100" fill="none" stroke="#0d93f2" stroke-width="4"></path>
            <circle cx="50" cy="180" fill="#0d93f2" r="6"></circle>
            <circle cx="280" cy="100" fill="#0d93f2" r="6"></circle>
            <rect fill="#ef4444" height="20" rx="4" transform="rotate(45 150 150)" width="20" x="140" y="140"></rect>
        </svg>
        <div class="absolute top-4 left-4 glass-effect p-2 rounded text-[10px] font-bold border border-borderGray">
            <p>Chennai Port → Coimbatore</p>
        </div>
        <div class="absolute bottom-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
            Optimized Route
        </div>
    `;
    
    routeOptions.innerHTML = `
        <div class="p-4 bg-cardBg border-l-4 border-primary rounded-r-custom space-y-1">
            <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] font-bold text-primary uppercase">Optimized Path (Via Salem)</span>
                <span class="text-accentGreen text-[10px] font-bold">+0 mins delay</span>
            </div>
            <p class="text-sm font-semibold">Self-healed route identified to bypass congestion at Vikravandi Toll Plaza.</p>
            <div class="flex gap-4 pt-2 text-[10px] text-slate-500">
                <span class="flex items-center gap-1"><svg fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Secure</span>
                <span class="flex items-center gap-1"><svg fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Fuel efficient</span>
            </div>
        </div>
        <div class="p-4 bg-cardBg/50 border border-borderGray rounded-custom opacity-50">
            <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Original Path (Via Ulundurpet)</span>
                <span class="text-accentRed text-[10px] font-bold">+145 mins delay</span>
            </div>
            <p class="text-sm font-semibold text-slate-400">Heavy congestion detected. Not recommended.</p>
        </div>
    `;
}

// Deploy shipment
async function deployShipment() {
    // Mock deployment
    alert('Shipment deployed successfully!');
    navigateTo('dashboard');
}

// Tracking
async function loadTracking() {
    const trackingDiv = document.getElementById('tracking-details');
    trackingDiv.innerHTML = `
        <div class="h-48 bg-slate-800 relative">
            <div class="absolute inset-0 opacity-30" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_Yq-FL2_YILJC7aH0J09fVNU6rQUxUTbVJaKNVWutEorl0m86G1GVX4e4bScJSPdFnVZGS2F7JpWDDP4z-BhrHqdW_lowQw6G95Wdck0j8ZSJprowgM2A2omKPP_c6uQ45c8ge-Qoa5th-XM0lZht1z1RJscFcrxMKse18ZgecLE4m3bVgsLS5eNWpg28hTN9dhsveC8bURfmWzZwlWgjGR4xSf7oXtY'); background-size: cover;"></div>
        </div>
    `;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Add navigation event listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.dataset.page;
            navigateTo(page);
        });
    });
    
    // Load initial page
    navigateTo('dashboard');
});
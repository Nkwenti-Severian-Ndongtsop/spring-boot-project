
const BASE_URL = 'http://10.143.124.81:30081';
const API_BASE = `${BASE_URL}/api/tickets`;

const SUCCESS_MESSAGE = '✅ Ticket successfully booked!';
const FORM_ID = 'ticket-form';

const loadTickets = () => {
    fetch(API_BASE)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(renderTickets)
        .catch(error => {
            console.error('Error loading tickets:', error);
            alert('❌ Failed to load tickets.');
        });
};

const handleBookingSuccess = () => {
    alert(SUCCESS_MESSAGE);
    document.getElementById(FORM_ID).reset();
    // Do not call loadTickets here; only reset the form and show alert
};


function searchTickets() {
    const type = document.getElementById('searchType').value;
    const value = document.getElementById('searchInput').value.trim();

    if (!value) {
        alert("⚠️ Please enter a search value.");
        return;
    }

    // Optional: Validate date format
    if (type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        alert("📅 Please enter a valid date in format yyyy-mm-dd.");
        return;
    }

    const searchURL = `${API_BASE}/${type}/${encodeURIComponent(value)}`;
    console.log('Searching with URL:', searchURL); // Debug log

    fetch(searchURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                console.error('Server responded with status:', res.status); // Debug log
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(tickets => {
            console.log('Received tickets:', tickets); // Debug log
            renderTickets(tickets);
        })
        .catch(error => {
            console.error('Error searching tickets:', error);
            alert("❌ Search failed. Please try again.");
        });
}

// --- Booking Logic and Validation ---
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById(FORM_ID);
    if (form) {
        form.addEventListener('submit', bookTicket);
    }
});

function bookTicket(event) {
    event.preventDefault();
    const passengerName = document.getElementById('passengerName').value.trim();
    const kickoffAddress = document.getElementById('kickoffAddress').value.trim();
    const destinationAddress = document.getElementById('destinationAddress').value.trim();

    // Validation
    if (!passengerName || !kickoffAddress || !destinationAddress) {
        alert('⚠️ Please fill in all fields.');
        return;
    }
    if (passengerName.length < 2) {
        alert('⚠️ Passenger name must be at least 2 characters.');
        return;
    }
    if (kickoffAddress.length < 2 || destinationAddress.length < 2) {
        alert('⚠️ Addresses must be at least 2 characters.');
        return;
    }
    if (kickoffAddress === destinationAddress) {
        alert('⚠️ Kickoff and destination cannot be the same.');
        return;
    }

    const ticket = {
        passengerName,
        kickoffAddress,
        destinationAddress
    };

    fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(ticket)
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.message || 'Booking failed'); });
            }
            return res.json();
        })
        .then(handleBookingSuccess)
        .catch(error => {
            console.error('Booking error:', error);
            alert('❌ Booking failed: ' + error.message);
        });
}

// --- Render Tickets ---
function renderTickets(tickets) {
    const tableBody = document.getElementById('tickets-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!Array.isArray(tickets) || tickets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No tickets found.</td></tr>';
        return;
    }
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.id || ''}</td>
            <td>${ticket.passengerName || ''}</td>
            <td>${ticket.kickoffAddress || ''}</td>
            <td>${ticket.destinationAddress || ''}</td>
        `;
        tableBody.appendChild(row);
        });
}


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

function updateTicket(id, ticket) {
    fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(ticket)
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.error || 'Update failed'); });
            }
            return res.json();
        })
        .then(() => {
            alert('✅ Ticket updated successfully!');
            // Refresh the current view
            const isTicketsPage = window.location.pathname.includes('tickets.html');
            if (isTicketsPage) {
                loadTickets(); // Refresh all tickets
            } else {
                // For search page, clear the table
                const tableBody = document.getElementById('tickets-table-body');
                if (tableBody) tableBody.innerHTML = '';
                const tableSection = document.querySelector('.table-section');
                if (tableSection) tableSection.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Update error:', error);
            alert('❌ Update failed: ' + error.message);
        });
}

function deleteTicket(id) {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.error || 'Delete failed'); });
            }
            return res.json();
        })
        .then(() => {
            alert('✅ Ticket deleted successfully!');
            document.getElementById('tickets-table-body').innerHTML = '';
        })
        .catch(error => {
            console.error('Delete error:', error);
            alert('❌ Delete failed: ' + error.message);
        });
}

// --- Render Tickets ---
function renderTickets(tickets) {
    const tableBody = document.getElementById('tickets-table-body');
    const tableSection = document.querySelector('.table-section');
    const isTicketsPage = window.location.pathname.includes('tickets.html');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (!Array.isArray(tickets) || tickets.length === 0) {
        if (tableSection && !isTicketsPage) {
            // Hide table on search page when no results
            tableSection.style.display = 'none';
        } else if (tableSection && isTicketsPage) {
            // Show table on tickets page even when empty
            tableSection.style.display = 'block';
            tableBody.innerHTML = '<tr><td colspan="6">No tickets found.</td></tr>';
        }
        return;
    }
    
    if (tableSection) tableSection.style.display = 'block';
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        const bookingDate = ticket.bookingDate ? new Date(ticket.bookingDate).toLocaleDateString() : 'N/A';
        row.innerHTML = `
            <td>${ticket.id || ''}</td>
            <td>${ticket.passengerName || ''}</td>
            <td>${ticket.kickoffAddress || ''}</td>
            <td>${ticket.destinationAddress || ''}</td>
            <td>${bookingDate}</td>
            <td>
                <button class='secondary-btn' onclick='openEditModal(${JSON.stringify(ticket)})'>Edit</button>
                <button class='secondary-btn' onclick='deleteTicket(${ticket.id})'>Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openEditModal(ticket) {
    const newPassengerName = prompt('Enter new passenger name:', ticket.passengerName);
    if (newPassengerName === null) return;
    
    const newKickoffAddress = prompt('Enter new kickoff address:', ticket.kickoffAddress);
    if (newKickoffAddress === null) return;
    
    const newDestinationAddress = prompt('Enter new destination address:', ticket.destinationAddress);
    if (newDestinationAddress === null) return;
    
    // Validation
    if (!newPassengerName.trim() || !newKickoffAddress.trim() || !newDestinationAddress.trim()) {
        alert('⚠️ All fields are required.');
        return;
    }
    
    if (newKickoffAddress.trim() === newDestinationAddress.trim()) {
        alert('⚠️ Kickoff and destination cannot be the same.');
        return;
    }
    
    const updatedTicket = {
        passengerName: newPassengerName.trim(),
        kickoffAddress: newKickoffAddress.trim(),
        destinationAddress: newDestinationAddress.trim(),
        bookingDate: ticket.bookingDate ? ticket.bookingDate : new Date().toISOString().split('T')[0]
    };
    
    updateTicket(ticket.id, updatedTicket);
}

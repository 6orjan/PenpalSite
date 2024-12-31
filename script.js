
const routes = {
    home: () => `
        <h2>Welcome to Penpal World!</h2>
        <p>Your gateway to making global connections and friendships.</p>
    `,
    browse: () => `
        <h2>Browse Penpals</h2>
        <div id="penpal-list-container">
            <p>Loading penpals...</p>
        </div>
    `,
    contact: () => `
        <h2>Contact Us</h2>
        <form id="contact-form">
            <label for="name">Your Name:</label>
            <input type="text" id="name" required>
            <label for="email">Your Email:</label>
            <input type="email" id="email" required>
            <label for="message">Your Message:</label>
            <textarea id="message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    `,
};


const navigateTo = (route) => {
    const content = document.getElementById('main-content');
    content.innerHTML = routes[route] ? routes[route]() : 'Page not found.';

    if (route === 'browse') {
        fetchPenpals();
    } else if (route === 'contact') {
        setupContactForm();
    }

    window.history.pushState({}, route, `#${route}`);
};


const fetchPenpals = () => {
    fetch('http://localhost:5001/users')
        .then((response) => {
            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((users) => {
            const penpalListContainer = document.getElementById('penpal-list-container');
            penpalListContainer.innerHTML = ''; // Clear the container

            if (users.length === 0) {
                penpalListContainer.innerHTML = '<p>No penpals found.</p>';
            } else {
                users.forEach((user) => {
                    const penpalItem = document.createElement('div');
                    penpalItem.classList.add('penpal-item');
                    penpalItem.innerHTML = `
                        <h3>${user.name} from ${user.country}</h3>
                        <p>${user.message}</p>
                    `;
                    penpalListContainer.appendChild(penpalItem);
                });
            }
        })
        .catch((err) => {
            console.log('Error fetching penpals:', err);
            const penpalListContainer = document.getElementById('penpal-list-container');
            penpalListContainer.innerHTML = '<p>Failed to load penpals. Please try again later.</p>';
        });
};



const setupContactForm = () => {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;

        if (!name || !email || !message) {
            alert('All fields are required!');
            return;
        }

        alert('Message sent successfully!');
        form.reset();
    });
};


document.querySelectorAll('a[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const route = link.getAttribute('data-route');
        navigateTo(route);
    });
});


const initialRoute = window.location.hash.replace('#', '') || 'home';
navigateTo(initialRoute);

window.addEventListener('popstate', () => {
    const route = window.location.hash.replace('#', '') || 'home';
    navigateTo(route);
});

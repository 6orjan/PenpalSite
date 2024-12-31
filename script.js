
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';


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
    login: () => `
        <h2>Login</h2>
        <form id="login-form">
            <label for="username">Username:</label>
            <input type="text" id="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" required>
            <button type="submit">Login</button>
        </form>
        <p id="login-message"></p>
    `,
    profile: () => `
        <h2>Your Profile</h2>
        <div id="profile-info">
            <!-- Profile information will be displayed here -->
        </div>
    `,
};


const navigateTo = (route) => {
    const content = document.getElementById('main-content');
    content.innerHTML = routes[route] ? routes[route]() : 'Page not found.';

  
    document.title = `Penpal World - ${route.charAt(0).toUpperCase() + route.slice(1)}`;

    if (route === 'profile') {
        displayProfile();
    } else if (route === 'browse') {
        fetchPenpals();
    } else if (route === 'contact') {
        setupContactForm();
    } else if (route === 'login') {
        setupLoginForm();
    }

    window.history.pushState({}, route, `#${route}`);

 
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const profileLink = document.querySelector('a[data-route="profile"]');

    if (user) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        profileLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
    }
};


const displayProfile = () => {
    const profileInfo = document.getElementById('profile-info');
    const user = JSON.parse(localStorage.getItem(USER_KEY));

    if (user) {
        profileInfo.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Location:</strong> ${user.location || 'Not provided'}</p>
            <button id="edit-profile">Edit Profile</button>
        `;

       
        document.getElementById('edit-profile').addEventListener('click', () => {
            profileInfo.innerHTML = `
                <label for="new-name">New Name:</label>
                <input type="text" id="new-name" value="${user.name}">
                <button id="save-profile">Save</button>
            `;
            document.getElementById('save-profile').addEventListener('click', () => {
                const newName = document.getElementById('new-name').value;
                user.name = newName;
                localStorage.setItem(USER_KEY, JSON.stringify(user));
                displayProfile();
            });
        });
    } else {
        profileInfo.innerHTML = '<p>Please log in to view your profile.</p>';
    }
};


const setupLoginForm = () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'john_doe' && password === 'password123') {
            const user = { username: 'john_doe', name: 'John Doe' };  // Simulate a user object
            localStorage.setItem(TOKEN_KEY, 'some-random-token');  // Simulate token storage
            localStorage.setItem(USER_KEY, JSON.stringify(user));  // Store user data
            loginMessage.textContent = 'Login successful!';
            setTimeout(() => navigateTo('home'), 2000);
        } else {
            loginMessage.textContent = 'Invalid credentials, please try again.';
        }
    });
};


document.getElementById('logout-link').addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    navigateTo('home');
});


const fetchPenpals = () => {
    const penpalListContainer = document.getElementById('penpal-list-container');
    penpalListContainer.innerHTML = '<p>Loading penpals...</p>'; // Show loading message

    fetch('http://localhost:5001/users')
        .then((response) => {
            console.log('Response Status:', response.status);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then((users) => {
            console.log('Fetched Users:', users);
            penpalListContainer.innerHTML = ''; // Clear previous content

            if (users.length === 0) {
                penpalListContainer.innerHTML = '<p>No penpals found.</p>';
            } else {
                users.forEach((user) => {
                    const penpalItem = document.createElement('div');
                    penpalItem.classList.add('penpal-item');
                    penpalItem.innerHTML = `
                        <h3>${user.username} from ${user.location}</h3>
                        <p>${user.bio}</p>
                    `;
                    penpalListContainer.appendChild(penpalItem);
                });
            }
        })
        .catch((err) => {
            console.error('Error fetching penpals:', err);
            penpalListContainer.innerHTML = `<p>Error fetching penpals: ${err.message}. Please try again later.</p>`;
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

        alert('Message sent successfully! We will get back to you soon.');
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
const user = JSON.parse(localStorage.getItem(USER_KEY));

if (user) {
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'inline';
    document.querySelector('a[data-route="profile"]').style.display = 'inline';
} else {
    document.getElementById('login-link').style.display = 'inline';
    document.getElementById('logout-link').style.display = 'none';
    document.querySelector('a[data-route="profile"]').style.display = 'none';
}

navigateTo(initialRoute);


window.addEventListener('popstate', () => {
    const route = window.location.hash.replace('#', '') || 'home';
    navigateTo(route);
});

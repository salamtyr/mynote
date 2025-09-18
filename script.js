// Traductions
const translations = {
    fr: {
        appTitle: "Mes Notes",
        newNote: "Nouvelle Note",
        allNotes: "Toutes les Notes",
        search: "Rechercher",
        export: "Exporter",
        settings: "Paramètres",
        account: "Compte",
        logout: "Déconnexion",
        writeNotePlaceholder: "Écris ta note...",
        save: "Sauvegarder",
        darkMode: "Mode Sombre",
        language: "Langue",
        usernamePlaceholder: "Nom d'utilisateur",
        passwordPlaceholder: "Mot de passe",
        login: "Se connecter",
        signup: "Créer un compte",
        loggedInAs: "Connecté en tant que"
    },
    en: {
        appTitle: "My Notes",
        newNote: "New Note",
        allNotes: "All Notes",
        search: "Search",
        export: "Export",
        settings: "Settings",
        account: "Account",
        logout: "Logout",
        writeNotePlaceholder: "Write your note...",
        save: "Save",
        darkMode: "Dark Mode",
        language: "Language",
        usernamePlaceholder: "Username",
        passwordPlaceholder: "Password",
        login: "Login",
        signup: "Sign Up",
        loggedInAs: "Logged in as"
    }
};

// Fonction pour changer la langue
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    applyTranslations(lang);
}

// Appliquer les traductions
function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key] || key;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = translations[lang][key] || key;
    });
}

// Ouvrir/fermer le menu
document.getElementById('menuBtn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

// Fonction pour ajouter une note
function addNote() {
    showSection('noteSection');
    document.getElementById('noteInput').value = '';
    document.getElementById('notesList').innerHTML = '';
    document.getElementById('sidebar').classList.remove('active');
}

// Sauvegarder une note
function saveNote() {
    const noteText = document.getElementById('noteInput').value.trim();
    if (noteText && getCurrentUser()) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        const user = getCurrentUser();
        if (!users[user]) users[user] = { notes: [] };
        users[user].notes.push({ text: noteText, date: new Date().toLocaleString() });
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('noteInput').value = '';
        showAllNotes();
    } else {
        alert('Veuillez vous connecter pour sauvegarder des notes.');
    }
}

// Afficher toutes les notes
function showAllNotes() {
    showSection('noteSection');
    const user = getCurrentUser();
    if (!user) {
        document.getElementById('notesList').innerHTML = '<p>Veuillez vous connecter pour voir vos notes.</p>';
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let notes = users[user]?.notes || [];
    let html = '';
    notes.forEach((note, index) => {
        html += `<div class="note-item">
                    <p>${note.text}</p>
                    <small>${note.date}</small>
                    <button onclick="deleteNote(${index})">Supprimer</button>
                 </div>`;
    });
    document.getElementById('notesList').innerHTML = html;
    document.getElementById('sidebar').classList.remove('active');
}

// Supprimer une note
function deleteNote(index) {
    const user = getCurrentUser();
    let users = JSON.parse(localStorage.getItem('users')) || {};
    users[user].notes.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    showAllNotes();
}

// Fonctions stub pour recherche/export
function searchNotes() {
    alert('Fonction recherche à implémenter !');
    document.getElementById('sidebar').classList.remove('active');
}

function exportNotes() {
    alert('Export en cours...');
    document.getElementById('sidebar').classList.remove('active');
}

// Afficher les paramètres
function showSettings() {
    showSection('settingsSection');
    document.getElementById('sidebar').classList.remove('active');
}

// Afficher le compte
function showAccount() {
    showSection('accountSection');
    document.getElementById('sidebar').classList.remove('active');
}

// Gérer les sections
function showSection(sectionId) {
    document.querySelectorAll('main > div').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Toggle dark mode
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Obtenir l'utilisateur actuel
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Login
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        updateAccountUI();
        alert('Connexion réussie !');
    } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect.');
    }
}

// Signup
function signup() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('Ce nom d\'utilisateur existe déjà.');
        return;
    }
    users[username] = { password, notes: [] };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', username);
    updateAccountUI();
    alert('Compte créé !');
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    updateAccountUI();
    showAllNotes(); // Refresh pour cacher notes
    alert('Déconnexion réussie.');
}

// Mettre à jour l'UI du compte
function updateAccountUI() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('currentUser').textContent = user;
        document.getElementById('logoutItem').style.display = 'block';
    } else {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('logoutItem').style.display = 'none';
    }
    const lang = localStorage.getItem('language') || 'fr';
    applyTranslations(lang);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('language') || 'fr';
    applyTranslations(lang);
    document.getElementById('languageSelect').value = lang;

    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.getElementById('darkModeToggle').checked = darkMode;
    if (darkMode) document.body.classList.add('dark-mode');

    updateAccountUI();
    showAllNotes();
});
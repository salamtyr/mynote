// Ouvrir/fermer le menu latéral
document.getElementById('menuBtn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
});

// Fonction pour échapper les caractères HTML (sécurité XSS)
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonction pour afficher un message temporaire
function showMessage(msg, color = '#4caf50') {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.background = color;
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.margin = '10px 0';
    div.style.borderRadius = '4px';
    div.style.textAlign = 'center';
    document.getElementById('mainContent').prepend(div);
    setTimeout(() => div.remove(), 2000);
}

// Fonction pour ajouter une nouvelle note
function addNote() {
    document.getElementById('noteInput').value = '';
    document.getElementById('notesList').innerHTML = '';
    document.getElementById('sidebar').classList.remove('active');
}

// Sauvegarder une note
function saveNote() {
    const noteText = document.getElementById('noteInput').value.trim();
    if (noteText) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push({
            text: noteText,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('notes', JSON.stringify(notes));
        document.getElementById('noteInput').value = '';
        showAllNotes();
        showMessage('Note sauvegardée !');
    } else {
        showMessage('La note est vide.', '#f44336'); // rouge pour erreur
    }
}

// Afficher toutes les notes
function showAllNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    let html = '';

    if (notes.length === 0) {
        html = `<p>Aucune note enregistrée.</p>`;
    } else {
        notes.forEach((note, index) => {
            html += `
                <div class="note-item">
                    <p>${escapeHTML(note.text)}</p>
                    <small>${note.date}</small>
                    <br>
                    <button onclick="deleteNote(${index})">Supprimer</button>
                </div>
            `;
        });
    }

    document.getElementById('notesList').innerHTML = html;
    document.getElementById('sidebar').classList.remove('active');
}

// Supprimer une note
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (index >= 0 && index < notes.length) {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        showAllNotes();
        showMessage('Note supprimée.');
    }
}

// Rechercher une note (fonction de base)
function searchNotes() {
    const query = prompt("Entrez un mot-clé à rechercher :");
    if (!query) return;

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const results = notes.filter(note => note.text.toLowerCase().includes(query.toLowerCase()));
    
    let html = '';

    if (results.length === 0) {
        html = `<p>Aucune note ne correspond à votre recherche.</p>`;
    } else {
        results.forEach((note, index) => {
            html += `
                <div class="note-item">
                    <p>${escapeHTML(note.text)}</p>
                    <small>${note.date}</small>
                </div>
            `;
        });
    }

    document.getElementById('notesList').innerHTML = html;
    document.getElementById('sidebar').classList.remove('active');
}

// Exporter les notes (en JSON téléchargeable)
function exportNotes() {
    const notes = localStorage.getItem('notes');
    if (!notes) {
        showMessage('Aucune note à exporter.', '#f44336');
        return;
    }

    const blob = new Blob([notes], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes_notes.json';
    a.click();

    URL.revokeObjectURL(url);
    showMessage('Notes exportées avec succès !');
    document.getElementById('sidebar').classList.remove('active');
}

// Afficher toutes les notes au chargement
showAllNotes();

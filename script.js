// Ouvrir/fermer le menu
document.getElementById('menuBtn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

// Fonction pour ajouter une note
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
        notes.push({ text: noteText, date: new Date().toLocaleString() });
        localStorage.setItem('notes', JSON.stringify(notes));
        document.getElementById('noteInput').value = '';
        showAllNotes();
    }
}

// Afficher toutes les notes
function showAllNotes() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
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
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
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

// Charge les notes au démarrage
showAllNotes();

'use strict';

const form = document.querySelector('#note-form');
const titleInput = document.querySelector('#note-title');
const textInput = document.querySelector('#note-text');
const noteList = document.querySelector('#note-list');
const emptyMessage = document.querySelector('#empty-message');
const clearButton = document.querySelector('#clear-button');
const STORAGE_KEY = 'kundalik-notes';

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error('Не удалось прочитать сохранённые записи:', error);
    return [];
  }
}

let notes = loadNotes();

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    alert('Не удалось сохранить записи в браузере.');
    console.error(error);
  }
}

function renderNotes() {
  noteList.replaceChildren();
  emptyMessage.hidden = notes.length > 0;

  notes.forEach((note) => {
    const article = document.createElement('article');
    article.className = 'note';

    const heading = document.createElement('h3');
    heading.textContent = note.title;

    const paragraph = document.createElement('p');
    paragraph.textContent = note.text;

    const date = document.createElement('time');
    date.textContent = note.date;

    article.append(heading, paragraph, date);
    noteList.append(article);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const text = textInput.value.trim();
  if (!title || !text) return;

  notes.unshift({
    title,
    text,
    date: new Date().toLocaleString('ru-RU')
  });
  saveNotes();
  renderNotes();
  form.reset();
  titleInput.focus();
});

clearButton.addEventListener('click', () => {
  if (notes.length === 0) return;
  const confirmed = confirm('Удалить все записи из этого браузера?');
  if (!confirmed) return;
  notes = [];
  saveNotes();
  renderNotes();
});

renderNotes();

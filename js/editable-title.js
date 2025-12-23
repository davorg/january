const STORAGE_KEY = 'custom-tracker-title';
const DEFAULT_TITLE = "Dave's Dry January Tracker";

function initEditableTitle() {
  const titleElement = document.getElementById('tracker-title');
  if (!titleElement) return;

  // Wrap the text content in a span for easier manipulation
  const textSpan = document.createElement('span');
  textSpan.className = 'tracker__title-text';
  
  // Load custom title from localStorage
  const savedTitle = localStorage.getItem(STORAGE_KEY);
  textSpan.textContent = savedTitle || titleElement.textContent;
  
  // Clear and rebuild the title element
  titleElement.textContent = '';
  titleElement.appendChild(textSpan);

  // Add edit icon
  const editIcon = document.createElement('span');
  editIcon.className = 'tracker__title-edit-icon';
  editIcon.textContent = '✏️';
  editIcon.setAttribute('role', 'button');
  editIcon.setAttribute('aria-label', 'Edit title');
  titleElement.appendChild(editIcon);

  // Handle edit icon click
  editIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    enterEditMode(titleElement, textSpan);
  });
}

function enterEditMode(titleElement, textSpan) {
  // Get the current text from the text span
  const currentText = textSpan.textContent;
  
  // Create edit container
  const editContainer = document.createElement('div');
  editContainer.className = 'tracker__title-edit-container';

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tracker__title-input';
  input.value = currentText;
  input.setAttribute('aria-label', 'Edit tracker title');

  // Create save button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'tracker__title-btn';
  saveBtn.textContent = '✅';
  saveBtn.setAttribute('aria-label', 'Save title');

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'tracker__title-btn';
  cancelBtn.textContent = '❌';
  cancelBtn.setAttribute('aria-label', 'Cancel editing');

  // Assemble edit container
  editContainer.appendChild(input);
  editContainer.appendChild(saveBtn);
  editContainer.appendChild(cancelBtn);

  // Replace title with edit container
  const parent = titleElement.parentNode;
  parent.insertBefore(editContainer, titleElement);
  titleElement.style.display = 'none';

  // Focus input
  input.focus();
  input.select();

  // Handle save
  saveBtn.addEventListener('click', function() {
    saveTitle(input.value.trim(), textSpan, editContainer);
  });

  // Handle cancel
  cancelBtn.addEventListener('click', function() {
    cancelEdit(titleElement, editContainer);
  });

  // Handle Enter key
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveTitle(input.value.trim(), textSpan, editContainer);
    }
  });

  // Handle Escape key
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      cancelEdit(titleElement, editContainer);
    }
  });
}

function saveTitle(newTitle, textSpan, editContainer) {
  // If empty or whitespace only, revert to default
  if (!newTitle) {
    newTitle = DEFAULT_TITLE;
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, newTitle);
  }

  // Update title text in the span
  textSpan.textContent = newTitle;

  // Exit edit mode
  exitEditMode(textSpan.parentElement, editContainer);
}

function cancelEdit(titleElement, editContainer) {
  exitEditMode(titleElement, editContainer);
}

function exitEditMode(titleElement, editContainer) {
  editContainer.remove();
  titleElement.style.display = '';
}

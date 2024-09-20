export function createModal() {

  let existingModal = document.querySelector('.modal');
  if (existingModal) {
    existingModal.remove();
  }

  let modal = document.createElement('div');
  modal.setAttribute('id', 'modal');
  modal.classList.add('modal');

  let modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modal.appendChild(modalContent);

  let closeButton = document.createElement('span');
  closeButton.classList.add('close-button');
  closeButton.innerHTML = '&times;';
  modalContent.appendChild(closeButton);

  let modalMessage = document.createElement('p');
  modalMessage.setAttribute('id', 'modal-message');
  modalContent.appendChild(modalMessage);

  document.body.appendChild(modal);

  closeButton.onclick = function() {
      modal.style.display = 'none';
  }

  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  }
}

export function showModal(message) {
  let modal = document.getElementById('modal');
  let modalMessage = document.getElementById('modal-message');
  modalMessage.innerHTML = message;
  modal.style.display = 'flex';
}




(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const favorites = new Set();

function toggleFavorite(event, button) {
  event.stopPropagation();
  event.preventDefault();

  const id = button.getAttribute('data-id');
  const heartIcon = button.querySelector('i');

  if(favorites.has(id)){
    favorites.delete(id);
    heartIcon.classList.remove('bxs-heart');
    heartIcon.classList.add('bx-heart');
  } else{
    favorites.add(id);
    heartIcon.classList.remove('bx-heart');
    heartIcon.classList.add('bxs-heart');
  }
}


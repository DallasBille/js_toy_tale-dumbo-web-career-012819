const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyFormSubmit = document.querySelector('.container .add-toy-form')
const toyCollection = document.querySelector('div#toy-collection')
console.log(toyCollection)
let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

toyFormSubmit.addEventListener("submit", event => {
  event.preventDefault();
  let toyName = event.target.name.value;
  let toyImage = event.target.image.value;
  createToyApi(toyName, toyImage).then(toyObj => {
    toyCollection.prepend(createToyCard(toyObj));
  })
})

toyCollection.addEventListener('click', event => {
  if (event.target.classList.contains('like-btn')) {
    let currentLikesTag = event.target.parentElement.querySelector('p');
    updatedLikes = parseInt(currentLikesTag.dataset.likes) + 1;
    updateToyLikesApi(currentLikesTag.parentElement.dataset.id, updatedLikes)
      .then(toyObj => {
        if(!!toyObj) {
          currentLikesTag.dataset.likes = updatedLikes;
          currentLikesTag.innerText = `${updatedLikes} Likes`
        }
      })
      .catch(error => alert('SERVER ERROR!'));
  }
})


const createToyCard = ({id, name, image, likes}) => {
  let newToyCard = document.createElement('div');
  newToyCard.classList.add('card');
  newToyCard.dataset.id = id;
  newToyCard.innerHTML = `
    <h2>${name}</h2>
    <img src=${image} class="toy-avatar" />
    <p data-likes="${likes}">${likes} Likes </p>
    <button class="like-btn">Like <3</button>
  `
  return newToyCard;
}
const createToyApi = (name, image) => {
  let postConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  }

  return fetch('http://localhost:3000/toys', postConfig).then(r => r.json())
}

const updateToyLikesApi = (id, updatedLikes) => {
  return fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: updatedLikes
    })
  })
  .then(response => response.json())
}

fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => {
      toyCollection.prepend(createToyCard(toy));
    })
  })


// OR HERE!

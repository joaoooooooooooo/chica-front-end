fetch('http://localhost:1337/api/galerias')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
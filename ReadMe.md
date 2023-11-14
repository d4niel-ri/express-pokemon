# Express - Pokemon API

Express.js project with basic routes:
* Express
* Joi
* Fs

---

## How to Run
```
npm run dev
```

## URL

_Server_
```
http://localhost:3000
```
---


## Global Response

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```
---


## RESTful endpoints

### GET /pokemons

> Get all pokemons in wild life

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_pokemons>
  ],
  "status": "Success"
}
```

---

### GET /pokemons/:param

> Get pokemon's detail

_Request Params_
```
/<param>
```
`param` can be `name` or `id`

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <id>
    "name": <name>,
    ...other details of pokemon
  },
  "status": "Success"
}
```

_Response (404)_
```
{
  "message": "Data Not Found"
}
```

---

### POST /pokemons/catch/:param

> Catch pokemon (with 50% chance)

_Request Params_
```
/<param>
```
`param` can be `name` or `id`

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (201 - Success catch)_
```
{
  "data": {
    "id": <id>,
    "id_pokemon": <id_pokemon>,
    "name": <name>,
    "originalName": <originalName>,
    "rename": <rename>,
    "renameCount": <renameCount>
  },
  "status": "Success"
}
```

_Response (200 - Failed to catch)_
```
{
  "message": "Failed to catch <pokemon_name>",
  "status": "Failed"
}
```

_Response (404)_
```
{
  "message": "Data Not Found"
}
```

---

### GET /pokemons/my-pokemons

> Get my list of pokemons (successful captured pokemons)

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response(200)_
```
{
  "data": [
    <list_of_my_pokemons>
  ],
  "status": "Success"
}
```

---

### POST /pokemons/release/:id

> Release a pokemon (with checking a generated number is prime or not)

_Request Params_
```
/<id>
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200 - Success Release)_
```
{
  "data": [
    <list_of_my_pokemons>
  ],
  "generatedNumber": <random_number>,
  "status": "success"
}
```

_Response (200 - Failed to Release)_
```
{
  "message": "Failed to release",
  "generatedNumber": <random_number>,
  "status": "Failed"
}
```

_Response (404)_
```
{
  "message": "Data Not Found"
}
```

---

### PUT /pokemons/rename/:id

> Rename a pokemon with fibonacci sequence

_Request Params_
```
/<id>
```

_Request Header_
```
not needed
```

_Request Body_
```
{
  "name": <name> // optional
}
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "id_pokemon": <id_pokemon>,
    "name": <name>,
    "originalName": <originalName>,
    "rename": <rename>,
    "renameCount": <renameCount>,
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"name\" is not allowed to be empty"
}
```

_Response (404 - Data Not Found)_
```
{
  "message": "Data Not Found"
}
```

---

### PUT /pokemons/evolve/:id

> Evolve a pokemon

_Request Params_
```
/<id>
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_(Response 200 - Can evolve)_
```
{
  "data": {
    "id": <id>,
    "id_pokemon": <id_pokemon>,
    "name": <name>,
    "originalName": <originalName>,
    "rename": <rename>,
    "renameCount": <renameCount>,
  },
  "status": "Success"
}
```

_(Response 200 - Can't evolve again)_
```
{
  "message": "It can't evolve again",
  "status": "Failed"
}
```

_Response (404 - Data Not Found)_
```
{
  "message": "Data Not Found"
}
```

---
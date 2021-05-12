## **Update personal data**

Atualiza o nome e/ou sobrenome do usuário.

- **URL**

  /api/users/personal-data

</br>

- **Method:**

  `PUT`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params**

  `name?: string`

  `lastname?: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "User successfully created.",
      "user": {
        "id": "7f698092-b207-4e6e-8e03-765128d22029",
        "name": "Vitor",
        "lastname": "Fernandes",
        "email_to_verify": "vitor@dom.com",
        "created_at": "2021-04-28T23:45:55.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "You cannot change this user." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Something wrong with the request." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "User not found." }`

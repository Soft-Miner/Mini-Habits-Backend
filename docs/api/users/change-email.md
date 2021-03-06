## **Upadate email**

Atualiza o email do usuário.

- **URL**

  /api/users/change-email

</br>

- **Method:**

  `PUT`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params**

  `new_email: string`

  `password: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "Please verify the new email",
      "user": {
        "id": "ae0ba3c7-d003-4e0d-bb38-5f4ebef0de70",
        "name": "Vitor",
        "lastname": "Fernandes",
        "email": "vitor.vfs00@gmail.com",
        "email_to_verify": "vitorvfs00@gmail.com",
        "created_at": "2021-05-10T22:50:02.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "A user already exists with this email." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Something wrong with the request." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Password is incorrect." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "User not found." }`

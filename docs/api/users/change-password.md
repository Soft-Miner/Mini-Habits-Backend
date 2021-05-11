## **Upadate password**

Atualiza a senha do usuário.

- **URL**

  /api/users/change-password

  </br>

- **Method:**

  `PUT`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params**

  `password: string`

  `new_password: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "Password updated."
    }
    ```

</br>

- **Error Response:**

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

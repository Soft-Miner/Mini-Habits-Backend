## **Add Challenge**

Adiciona um novo desafio no mini-hábito.

- **URL**

  /api/habits/{id}/challenges

</br>

- **Method:**

  `POST`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params (Multipart)**

  `description`

  `level`

  `xp_reward`

  `icon` - Arquivo svg que será o ícone do desafio

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "Challenge successfully created.",
      "challenge": {
        "id": "1ac27320-fd0a-4a78-bb40-2ff6ac06ebb3",
        "description": "Descrição",
        "level": 10,
        "xp_reward": 12,
        "icon": "path/to/icon.svg"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Some field is missing." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "Habit not found." }`

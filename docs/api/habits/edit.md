## **Update Habit**

Edita um hábito.

- **URL**

  /api/habits/{id}

</br>

- **Method:**

  `PUT`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params (Multipart)**

  `name?`

  `description?`

  `icon?` - Arquivo svg que será o ícone do Hábito

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "Habit successfully created.",
      "habit": {
        "id": "81388b85-828f-4f16-a58a-b9a767714ffc",
        "icon": "path/to/icon.svg",
        "name": "nome",
        "description": "descrição",
        "challenges": [
          {
            "id": "077c9860-c658-49e8-9df0-2ab7864c8adf",
            "level": 0,
            "description": "descrição",
            "icon": "path/to/icon.svg",
            "xp_reward": 10,
            "habits_id": "81388b85-828f-4f16-a58a-b9a767714ffc",
            "last_modified": "2021-05-10T00:34:38.000Z",
            "created_at": "2021-05-10T00:34:38.000Z"
          }
        ],
        "last_modified": "2021-05-10T00:34:38.000Z",
        "created_at": "2021-05-10T00:34:38.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "Habit not found." }`

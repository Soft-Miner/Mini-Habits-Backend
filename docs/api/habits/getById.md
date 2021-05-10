## **Get Habit by id**

Pega um hábito pelo Id.

- **URL**

  /api/habits/{id}

</br>

- **Method:**

  `GET`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "id": "bcc1c5ac-e452-4426-ae15-bb0033be625f",
      "icon": "path/to/icon.svg",
      "name": "Beber água",
      "description": "Beber água faz bem para a saúde",
      "last_modified": "2021-05-08T19:25:29.000Z",
      "created_at": "2021-05-08T19:25:29.000Z",
      "challenges": [
        {
          "id": "9e286bf1-5b36-48ce-9c73-5b34a0531558",
          "habits_id": "bcc1c5ac-e452-4426-ae15-bb0033be625f",
          "level": 0,
          "description": "Beba 2 copos de água",
          "icon": "path/to/challengicon.svg",
          "xp_reward": 10,
          "last_modified": "2021-05-08T19:25:29.000Z",
          "created_at": "2021-05-08T19:25:29.000Z"
        }
      ]
    }
    ```

</br>

- **Error Response:**

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "Habit not found." }`

## **Get Habit**

Pega todos os hábitos.

- **URL**

  /api/habits/

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
    [
      {
        "id": "81388b85-828f-4f16-a58a-b9a767714ffc",
        "icon": "path/to/icon.svg",
        "name": "Hábito1",
        "description": "descrição",
        "last_modified": "2021-05-10T00:35:39.000Z",
        "created_at": "2021-05-10T00:34:38.000Z"
      },
      {
        "id": "b1fd9575-e0e4-42d8-aac1-7851c7e21447",
        "icon": "path/to/icon.svg",
        "name": "Hábito2",
        "description": "descrição",
        "last_modified": "2021-05-10T01:38:33.000Z",
        "created_at": "2021-05-10T01:38:00.000Z"
      }
    ]
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

## **Update Challenge**

Edita um challenge.

- **URL**

  /api/challenges/{id}

</br>

- **Method:**

  `PUT`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params (Multipart)**

  `description`

  `icon` - Arquivo svg que será o ícone do Challenge

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "Challenge updated.",
      "challenge": {
        "id": "b77fd0a3-ba12-426b-806b-a7228245d5eb",
        "habits_id": "b843516d-e853-4321-b3d5-1fae3759cc80",
        "level": 0,
        "description": "Descrição",
        "icon": "path/to/icon.svg",
        "xp_reward": 10,
        "last_modified": "2021-05-09T19:17:37.000Z",
        "created_at": "2021-05-09T17:54:18.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "Challenge not found." }`

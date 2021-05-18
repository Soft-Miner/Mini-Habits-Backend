## **Create Habit**

Cria um novo hábito.

- **URL**

  /api/habits

</br>

- **Method:**

  `POST`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params (Multipart)**

  `name`

  `description`

  `challenges` - Um json transformado em texto com o seguinte formato:

  ```json
  [
    { "level": 0, "description": "Descrição 1", "xp_reward": 10 },
    { "level": 20, "description": "Descrição 2", "xp_reward": 20 }
  ]
  ```

  `icon` - Arquivo svg que será o ícone do mini-hábito

  `challengesIcons` - Arquivos svg que serão os ícones dos challenges, deve ter a mesma quantidade de ícones e de challenges

</br>

- **Success Response:**

  - **Code:** 201 CREATE

    **Content:**

    ```json
    {
      "message": "Habit successfully created.",
      "habit": {
        "id": "bb8e40f0-b6dc-4d30-99ff-3bd37550dd88",
        "icon": "path/to/icon.svg",
        "name": "Nome",
        "description": "Descrição",
        "challenges": [
          {
            "id": "b16cd734-b590-47bb-9168-f7f5a2cefd3d",
            "level": 0,
            "description": "Descrição",
            "icon": "path/to/icon.svg",
            "xp_reward": 10,
            "habits_id": "bb8e40f0-b6dc-4d30-99ff-3bd37550dd88",
            "last_modified": "2021-05-09T05:03:09.000Z",
            "created_at": "2021-05-09T05:03:09.000Z"
          }
        ],
        "last_modified": "2021-05-09T05:03:09.000Z",
        "created_at": "2021-05-09T05:03:09.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Invalid file type." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Something wrong with the request." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Invalid challenge JSON string." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Some field is missing in challenges." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "icon is required." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "challengesIcon is required." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "ChallengesIcon and challenges must have the same length." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "At least one challenge must be level 0." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "A habit already exists with this name." }`

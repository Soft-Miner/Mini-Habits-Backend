## **Pull Changes**

Busca as novas alterações do usuário.

- **URL**

  /api/pull

</br>

- **Method:**

  `POST`

</br>

- **Headers:**

  `authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZmIzNjA0LTAyODctNGU4Ny1iNmM4LWUxZjg1OWVmYzE4NSIsImlhdCI6MTYxOTkxNjY5N30.NtmpXxyKqzpw-BzF0ZxJnMU7YuFiVy-5VqtErbq0bO0`

</br>

- **Data Params**

  `lastPulletAt?: number`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "changes": {
        "habits": [
          {
            "id": "156c3858-a044-4ddc-a65e-4b9cf6f1224c",
            "icon": "path/to/icon.svg",
            "name": "Nome",
            "description": "Descrição",
            "last_modified": "2021-05-16T15:57:34.000Z",
            "created_at": "2022-05-08T20:07:03.000Z"
          }
        ],
        "habits_challenges": [
          {
            "id": "76808464-7825-4e3a-b67f-ffb84a253f70",
            "habits_id": "156c3858-a044-4ddc-a65e-4b9cf6f1224c",
            "level": 0,
            "description": "Descrição",
            "icon": "path/to/icon.svg",
            "xp_reward": 10,
            "last_modified": "2021-05-08T20:07:03.000Z",
            "created_at": "2021-05-08T20:07:03.000Z"
          }
        ],
        "habits_users": [
          {
            "id": "271799ab-1007-4117-a30e-9a36f468a6ee",
            "user_id": "27caeed8-78b8-4729-b99e-efd4796597f4",
            "habit_id": "156c3858-a044-4ddc-a65e-4b9cf6f1224c",
            "habit_challenge_id": "76808464-7825-4e3a-b67f-ffb84a253f70",
            "time_sunday": 360,
            "time_monday": 360,
            "time_tuesday": 360,
            "time_wednesday": 360,
            "time_thursday": 360,
            "time_friday": 360,
            "time_saturday": 360,
            "deleted": false,
            "last_modified": "2021-05-16T03:29:58.000Z",
            "created_at": "2021-05-16T03:29:58.000Z"
          }
        ],
        "habits_users_days": [
          {
            "id": "271799ab-1007-4117-a30e-9a36f468a6ee",
            "habit_user_id": "271799ab-1007-4117-a30e-9a36f468a6ee",
            "habit_challenge_id": "76808464-7825-4e3a-b67f-ffb84a253f70",
            "completed_day": "2021-05-19T00:42:00.000Z",
            "last_modified": "2021-05-18T21:42:33.000Z",
            "created_at": "2021-05-18T21:42:33.000Z"
          }
        ]
      },
      "currentTime": 1621377640542
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "lastPulletAt's format invalid." }`

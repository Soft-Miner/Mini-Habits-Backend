## **Push Changes**

Envia alterações locais para o servidor.

- **URL**

  /api/push

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

    **Content:** `{ "message": "Data successfully synced." }`

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Something wrong with the request." }`

    OR

  - **Code:** 409 CONFLICT

    **Content:** `{ "message": "You need to pull first." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "habits_users's format is incorrect." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "habits_users_days's format is incorrect." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "You cannot change this." }`

## **New password**

Altera a senha do usuário.

- **URL**

  /api/new-password

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `requestId: string`
  `requestSecret: string`
  `password: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    **Content:** `{ "message": "Password successfully updated." }`

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "requestId, requestSecret and password are required." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "requestId not found." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid requestSecret." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "User not found." }`

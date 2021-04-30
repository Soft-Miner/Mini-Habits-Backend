## **Verify email**

Verifica o email do usuário.

- **URL**

  /api/verify-email

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `token: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    **Content:** `{ "message": "Email successfully verified." }`

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "This email was already verified." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "User not found." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

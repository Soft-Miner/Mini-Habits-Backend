## **Request new password**

Solicita a redefinição da senha.

- **URL**

  /api/request-password

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `email: string`

</br>

- **Success Response:**

  - **Code:** 201 CREATED

    **Content:**

    **Content:** `{ "message": "Password recovery email sent to email@example.com." }`

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Invalid email." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "User not found." }`

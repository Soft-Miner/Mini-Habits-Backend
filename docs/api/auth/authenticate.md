## **Authenticate**

Retorna um token de acesso.

- **URL**

  /api/authenticate

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `email: string`

  `password: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    **Content:** `{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4YzVmMzJkLTYxMzgtNGRhMi1hNDUwLTlmMmZhM2ExMDIxZiIsImlhdCI6MTYxOTc0MjQ4Nn0.4ip0rTr80LBzYVrpAAscFwPO70URcdfFqlN8R5QCci4" }`

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Email or password is incorrect." }`

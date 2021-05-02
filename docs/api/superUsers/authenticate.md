## **Authenticate**

Retorna um access_token e refresh_token para o admin.

- **URL**

  /api/super_users/authenticate

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

    **Content:**

    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4YzVmMzJkLTYxMzgtNGRhMi1hNDUwLTlmMmZhM2ExMDIxZiIsImlhdCI6MTYxOTc0MjQ4Nn0.4ip0rTr80LBzYVrpAAscFwPO70URcdfFqlN8R5QCci4",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4YzVmMzJkLTYxMzgtNGRhMi1hNDUwLTlmMmZhM2ExMDIxZiIsImlhdCI6MTYxOTc0MjQ4Nn0.4ip0rTr80LBzYVrpAAscFwPO70URcdfFqlN8R5QCci4"
    }
    ```

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Email or password is incorrect." }`

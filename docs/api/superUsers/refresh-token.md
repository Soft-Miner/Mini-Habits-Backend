## **Refresh Token**

Retorna um novo access_token e refresh_token a partir de um refresh_token.

- **URL**

  /api/super_users/refresh_token

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `refresh_token: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

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

    **Content:** `{ "message": "Invalid refresh_token." }`

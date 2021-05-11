## **Upadate password**

Atualiza a senha do usuário.

- **URL**

  /api/users/change-password

  </br>

- **Method:**

  `PUT`

</br>

- **Data Params**

  `password: string`

  `new_password: string`

</br>

- **Success Response:**

  - **Code:** 200 OK

    **Content:**

    ```json
    {
      "message": "Password updated."
    }
    ```

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Something wrong with the request." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Password is incorrect." }`

    OR

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Invalid token." }`

    OR

  - **Code:** 404 NOT FOUND

    **Content:** `{ "message": "User not found." }`

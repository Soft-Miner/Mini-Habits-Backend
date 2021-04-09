## **Create User**

Cria um novo usuário.

- **URL**

  /api/users

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `name: string`

</br>

- **Success Response:**

  - **Code:** 201 CREATED

    **Content:**

    ```json
    {
      "message": "User successfully created.",
      "user": {
        "id": "666",
        "name": "User Name"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Invalid Name." }`

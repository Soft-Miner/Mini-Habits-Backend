## **Register**

Cadastra um novo usuário.

- **URL**

  /api/register

</br>

- **Method:**

  `POST`

</br>

- **Data Params**

  `name: string`
  `lastname: string`
  `email: string`
  `password: string`

</br>

- **Success Response:**

  - **Code:** 201 CREATED

    **Content:**

    ```json
    {
      "message": "User successfully created.",
      "user": {
        "id": "7f698092-b207-4e6e-8e03-765128d22029",
        "name": "Vitor",
        "lastname": "Fernandes",
        "email_to_verify": "vitor@dom.com",
        "created_at": "2021-04-28T23:45:55.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "Something wrong with the request." }`

    OR

  - **Code:** 400 BAD REQUEST

    **Content:** `{ "message": "A user already exists with this email." }`

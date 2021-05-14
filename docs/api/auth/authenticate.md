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

    **Content:**

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMGMyNzdiLWI2ZjEtNDVlMi1hODAyLTBhZTdmY2E4MzAyNiIsInR5cCI6ImFjY2VzcyIsImlhdCI6MTYyMTAzMDMzNX0.MECpCyc47lyZwio3EZsL7riLZTUyg1oceek00Bz3Q4I",
      "user": {
        "id": "6a0c277b-b6f1-45e2-a802-0ae7fca83026",
        "name": "Vitor",
        "lastname": "Fernandes",
        "email": "vitor.f.silveira@hotmail.com",
        "created_at": "2021-05-14T19:30:50.000Z"
      }
    }
    ```

</br>

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED

    **Content:** `{ "message": "Email or password is incorrect." }`

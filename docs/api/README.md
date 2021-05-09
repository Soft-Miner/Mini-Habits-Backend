| método | rota                                                            | descrição                                                                      |
| ------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| POST   | [/api/register](./users/register.md)                            | Cadastra um novo usuário.                                                      |
| POST   | [/api/request-password](./users/request-password.md)            | Solicita a redefinição da senha.                                               |
| POST   | [/api/new-password](./users/new-password.md)                    | Altera a senha do usuário.                                                     |
| POST   | [/api/verify-email](./users/verify-email.md)                    | Verifica o email do usuário.                                                   |
| POST   | [/api/authenticate](./auth/authenticate.md)                     | Retorna um `token` de acesso.                                                  |
| POST   | [/api/super_users/authenticate](./superUsers/authenticate.md)   | Retorna um `access_token` e `refresh_token` para o admin.                      |
| POST   | [/api/super_users/refresh_token](./superUsers/refresh-token.md) | Retorna um novo `access_token` e `refresh_token` a partir de um refresh_token. |
| POST   | [/api/habits](./habits/create.md)                               | Cria um novo hábito.                                                           |
| PUT    | [/api/challenges](./challenges/edit.md)                         | Edita um challenge.                                                            |

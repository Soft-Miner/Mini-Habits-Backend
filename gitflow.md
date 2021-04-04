## GitFlow

#### Fluxo para executar uma tarefa

Para iniciar uma tarefa, vamos primeiro ir para a branch `develop`:

```
    git switch develop
```

Trazer as possíveis atualizações:

```
    git pull origin develop
```

Criar uma nova branch com número da task para executar a tarefa com base na `develop`:

```
    git checkout -b feature/MHB-2
```

<p align="center">
    <img width="400" src="https://user-images.githubusercontent.com/58633356/113516044-8bc71580-954e-11eb-89a9-f433920d9056.png">
</p>

Codar

<p align="center">
    <img width="200" src="https://www.chinosity.com/wp-content/uploads/2019/05/yas-cat-gif-1.gif">
</p>

Depois que a tarefa estiver concluída, podemos fazer o commit das alterações:

```
    git add .
    git commit -m "Breve descrição do que foi feito"
```

Antes de dar o push e enviar pro repositório para criar o pull request, é importante lembrar de puxar as possíveis atualizações da `develop` para que a branch fique atualizada:

```
    git pull origin develop
```

E aí podemos enviar pro repositório:

```
    git push origin feature/MHB-2
```

E criar um pull request da nossa branch para a `develop`:

<p align="center">
    <img width="400" src="https://user-images.githubusercontent.com/58633356/113516078-c16bfe80-954e-11eb-839c-cc72b0f5983b.png">
</p>

<p align="center">
    <img width="400" src="https://user-images.githubusercontent.com/58633356/110186994-a72aed80-7df5-11eb-80d8-7345f34117c5.png">
</p>

<p align="center">
    <img width="400" src="https://user-images.githubusercontent.com/58633356/113516105-e2345400-954e-11eb-8ce2-5a04f9280cd6.png">
</p>

<p align="center">
    <img width="400" src="https://user-images.githubusercontent.com/58633356/110187074-d9d4e600-7df5-11eb-9918-794f43a88c81.png">
</p>

<p align="center">
    <img width="300" src="https://aws1.discourse-cdn.com/auth0/original/3X/7/4/742b16086a12879c702afdd63170ddc802381ff0.gif">
</p>

#### Prefixos para o nome das branches:

- feature/ - tarefa comum de melhoria
- bugfix/ - tarefa para consertar bug em desenvolvimento
- hotfix/ - tarefa para consertar bug em produção
- release/ - branch para ajustar versão de lançamento

#### Criando uma versão de lançamento

A partir da `develop` criamos uma branch chamada `release/1.0.0`, onde o `1.0.0` é a versão que será lançada.

Ajustamos essa branch release para o lançamento, por exemplo, removendo do código uma parte ou outra que ainda não esteja com o desenvolvimento concluído. Não podemos criar coisas novas nessa branch, somente pequenas alterações para poder lançar sem nada estar quebrado ou pela metade.

Alteramos a versão no `package.json` para a nova versão e nos demais arquivos que forem necessários.

Depois de estar tudo certo podemos dar um commit das correções e iremos criar uma `tag` para a versão.

```
    git tag -a v1.0.0 -m "Breve descrição da nova versão"
```

Para verificarmos se a `tag` foi criada:

```
    git show v1.0.0
```

E então podemos mandar a tag para o repositório remoto:

```
    git push origin v1.0.0
```

E agora é a hora de fazer o merge na `master`

<p align="center">
    <img width="300" src="https://thumbs.gfycat.com/KnobbyReadyDarwinsfox-max-1mb.gif">
</p>

```
    git switch master
    git merge release/1.0.0
```

A branch de release também deve ser mergeada com a `develop` para mantê-la atualizada com as correções.

# Arquitetura

O projeto usa uma divisao didatica em MVC + DAO + Service.

## Fluxo

```txt
HTTP Request
  -> Controller
  -> Service
  -> DAO Interface
  -> PDO DAO
  -> MySQL
  -> JsonView
  -> HTTP Response
```

## Camadas

- `Models`: representam as entidades do dominio com atributos privados, getters e setters.
- `Controllers`: recebem a requisicao HTTP e chamam os services.
- `Services`: validam dados e concentram regras de negocio.
- `Dao/Contracts`: contratos que definem o acesso a dados.
- `Dao/Pdo`: implementacoes concretas com PDO e prepared statements.
- `Views/JsonView.php`: padroniza respostas JSON.
- `Exceptions`: excecoes especificas para validacao, busca e acesso a dados.

Essa separacao evita controller com SQL e mantem o banco isolado atras dos DAOs.

## Relacionamentos

```txt
User
  -> Topic
  -> StudyLog
  -> Checkpoint
  -> Mistake
```

Regras principais:

- `StudyLog` pertence a um `Topic`.
- `Checkpoint` pertence a um `StudyLog`.
- `Mistake` pertence a um `StudyLog`.
- `Mistake` pode pertencer tambem a um `Checkpoint`.
- `ChecklistItem` pertence a um `StudyLog`.
- `User` possui `role`: `admin` ou `user`.

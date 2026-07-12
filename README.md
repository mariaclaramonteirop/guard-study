# Guard Study

API REST e front-end para registrar estudos de programacao, acompanhar checkpoints, revisar erros e organizar evolucao por topicos.

## Stack

- Back-end: PHP 8, Slim 4, PDO, MySQL, Composer
- Arquitetura: MVC + DAO + Service
- Front-end: React, TypeScript, Vite, Tailwind CSS, React Router
- Infra: Docker, docker-compose, migrations SQL e GitHub Actions

## Estrutura

```txt
guard-study/
├── app/
│   ├── Controllers/
│   ├── Dao/
│   │   ├── Contracts/
│   │   └── Pdo/
│   ├── Database/
│   ├── Exceptions/
│   ├── Models/
│   ├── Services/
│   └── Views/
├── database/
│   ├── migrations/
│   ├── schema.sql
│   └── seed.sql
├── docs/
├── frontend/
├── public/
├── scripts/
├── studies/
├── docker-compose.yml
└── composer.json
```

## Separacao entre sistema e estudos reais

- `app/`, `public/`, `database/`, `frontend/`, `docs/` e `scripts/`: codigo e documentacao tecnica do sistema Guard Study.
- `studies/`: seus materiais reais de estudo, cronogramas, checkpoints pessoais e anotacoes.

Essa separacao evita misturar conteudo pessoal de aprendizado com a implementacao da API e do front-end.

## Rodar com Docker

```bash
docker compose up
```

Servicos:

- API: `http://localhost:8080`
- MySQL: `localhost:3307`

O Docker inicializa o banco com `database/schema.sql` e `database/seed.sql`.

## Rodar sem Docker

```bash
composer install
composer migrate
composer start
```

Crie `.env` localmente quando rodar fora do Docker:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=guard_study
DB_USERNAME=guard
DB_PASSWORD=guard
CORS_ALLOWED_ORIGIN=http://localhost:5173
```

## Migrations

As migrations ficam em `database/migrations`.

```bash
composer migrate
```

O runner registra migrations aplicadas na tabela `migrations`.

## Front-end

```bash
cd frontend
npm install
npm run dev
```

Crie `frontend/.env` localmente:

```env
VITE_API_URL=http://localhost:8080
```

Front-end local: `http://localhost:5173`

## Rotas

Veja [docs/routes.md](docs/routes.md).

## Arquitetura

Veja [docs/architecture.md](docs/architecture.md).

Fluxo principal:

```txt
Controller -> Service -> DAO -> PDO/MySQL -> JsonView
```

As models usam atributos privados com getters e setters para reforcar POO.

## CI

O workflow em `.github/workflows/ci.yml` valida:

- lint dos arquivos PHP;
- instalacao Composer;
- build do front-end React.

## Relacionamentos do MVP

```txt
Usuario -> Topicos -> Registros -> Checkpoints
                         └──────-> Erros
Checkpoints também podem agrupar erros relacionados.
```

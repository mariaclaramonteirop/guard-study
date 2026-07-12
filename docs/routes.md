# Rotas da Guard Study API

Base local: `http://localhost:8080`

Todas as respostas usam JSON:

```json
{
  "success": true,
  "data": {}
}
```

Erros seguem o formato:

```json
{
  "success": false,
  "error": {
    "message": "Mensagem do erro.",
    "details": {}
  }
}
```

## Topics

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/topics` | Lista topicos |
| GET | `/topics/{id}` | Detalha um topico |
| POST | `/topics` | Cria um topico |
| PUT | `/topics/{id}` | Atualiza um topico |
| DELETE | `/topics/{id}` | Remove um topico |

Payload:

```json
{
  "name": "PHP 8",
  "description": "Estudo de recursos modernos do PHP",
  "status": "ativo"
}
```

## Study Logs

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/study-logs` | Lista registros |
| GET | `/study-logs/{id}` | Detalha um registro |
| POST | `/study-logs` | Cria um registro |
| PUT | `/study-logs/{id}` | Atualiza um registro |
| DELETE | `/study-logs/{id}` | Remove um registro |

Payload:

```json
{
  "topic_id": 1,
  "title": "Revisao de POO",
  "content": "Pratiquei classes e excecoes.",
  "duration_minutes": 60,
  "studied_at": "2026-07-11"
}
```

## Checkpoints

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/checkpoints` | Lista checkpoints |
| GET | `/checkpoints/{id}` | Detalha um checkpoint |
| POST | `/checkpoints` | Cria um checkpoint |
| PUT | `/checkpoints/{id}` | Atualiza um checkpoint |
| PATCH | `/checkpoints/{id}/complete` | Marca como completo |
| DELETE | `/checkpoints/{id}` | Remove um checkpoint |

Payload:

```json
{
  "study_log_id": 1,
  "title": "Criar CRUD",
  "description": "Implementar rotas com Slim"
}
```

## Checklists

Checklist fica ligado ao `StudyLog`.

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/checklists` | Lista itens |
| GET | `/checklists/{id}` | Detalha um item |
| POST | `/checklists` | Cria um item |
| PUT | `/checklists/{id}` | Atualiza um item |
| PATCH | `/checklists/{id}/toggle` | Alterna concluido |
| DELETE | `/checklists/{id}` | Remove um item |

Payload:

```json
{
  "study_log_id": 1,
  "title": "Refazer exemplo de classe",
  "is_completed": 0
}
```

## Mistakes

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/mistakes` | Lista erros |
| GET | `/mistakes/{id}` | Detalha um erro |
| POST | `/mistakes` | Cria um erro |
| PUT | `/mistakes/{id}` | Atualiza um erro |
| PATCH | `/mistakes/{id}/review` | Marca como revisado |
| DELETE | `/mistakes/{id}` | Remove um erro |

Payload:

```json
{
  "study_log_id": 1,
  "checkpoint_id": 1,
  "title": "Erro com namespace",
  "description": "Importei a classe errada.",
  "correction": "Conferir o use e o namespace da classe."
}
```

`checkpoint_id` e opcional. Use quando o erro estiver vinculado a um checkpoint especifico.

## Users

Rotas protegidas por header:

```txt
X-User-Role: admin
```

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/users` | Lista usuarios |
| GET | `/users/{id}` | Detalha um usuario |
| POST | `/users` | Cria um usuario |
| PUT | `/users/{id}` | Atualiza um usuario |
| DELETE | `/users/{id}` | Remove um usuario |

Payload:

```json
{
  "name": "Maria Clara",
  "email": "maria@example.com",
  "password": "senha-local",
  "role": "user"
}
```

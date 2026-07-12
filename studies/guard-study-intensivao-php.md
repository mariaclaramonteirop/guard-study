# Guard Study — Intensivão PHP Web

> **Checkpoint de aprendizado da Maria Clara para dominar Programação para Web em PHP.**  
> Objetivo: transformar o estudo do próximo semestre em um processo acompanhável, com cronograma, projetos, checkpoints, simulados e caderno de erros.

---

## 1. Visão geral

Este documento organiza um intensivão baseado nos conteúdos de Programação para Web em PHP, cobrindo:

- Introdução e linguagem PHP
- Arrays
- Unicode e strings
- Programação Orientada a Objetos
- Tratamento de exceções
- Banco de dados com PDO
- HTTP
- Geração de conteúdo
- REST e APIs RESTful
- MVC

A ideia não é estudar “PHP genérico”.  
A ideia é estudar **o PHP da disciplina**, com prática suficiente para resolver questão, escrever código e explicar conceito.

---

## 2. Frase-guia do intensivão

> **Eu já trabalho com PHP. Agora eu vou aprender exatamente o PHP que a prova cobra.**

Reprovar por 0,6 não significa falta de capacidade. Significa que existe uma diferença entre:

1. o PHP usado no trabalho;
2. o PHP formal cobrado pela disciplina;
3. o jeito de resolver prova.

Este intensivão existe para alinhar os três.

---

## 3. Estrutura sugerida do repositório

Nome do repositório:

```txt
guard-study
```

Estrutura:

```txt
guard-study/
├── README.md
│
├── 00-diagnostico/
│   ├── mapa-de-lacunas.md
│   ├── prova-erros.md
│   └── checklist-geral.md
│
├── 01-base-php/
│   ├── resumo.md
│   ├── exercicios.md
│   └── src/
│
├── 02-arrays-strings-unicode/
│   ├── resumo.md
│   ├── exercicios.md
│   └── src/
│
├── 03-poo/
│   ├── resumo.md
│   ├── exercicios.md
│   └── src/
│
├── 04-excecoes/
│   ├── resumo.md
│   ├── exercicios.md
│   └── src/
│
├── 05-pdo-banco-dados/
│   ├── resumo.md
│   ├── exercicios.md
│   ├── database/
│   └── src/
│
├── 06-http-geracao-conteudo/
│   ├── resumo.md
│   ├── exercicios.md
│   └── src/
│
├── 07-rest-mvc/
│   ├── resumo.md
│   ├── exercicios.md
│   └── src/
│
├── projetos/
│   ├── projeto-01-lab-php/
│   ├── projeto-02-manipulador-textos/
│   ├── projeto-03-agenda-poo/
│   ├── projeto-04-tarefas-pdo/
│   └── projeto-05-api-fornecedores/
│
├── simulados/
│   ├── simulado-01-teorico.md
│   ├── simulado-02-codigo.md
│   └── simulado-final.md
│
└── caderno-de-erros/
    ├── erros-sintaxe.md
    ├── erros-poo.md
    ├── erros-pdo.md
    ├── erros-http-rest.md
    └── erros-prova.md
```

---

## 4. Rotina semanal

A rotina ideal é de **4 dias por semana + 1 checkpoint**.

| Dia | Atividade | Objetivo |
|---|---|---|
| Segunda | Teoria ativa | Ler o material e criar resumo curto |
| Terça | Código guiado | Reproduzir exemplos do professor |
| Quinta | Exercícios próprios | Resolver sem olhar resposta |
| Sábado ou domingo | Projeto/checkpoint | Aplicar o tema em projeto |
| Extra | Caderno de erros | Registrar tudo que travou |

Rotina mínima para semana corrida:

| Dia | Atividade |
|---|---|
| Dia 1 | Ler resumo + copiar exemplos |
| Dia 2 | Resolver exercícios |
| Dia 3 | Fazer checkpoint/projeto |

---

## 5. Cronograma geral do intensivão

| Semana | Tema principal | PDFs base | Foco prático | Projeto/checkpoint | Status |
|---|---|---|---|---|---|
| 1 | Base PHP | `pw-01-introducao.pdf`, `pw-02-linguagem-php.pdf` | Sintaxe, variáveis, tipos, operadores, condicionais, laços e funções | Laboratório PHP | ⬜ |
| 2 | Arrays, Strings e Unicode | `pw-03-arrays.pdf`, `pw-04-unicode.pdf`, `pw-05-strings.pdf` | Arrays indexados/associativos, foreach, UTF-8, aspas, heredoc, nowdoc | Manipulador de textos | ⬜ |
| 3 | POO | `pw-06-poo.pdf` | Classe, objeto, atributos, métodos, encapsulamento, construtor, herança e interface | Agenda POO | ⬜ |
| 4 | Exceções | `pw-07-excecoes.pdf` | try/catch/finally, throw, exceções próprias, fluxo de erro | Agenda com exceções | ⬜ |
| 5 | Banco com PDO | `pw-08-banco-dados.pdf` | PDO, PDOStatement, PDOException, prepare, execute, fetch e fetchAll | Lista de tarefas com MySQL | ⬜ |
| 6 | HTTP e geração de conteúdo | `pw-09-http.pdf`, `pw-10-geracao-conteudo.pdf` | Request, response, métodos HTTP, status, headers, Content-Type, JSON e HTML | Endpoints PHP puro | ⬜ |
| 7 | REST e MVC | `pw-12-rest.pdf`, `pw-13-mvc.pdf` | RESTful, rotas, JSON, Model, View, Controller e separação de responsabilidades | API de fornecedores | ⬜ |
| 8 | Revisão final | Todos | Simulados, revisão dos erros e projeto final sem cola | Simulado final | ⬜ |

---

## 6. Prioridades de estudo

### Prioridade máxima

Estudar com mais profundidade:

- POO
- Exceções
- PDO
- HTTP
- MVC
- REST/RESTful

Esses conteúdos tendem a se misturar em questões práticas.

### Prioridade média

- Arrays
- Strings
- Unicode
- Geração de conteúdo

Esses temas costumam gerar pegadinhas, principalmente com UTF-8, concatenação, aspas e estrutura de dados.

### Prioridade base

- História do PHP
- Características gerais
- Conceitos introdutórios

Importam para entender o contexto, mas não devem consumir o maior tempo do intensivão.

---

# 7. Semana 1 — Base PHP

## 7.1 Objetivo da semana

Dominar a base necessária para escrever código PHP sem travar.

Ao final da semana, você precisa conseguir:

- declarar variáveis;
- diferenciar tipos;
- usar operadores;
- criar condicionais;
- criar laços;
- escrever funções simples;
- executar arquivos PHP pelo terminal;
- explicar `echo`, `return`, `if`, `switch`, `for`, `while` e `foreach`.

---

## 7.2 Materiais da semana

- `pw-01-introducao.pdf`
- `pw-02-linguagem-php.pdf`

---

## 7.3 Resumo da Semana 1

### O que é PHP

PHP é uma linguagem muito usada no desenvolvimento web do lado servidor.  
No contexto da disciplina, o foco é entender como o PHP gera conteúdo dinâmico para aplicações web.

### Arquivos PHP

Arquivos PHP geralmente usam a extensão:

```txt
.php
```

O código PHP deve ficar dentro das tags:

```php
<?php
// código aqui
?>
```

Em arquivos puramente PHP, normalmente é melhor **não fechar** a tag `?>`, para evitar espaços ou quebras de linha acidentais na resposta.

### Comentários

```php
// comentário de linha

# comentário de linha

/*
 comentário
 de bloco
*/
```

### Variáveis

Em PHP, variáveis começam com `$`.

```php
$nome = 'Maria Clara';
$idade = 20;
$altura = 1.70;
$aprovada = true;
```

### Tipos principais

Tipos escalares:

```txt
bool
int
float
string
```

Tipos compostos:

```txt
array
object
callable
iterable
```

Tipos especiais:

```txt
resource
NULL
```

Pseudo-tipos:

```txt
mixed
number
```

### Saída com echo

```php
echo 'Olá, mundo!';
```

Com concatenação:

```php
$nome = 'Maria Clara';

echo 'Olá, ' . $nome;
```

### Condicionais

```php
$nota = 7.5;

if ($nota >= 6) {
    echo 'Aprovada';
} else {
    echo 'Reprovada';
}
```

### Switch

```php
$opcao = 2;

switch ($opcao) {
    case 1:
        echo 'Cadastrar';
        break;

    case 2:
        echo 'Listar';
        break;

    default:
        echo 'Opção inválida';
}
```

### Laços

#### for

```php
for ($i = 1; $i <= 10; $i++) {
    echo $i . PHP_EOL;
}
```

#### while

```php
$contador = 1;

while ($contador <= 10) {
    echo $contador . PHP_EOL;
    $contador++;
}
```

#### foreach

```php
$nomes = ['Ana', 'Maria', 'João'];

foreach ($nomes as $nome) {
    echo $nome . PHP_EOL;
}
```

### Funções

```php
function somar($a, $b)
{
    return $a + $b;
}

echo somar(2, 3);
```

Com tipagem:

```php
function calcularMedia(float $n1, float $n2): float
{
    return ($n1 + $n2) / 2;
}
```

---

## 7.4 Pegadinhas da Semana 1

| Pegadinha | Como evitar |
|---|---|
| Esquecer `$` em variável | Toda variável PHP começa com `$` |
| Usar `+` para concatenar string | Em PHP concatenação é com `.` |
| Confundir `echo` com `return` | `echo` imprime; `return` devolve valor |
| Esquecer `break` no `switch` | Coloque `break` quando não quiser continuar |
| Confundir `=` com `==` | `=` atribui; `==` compara valor; `===` compara valor e tipo |
| Fechar `?>` sem necessidade | Em arquivo PHP puro, prefira não fechar |

---

## 7.5 Cronograma detalhado da Semana 1

| Dia | Atividade | Entrega |
|---|---|---|
| Dia 1 | Ler introdução + linguagem PHP | `01-base-php/resumo.md` |
| Dia 2 | Reproduzir exemplos básicos | `variaveis.php`, `tipos.php`, `comentarios.php` |
| Dia 3 | Condicionais e laços | `condicionais.php`, `lacos.php` |
| Dia 4 | Funções | `funcoes.php`, `calculadora.php` |
| Checkpoint | Mini projeto da semana | `projetos/projeto-01-lab-php/` |

---

## 7.6 Exercícios da Semana 1

### Exercício 1 — Olá personalizado

Crie um arquivo:

```txt
ola.php
```

Requisitos:

- criar uma variável `$nome`;
- criar uma variável `$curso`;
- imprimir uma frase com concatenação.

Exemplo esperado:

```txt
Olá, Maria Clara! Bem-vinda ao intensivão de PHP.
```

---

### Exercício 2 — Tipos de dados

Crie um arquivo:

```txt
tipos.php
```

Declare variáveis dos tipos:

- string
- int
- float
- bool
- array
- NULL

Depois use `var_dump()` para verificar os tipos.

---

### Exercício 3 — Calculadora simples

Crie um arquivo:

```txt
calculadora.php
```

Crie funções para:

- somar;
- subtrair;
- multiplicar;
- dividir.

Regras:

- a função de divisão não pode dividir por zero;
- se o divisor for zero, retornar a mensagem `"Divisão inválida"`.

---

### Exercício 4 — Cálculo de IMC

Crie um arquivo:

```txt
imc.php
```

Crie uma função:

```php
function calcularImc(float $peso, float $altura): float
```

Depois crie outra função:

```php
function classificarImc(float $imc): string
```

Classificação sugerida:

| IMC | Classificação |
|---|---|
| Menor que 18.5 | Abaixo do peso |
| 18.5 a 24.9 | Peso normal |
| 25 a 29.9 | Sobrepeso |
| 30 ou mais | Obesidade |

---

### Exercício 5 — Verificador de aprovação

Crie um arquivo:

```txt
aprovacao.php
```

Regras:

- nota maior ou igual a 6: aprovada;
- nota entre 4 e 5.9: recuperação;
- nota menor que 4: reprovada.

---

### Exercício 6 — Tabuada

Crie um arquivo:

```txt
tabuada.php
```

Requisitos:

- criar uma função que recebe um número;
- imprimir a tabuada de 1 a 10 usando `for`.

---

### Exercício 7 — Lista de nomes

Crie um arquivo:

```txt
nomes.php
```

Requisitos:

- criar um array com 5 nomes;
- percorrer com `foreach`;
- imprimir um nome por linha.

---

### Exercício 8 — Menu no terminal

Crie um arquivo:

```txt
menu.php
```

Use `readline()` para exibir um menu:

```txt
1 - Somar
2 - Subtrair
3 - Multiplicar
4 - Dividir
0 - Sair
```

O programa deve ler a opção e executar a operação escolhida.

---

## 7.7 Mini projeto da Semana 1 — Laboratório PHP

Pasta:

```txt
projetos/projeto-01-lab-php/
```

Objetivo:

Criar um conjunto de arquivos pequenos para testar a base da linguagem.

Estrutura:

```txt
projeto-01-lab-php/
├── variaveis.php
├── tipos.php
├── operadores.php
├── condicionais.php
├── switch.php
├── for.php
├── while.php
├── foreach.php
├── funcoes.php
├── calculadora.php
└── README.md
```

README do projeto:

```md
# Projeto 01 — Laboratório PHP

Objetivo: praticar a base da linguagem PHP.

## Conteúdos praticados

- Variáveis
- Tipos
- Operadores
- Condicionais
- Laços
- Funções
- Saída no terminal
```

---

## 7.8 Checkpoint da Semana 1

Marque quando conseguir fazer sem olhar:

```md
## Checkpoint Semana 1

- [ ] Sei criar um arquivo PHP
- [ ] Sei executar PHP no terminal
- [ ] Sei declarar variáveis
- [ ] Sei usar string, int, float e bool
- [ ] Sei usar array simples
- [ ] Sei usar echo
- [ ] Sei usar concatenação com `.`
- [ ] Sei criar if/else
- [ ] Sei criar switch
- [ ] Sei criar for
- [ ] Sei criar while
- [ ] Sei criar foreach
- [ ] Sei criar função com return
- [ ] Sei explicar a diferença entre echo e return
- [ ] Sei resolver uma questão simples sem consultar material
```

---

# 8. Projetos do intensivão

## Projeto 1 — Laboratório PHP

**Foco:** base da linguagem.

Conteúdos:

- variáveis;
- tipos;
- operadores;
- condicionais;
- laços;
- funções;
- arrays simples.

Entrega:

```txt
10 arquivos pequenos testando conceitos básicos.
```

---

## Projeto 2 — Manipulador de textos

**Foco:** arrays, strings e Unicode.

Ideia:

Criar um programa que recebe uma lista de alunos e gera relatórios.

Exemplo de dados:

```php
$alunos = [
    ['nome' => 'Ana Clara', 'nota' => 8.5],
    ['nome' => 'Maria Clara', 'nota' => 9.2],
    ['nome' => 'João', 'nota' => 5.8],
];
```

Funcionalidades:

- listar alunos;
- calcular média;
- exibir aprovados;
- exibir reprovados;
- contar caracteres dos nomes;
- gerar saída em texto.

---

## Projeto 3 — Agenda POO

**Foco:** Programação Orientada a Objetos.

Classes:

```txt
Contato
Agenda
ValidadorContato
```

Contato:

```txt
id
nome
email
telefone
```

Funcionalidades:

- adicionar contato;
- listar contatos;
- buscar contato;
- remover contato;
- validar nome, email e telefone.

---

## Projeto 4 — Lista de tarefas com PDO

**Foco:** Banco de dados.

Tabela:

```sql
CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(60) NOT NULL,
    fechada TINYINT(1) NOT NULL DEFAULT 0
);
```

Classes:

```txt
Tarefa
RepositorioTarefa
RepositorioTarefaEmBDR
RepositorioException
```

Funcionalidades:

- adicionar tarefa;
- listar tarefas;
- buscar por id;
- atualizar descrição;
- marcar como concluída;
- marcar como aberta;
- remover tarefa.

---

## Projeto 5 — API RESTful de fornecedores

**Foco:** juntar tudo.

Entidade:

```txt
Fornecedor
- id
- nome
- cnpj
- telefone
```

Rotas:

```txt
GET /fornecedores
GET /fornecedores/{id}
POST /fornecedores
PUT /fornecedores/{id}
DELETE /fornecedores/{id}
```

Classes:

```txt
Fornecedor
RepositorioFornecedor
RepositorioFornecedorEmBDR
RepositorioException
FornecedorController
JsonView
```

Regras:

- nome obrigatório;
- CNPJ com 14 dígitos;
- telefone com 10 ou 11 dígitos;
- respostas em JSON;
- status HTTP coerente.

---

# 9. Modelo de resumo por PDF

Para cada PDF, criar um `resumo.md` seguindo este modelo:

```md
# Tema

## O que é

## Conceitos principais

## Sintaxe importante

## Exemplos do professor

## Pegadinhas

## O que pode cair na prova

## Exercícios que eu preciso refazer
```

---

# 10. Modelo de caderno de erros

Use este formato sempre que errar:

```md
# Erro 01 — Título do erro

## Onde aconteceu

Ex: exercício de PDO / simulado / projeto.

## O que eu errei

Descrever objetivamente.

## Por que eu errei

Ex: confundi conceito, esqueci sintaxe, interpretei errado o enunciado.

## Como corrigir

Explicação curta.

## Exemplo certo

```php
// código correto aqui
```

## Como não errar de novo

Criar uma regra simples.
```

---

# 11. Simulados

## Simulado 1 — Teórico

Responder sem consultar:

1. O que é PHP?
2. Para que serve o `echo`?
3. Qual a diferença entre `echo` e `return`?
4. Quais são os tipos escalares do PHP?
5. O que é um array em PHP?
6. Qual a diferença entre array indexado e associativo?
7. Qual a diferença entre aspas simples e aspas duplas?
8. O que é UTF-8?
9. O que é uma classe?
10. O que é um objeto?
11. O que é encapsulamento?
12. O que é uma exceção?
13. O que é PDO?
14. O que é `PDOStatement`?
15. O que é HTTP?
16. Qual a diferença entre GET e POST?
17. O que é `Content-Type`?
18. O que é RESTful?
19. O que é MVC?
20. Qual a responsabilidade da Controller?

---

## Simulado 2 — Código

Tempo sugerido: 2 horas.

Desafio:

Criar uma aplicação PHP de produtos.

Produto:

```txt
id
nome
preco
quantidade
```

Requisitos:

- criar classe `Produto`;
- validar nome;
- validar preço;
- validar quantidade;
- criar pelo menos uma exceção personalizada;
- criar array de produtos;
- listar produtos;
- calcular valor total em estoque.

---

## Simulado final — Projeto

Tempo sugerido: 4 horas.

Criar uma API RESTful de tarefas ou fornecedores com:

- entidade;
- repositório;
- exceção própria;
- persistência com PDO;
- controller;
- retorno JSON;
- status HTTP;
- organização parecida com MVC.

---

# 12. Checklist final de domínio

## Base PHP

- [ ] Sei declarar variáveis
- [ ] Sei diferenciar tipos escalares e compostos
- [ ] Sei criar funções
- [ ] Sei usar `if`
- [ ] Sei usar `switch`
- [ ] Sei usar `for`
- [ ] Sei usar `while`
- [ ] Sei usar `foreach`

## Arrays e strings

- [ ] Sei criar array indexado
- [ ] Sei criar array associativo
- [ ] Sei percorrer array com `foreach`
- [ ] Sei usar concatenação
- [ ] Sei diferenciar aspas simples e duplas
- [ ] Sei explicar problema de charset
- [ ] Sei usar funções compatíveis com UTF-8 quando necessário

## POO

- [ ] Sei criar classe
- [ ] Sei instanciar objeto
- [ ] Sei criar atributos
- [ ] Sei criar métodos
- [ ] Sei usar `private`
- [ ] Sei usar `public`
- [ ] Sei criar construtor
- [ ] Sei explicar encapsulamento
- [ ] Sei criar interface
- [ ] Sei explicar herança
- [ ] Sei explicar polimorfismo

## Exceções

- [ ] Sei usar `try`
- [ ] Sei usar `catch`
- [ ] Sei usar `finally`
- [ ] Sei lançar exceção com `throw`
- [ ] Sei criar exceção personalizada
- [ ] Sei explicar o fluxo quando uma exceção é lançada

## PDO

- [ ] Sei criar conexão com PDO
- [ ] Sei configurar `ERRMODE_EXCEPTION`
- [ ] Sei usar `prepare`
- [ ] Sei usar `execute`
- [ ] Sei usar `fetch`
- [ ] Sei usar `fetchAll`
- [ ] Sei tratar `PDOException`
- [ ] Sei criar repositório usando PDO

## HTTP e geração de conteúdo

- [ ] Sei explicar requisição HTTP
- [ ] Sei explicar resposta HTTP
- [ ] Sei usar GET
- [ ] Sei usar POST
- [ ] Sei explicar PUT
- [ ] Sei explicar DELETE
- [ ] Sei usar status 200
- [ ] Sei usar status 201
- [ ] Sei usar status 400
- [ ] Sei usar status 404
- [ ] Sei usar status 500
- [ ] Sei retornar JSON
- [ ] Sei configurar `Content-Type`

## REST e MVC

- [ ] Sei explicar REST
- [ ] Sei explicar RESTful
- [ ] Sei explicar aplicação sem estado
- [ ] Sei separar Model, View e Controller
- [ ] Sei explicar responsabilidade da Model
- [ ] Sei explicar responsabilidade da View
- [ ] Sei explicar responsabilidade da Controller
- [ ] Sei construir CRUD simples
- [ ] Sei justificar a separação de responsabilidades

---

# 13. Como atualizar o Guard Study toda semana

Ao final de cada semana, atualizar:

```md
## Checkpoint semanal

### O que eu estudei

### O que eu consegui fazer sozinha

### O que eu ainda travei

### Erros que entraram no caderno

### Próximo foco
```

Sugestão de commit:

```bash
git add .
git commit -m "checkpoint: semana 1 base php"
```

Exemplos de commits:

```bash
git commit -m "study: add php basics exercises"
git commit -m "checkpoint: finish arrays and strings"
git commit -m "fix: review pdo exception handling"
git commit -m "docs: update error journal"
```

---

# 14. README pronto para o repositório

Copie o conteúdo abaixo para o `README.md` do `guard-study`.

```md
# Guard Study

Meu checkpoint de aprendizado para revisar, praticar e consolidar Programação para Web com PHP.

Este repositório nasceu como um plano de retomada: estudar com método, registrar progresso, transformar erros em revisão e construir pequenos projetos para fixar cada conteúdo.

## Objetivo

Dominar os principais conteúdos de PHP para Programação para Web:

- Base da linguagem PHP
- Arrays
- Unicode e strings
- Programação Orientada a Objetos
- Tratamento de exceções
- Banco de dados com PDO
- HTTP
- Geração de conteúdo
- REST e APIs RESTful
- MVC

## Método

Cada tema possui:

- resumo;
- exemplos;
- exercícios;
- mini projeto;
- checkpoint;
- registro de erros.

A ideia é estudar com prática, não apenas ler material.

## Estrutura

```txt
guard-study/
├── 00-diagnostico/
├── 01-base-php/
├── 02-arrays-strings-unicode/
├── 03-poo/
├── 04-excecoes/
├── 05-pdo-banco-dados/
├── 06-http-geracao-conteudo/
├── 07-rest-mvc/
├── projetos/
├── simulados/
└── caderno-de-erros/
```

## Cronograma

| Semana | Tema | Projeto |
|---|---|---|
| 1 | Base PHP | Laboratório PHP |
| 2 | Arrays, Strings e Unicode | Manipulador de textos |
| 3 | POO | Agenda POO |
| 4 | Exceções | Agenda com exceções |
| 5 | PDO e Banco de Dados | Lista de tarefas |
| 6 | HTTP e geração de conteúdo | Endpoints PHP puro |
| 7 | REST e MVC | API de fornecedores |
| 8 | Revisão final | Simulado final |

## Projetos

### Projeto 01 — Laboratório PHP

Prática de variáveis, tipos, operadores, condicionais, laços e funções.

### Projeto 02 — Manipulador de textos

Prática de arrays, strings, UTF-8 e relatórios em texto.

### Projeto 03 — Agenda POO

Prática de classes, objetos, encapsulamento, métodos e validações.

### Projeto 04 — Lista de tarefas com PDO

Prática de banco de dados, PDO, repositórios e exceções.

### Projeto 05 — API RESTful de fornecedores

Projeto final integrando POO, exceções, PDO, HTTP, JSON, RESTful e MVC.

## Checkpoints

Cada semana deve terminar com um checkpoint:

```md
## Checkpoint

- O que estudei:
- O que consegui fazer:
- Onde travei:
- O que preciso revisar:
```

## Caderno de erros

Errar faz parte do processo, mas erro sem registro vira repetição.

Cada erro deve ser anotado com:

- o que eu errei;
- por que errei;
- como corrigir;
- exemplo certo;
- como evitar de novo.

## Frase-guia

> Eu já trabalho com PHP. Agora eu vou aprender exatamente o PHP que a prova cobra.
```

---

# 15. Próximo passo imediato

A primeira entrega do repositório pode ser:

```txt
guard-study/
├── README.md
├── 00-diagnostico/
│   ├── mapa-de-lacunas.md
│   └── checklist-geral.md
└── 01-base-php/
    ├── resumo.md
    ├── exercicios.md
    └── src/
        ├── variaveis.php
        ├── tipos.php
        ├── condicionais.php
        ├── lacos.php
        └── funcoes.php
```

Primeiro commit sugerido:

```bash
git add .
git commit -m "docs: create guard study php plan"
```

Segundo commit sugerido:

```bash
git add .
git commit -m "study: add week 1 php basics"
```

---

## Bora.

O Guard Study vai ser o seu histórico de reconstrução.  
Não é só um repositório de estudos. É um lugar para provar, semana por semana, que você está avançando.

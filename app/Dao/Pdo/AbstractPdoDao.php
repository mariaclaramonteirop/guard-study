<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\ResourceDaoInterface;
use App\Exceptions\DaoException;
use PDO;
use Throwable;

abstract class AbstractPdoDao implements ResourceDaoInterface
{
    /** @param array<int, string> $columns */
    public function __construct(
        protected readonly PDO $pdo,
        protected readonly string $table,
        protected readonly array $columns,
    ) {
    }

    public function all(): array
    {
        try {
            $statement = $this->pdo->query("SELECT * FROM {$this->table} ORDER BY id DESC");
            return $statement->fetchAll();
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function find(int $id): ?array
    {
        try {
            $statement = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = :id");
            $statement->execute(['id' => $id]);
            $row = $statement->fetch();
            return $row ?: null;
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function create(array $data): array
    {
        try {
            $columns = $this->fillableColumns($data);
            $names = implode(', ', $columns);
            $params = ':' . implode(', :', $columns);
            $statement = $this->pdo->prepare("INSERT INTO {$this->table} ({$names}) VALUES ({$params})");
            $statement->execute($this->only($data, $columns));
            return $this->find((int) $this->pdo->lastInsertId()) ?? [];
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function update(int $id, array $data): ?array
    {
        try {
            $columns = $this->fillableColumns($data);
            $sets = implode(', ', array_map(fn (string $column): string => "{$column} = :{$column}", $columns));
            $payload = $this->only($data, $columns);
            $payload['id'] = $id;
            $statement = $this->pdo->prepare("UPDATE {$this->table} SET {$sets} WHERE id = :id");
            $statement->execute($payload);
            return $statement->rowCount() > 0 ? $this->find($id) : $this->find($id);
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function delete(int $id): bool
    {
        try {
            $statement = $this->pdo->prepare("DELETE FROM {$this->table} WHERE id = :id");
            $statement->execute(['id' => $id]);
            return $statement->rowCount() > 0;
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function patch(int $id, array $data): ?array
    {
        return $this->update($id, $data);
    }

    /** @param array<string, mixed> $data @return array<int, string> */
    private function fillableColumns(array $data): array
    {
        return array_values(array_filter($this->columns, fn (string $column): bool => array_key_exists($column, $data)));
    }

    /** @param array<string, mixed> $data @param array<int, string> $columns @return array<string, mixed> */
    private function only(array $data, array $columns): array
    {
        return array_intersect_key($data, array_flip($columns));
    }
}

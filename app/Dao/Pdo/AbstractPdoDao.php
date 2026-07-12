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

    public function all(?int $ownerId = null, ?string $ownerColumn = null): array
    {
        try {
            $sql = "SELECT * FROM {$this->table}";
            $params = [];
            if ($ownerId !== null && $ownerColumn !== null) {
                $sql .= " WHERE {$ownerColumn} = :owner_id";
                $params['owner_id'] = $ownerId;
            }
            $sql .= " ORDER BY id DESC";
            $statement = $this->pdo->prepare($sql);
            $statement->execute($params);
            return $statement->fetchAll();
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function find(int $id, ?int $ownerId = null, ?string $ownerColumn = null): ?array
    {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE id = :id";
            $params = ['id' => $id];
            if ($ownerId !== null && $ownerColumn !== null) {
                $sql .= " AND {$ownerColumn} = :owner_id";
                $params['owner_id'] = $ownerId;
            }
            $statement = $this->pdo->prepare($sql);
            $statement->execute($params);
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

    public function update(int $id, array $data, ?int $ownerId = null, ?string $ownerColumn = null): ?array
    {
        try {
            $columns = $this->fillableColumns($data);
            $sets = implode(', ', array_map(fn (string $column): string => "{$column} = :{$column}", $columns));
            $payload = $this->only($data, $columns);
            $payload['id'] = $id;
            $sql = "UPDATE {$this->table} SET {$sets} WHERE id = :id";
            if ($ownerId !== null && $ownerColumn !== null) {
                $sql .= " AND {$ownerColumn} = :owner_id";
                $payload['owner_id'] = $ownerId;
            }
            $statement = $this->pdo->prepare($sql);
            $statement->execute($payload);
            return $this->find($id, $ownerId, $ownerColumn);
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function delete(int $id, ?int $ownerId = null, ?string $ownerColumn = null): bool
    {
        try {
            $sql = "DELETE FROM {$this->table} WHERE id = :id";
            $params = ['id' => $id];
            if ($ownerId !== null && $ownerColumn !== null) {
                $sql .= " AND {$ownerColumn} = :owner_id";
                $params['owner_id'] = $ownerId;
            }
            $statement = $this->pdo->prepare($sql);
            $statement->execute($params);
            return $statement->rowCount() > 0;
        } catch (Throwable $exception) {
            throw DaoException::from($exception);
        }
    }

    public function patch(int $id, array $data, ?int $ownerId = null, ?string $ownerColumn = null): ?array
    {
        return $this->update($id, $data, $ownerId, $ownerColumn);
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

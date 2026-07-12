<?php

declare(strict_types=1);

namespace App\Dao\Contracts;

interface ResourceDaoInterface
{
    /** @return array<int, array<string, mixed>> */
    public function all(): array;

    /** @return array<string, mixed>|null */
    public function find(int $id): ?array;

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function create(array $data): array;

    /** @param array<string, mixed> $data @return array<string, mixed>|null */
    public function update(int $id, array $data): ?array;

    public function delete(int $id): bool;

    /** @param array<string, mixed> $data @return array<string, mixed>|null */
    public function patch(int $id, array $data): ?array;
}

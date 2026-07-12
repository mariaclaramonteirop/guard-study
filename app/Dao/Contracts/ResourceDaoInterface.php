<?php

declare(strict_types=1);

namespace App\Dao\Contracts;

interface ResourceDaoInterface
{
    /** @return array<int, array<string, mixed>> */
    public function all(?int $ownerId = null, ?string $ownerColumn = null): array;

    /** @return array<string, mixed>|null */
    public function find(int $id, ?int $ownerId = null, ?string $ownerColumn = null): ?array;

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function create(array $data): array;

    /** @param array<string, mixed> $data @return array<string, mixed>|null */
    public function update(int $id, array $data, ?int $ownerId = null, ?string $ownerColumn = null): ?array;

    public function delete(int $id, ?int $ownerId = null, ?string $ownerColumn = null): bool;

    /** @param array<string, mixed> $data @return array<string, mixed>|null */
    public function patch(int $id, array $data, ?int $ownerId = null, ?string $ownerColumn = null): ?array;
}

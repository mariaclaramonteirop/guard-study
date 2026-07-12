<?php

declare(strict_types=1);

namespace App\Security;

final class UserContext
{
    public function __construct(
        public readonly int $id,
        public readonly string $role,
    ) {
    }

    public function isManager(): bool
    {
        return in_array($this->role, ['manager', 'admin'], true);
    }
}

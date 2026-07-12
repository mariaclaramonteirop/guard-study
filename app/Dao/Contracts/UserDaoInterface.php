<?php

declare(strict_types=1);

namespace App\Dao\Contracts;

interface UserDaoInterface extends ResourceDaoInterface
{
    /** @return array<string, mixed>|null */
    public function findByEmail(string $email): ?array;

    /** @return array<string, mixed>|null */
    public function findByLogin(string $login): ?array;
}

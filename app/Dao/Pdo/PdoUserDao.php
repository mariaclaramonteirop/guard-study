<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\UserDaoInterface;
use PDO;

final class PdoUserDao extends AbstractPdoDao implements UserDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'users', ['name', 'email', 'password_hash', 'role']);
    }

    public function findByEmail(string $email): ?array
    {
        $statement = $this->pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $row = $statement->fetch();

        return $row ?: null;
    }

    public function findByLogin(string $login): ?array
    {
        $statement = $this->pdo->prepare('SELECT * FROM users WHERE email = :login OR name = :login LIMIT 1');
        $statement->execute(['login' => $login]);
        $row = $statement->fetch();

        return $row ?: null;
    }
}

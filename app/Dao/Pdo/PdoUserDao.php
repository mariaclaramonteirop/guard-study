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
}

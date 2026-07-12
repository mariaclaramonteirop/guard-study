<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\ProjectDaoInterface;
use PDO;

final class PdoProjectDao extends AbstractPdoDao implements ProjectDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'projects', [
            'user_id',
            'name',
            'description',
            'repository_url',
            'project_url',
            'notes',
            'status',
        ]);
    }
}

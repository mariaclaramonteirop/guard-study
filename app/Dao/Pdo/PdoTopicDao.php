<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\TopicDaoInterface;
use PDO;

final class PdoTopicDao extends AbstractPdoDao implements TopicDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'topics', ['name', 'description', 'status']);
    }
}

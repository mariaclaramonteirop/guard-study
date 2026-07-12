<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\CheckpointDaoInterface;
use PDO;

final class PdoCheckpointDao extends AbstractPdoDao implements CheckpointDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'checkpoints', ['topic_id', 'study_log_id', 'title', 'description', 'is_completed', 'completed_at']);
    }
}

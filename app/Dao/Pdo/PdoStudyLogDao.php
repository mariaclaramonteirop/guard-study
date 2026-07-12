<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\StudyLogDaoInterface;
use PDO;

final class PdoStudyLogDao extends AbstractPdoDao implements StudyLogDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'study_logs', ['topic_id', 'title', 'content', 'duration_minutes', 'studied_at']);
    }
}

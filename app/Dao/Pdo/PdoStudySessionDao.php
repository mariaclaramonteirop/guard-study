<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\StudySessionDaoInterface;
use PDO;

final class PdoStudySessionDao extends AbstractPdoDao implements StudySessionDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'study_sessions', [
            'user_id',
            'project_id',
            'topic_id',
            'study_log_id',
            'title',
            'timer_mode',
            'planned_minutes',
            'pause_minutes',
            'actual_minutes',
            'status',
            'started_at',
            'ended_at',
            'notes',
        ]);
    }
}

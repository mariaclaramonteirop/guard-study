<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\StudyGoalDaoInterface;
use PDO;

final class PdoStudyGoalDao extends AbstractPdoDao implements StudyGoalDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'study_goals', [
            'user_id',
            'project_id',
            'title',
            'description',
            'target_minutes',
            'target_sessions',
            'reward_title',
            'reward_points',
            'status',
            'achieved_at',
            'notes',
        ]);
    }
}

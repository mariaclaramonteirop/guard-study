<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\ReviewScheduleDaoInterface;
use PDO;

final class PdoReviewScheduleDao extends AbstractPdoDao implements ReviewScheduleDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'review_schedules', [
            'user_id',
            'study_log_id',
            'checkpoint_id',
            'mistake_id',
            'title',
            'scheduled_for',
            'status',
            'notes',
            'completed_at',
        ]);
    }
}

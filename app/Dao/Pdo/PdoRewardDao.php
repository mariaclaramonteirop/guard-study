<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\RewardDaoInterface;
use PDO;

final class PdoRewardDao extends AbstractPdoDao implements RewardDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'rewards', [
            'user_id',
            'goal_id',
            'title',
            'description',
            'points',
            'kind',
            'status',
            'unlocked_at',
            'claimed_at',
            'notes',
        ]);
    }
}

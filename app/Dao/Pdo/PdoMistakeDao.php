<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\MistakeDaoInterface;
use PDO;

final class PdoMistakeDao extends AbstractPdoDao implements MistakeDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'mistakes', ['study_log_id', 'checkpoint_id', 'title', 'description', 'correction', 'is_reviewed', 'reviewed_at']);
    }
}

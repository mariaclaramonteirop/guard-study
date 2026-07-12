<?php

declare(strict_types=1);

namespace App\Dao\Pdo;

use App\Dao\Contracts\ChecklistItemDaoInterface;
use PDO;

final class PdoChecklistItemDao extends AbstractPdoDao implements ChecklistItemDaoInterface
{
    public function __construct(PDO $pdo)
    {
        parent::__construct($pdo, 'checklist_items', ['user_id', 'study_log_id', 'title', 'is_completed']);
    }
}

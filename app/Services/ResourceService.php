<?php

declare(strict_types=1);

namespace App\Services;

use App\Dao\Contracts\ResourceDaoInterface;
use App\Exceptions\NotFoundException;
use App\Exceptions\ValidationException;
use App\Security\UserContext;

final class ResourceService
{
    /** @param array<int, string> $requiredFields */
    public function __construct(
        private readonly ResourceDaoInterface $dao,
        private readonly string $resourceName,
        private readonly array $requiredFields,
        private readonly ?string $ownerColumn = 'user_id',
    ) {
    }

    /** @return array<int, array<string, mixed>> */
    public function all(?UserContext $userContext = null): array
    {
        return $this->dao->all($this->ownerId($userContext), $this->ownerColumnFor($userContext));
    }

    /** @return array<string, mixed> */
    public function find(int $id, ?UserContext $userContext = null): array
    {
        return $this->dao->find($id, $this->ownerId($userContext), $this->ownerColumnFor($userContext)) ?? throw new NotFoundException("{$this->resourceName} nao encontrado.");
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function create(array $data, ?UserContext $userContext = null): array
    {
        $this->validate($data);
        $normalized = $this->normalize($data);
        if ($this->ownerColumn !== null && $userContext !== null) {
            $normalized[$this->ownerColumn] = $userContext->id;
        }
        return $this->dao->create($normalized);
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function update(int $id, array $data, ?UserContext $userContext = null): array
    {
        $this->find($id, $userContext);
        $this->validate($data);
        return $this->dao->update($id, $this->normalize($data), $this->ownerId($userContext), $this->ownerColumnFor($userContext)) ?? throw new NotFoundException("{$this->resourceName} nao encontrado.");
    }

    public function delete(int $id, ?UserContext $userContext = null): void
    {
        $this->find($id, $userContext);
        if (!$this->dao->delete($id, $this->ownerId($userContext), $this->ownerColumnFor($userContext))) {
            throw new NotFoundException("{$this->resourceName} nao encontrado.");
        }
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function patch(int $id, array $data, ?UserContext $userContext = null): array
    {
        $this->find($id, $userContext);
        return $this->dao->patch($id, $this->normalize($data), $this->ownerId($userContext), $this->ownerColumnFor($userContext)) ?? throw new NotFoundException("{$this->resourceName} nao encontrado.");
    }

    private function ownerId(?UserContext $userContext): ?int
    {
        if ($this->ownerColumn === null || $userContext === null || $userContext->isManager()) {
            return null;
        }

        return $userContext->id;
    }

    private function ownerColumnFor(?UserContext $userContext): ?string
    {
        if ($this->ownerColumn === null || $userContext === null || $userContext->isManager()) {
            return null;
        }

        return $this->ownerColumn;
    }

    /** @param array<string, mixed> $data */
    private function validate(array $data): void
    {
        $errors = [];
        foreach ($this->requiredFields as $field) {
            if (!array_key_exists($field, $data) || $data[$field] === null || $data[$field] === '') {
                $errors[$field] = 'Campo obrigatorio.';
            }
        }

        if ($errors !== []) {
            throw new ValidationException($errors);
        }
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function normalize(array $data): array
    {
        foreach (['topic_id', 'duration_minutes', 'project_id', 'study_log_id', 'checkpoint_id', 'mistake_id', 'review_schedule_id', 'goal_id', 'planned_minutes', 'pause_minutes', 'actual_minutes', 'target_minutes', 'target_sessions', 'reward_points', 'points'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $data[$field] === null || $data[$field] === '' ? null : (int) $data[$field];
            }
        }

        foreach (['is_completed', 'is_reviewed'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            }
        }

        return $data;
    }
}

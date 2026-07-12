<?php

declare(strict_types=1);

namespace App\Services;

use App\Dao\Contracts\ResourceDaoInterface;
use App\Exceptions\NotFoundException;
use App\Exceptions\ValidationException;

final class ResourceService
{
    /** @param array<int, string> $requiredFields */
    public function __construct(
        private readonly ResourceDaoInterface $dao,
        private readonly string $resourceName,
        private readonly array $requiredFields,
    ) {
    }

    /** @return array<int, array<string, mixed>> */
    public function all(): array
    {
        return $this->dao->all();
    }

    /** @return array<string, mixed> */
    public function find(int $id): array
    {
        return $this->dao->find($id) ?? throw new NotFoundException("{$this->resourceName} nao encontrado.");
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function create(array $data): array
    {
        $this->validate($data);
        return $this->dao->create($this->normalize($data));
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function update(int $id, array $data): array
    {
        $this->find($id);
        $this->validate($data);
        return $this->dao->update($id, $this->normalize($data)) ?? throw new NotFoundException("{$this->resourceName} nao encontrado.");
    }

    public function delete(int $id): void
    {
        $this->find($id);
        if (!$this->dao->delete($id)) {
            throw new NotFoundException("{$this->resourceName} nao encontrado.");
        }
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function patch(int $id, array $data): array
    {
        $this->find($id);
        return $this->dao->patch($id, $this->normalize($data)) ?? throw new NotFoundException("{$this->resourceName} nao encontrado.");
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
        foreach (['topic_id', 'duration_minutes'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = (int) $data[$field];
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

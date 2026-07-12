<?php

declare(strict_types=1);

namespace App\Models;

final class ChecklistItem
{
    public function __construct(
        private ?int $id,
        private ?int $userId,
        private int $studyLogId,
        private string $title,
        private bool $isCompleted,
    ) {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): void
    {
        $this->userId = $userId;
    }

    public function getStudyLogId(): int
    {
        return $this->studyLogId;
    }

    public function setStudyLogId(int $studyLogId): void
    {
        $this->studyLogId = $studyLogId;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function isCompleted(): bool
    {
        return $this->isCompleted;
    }

    public function setIsCompleted(bool $isCompleted): void
    {
        $this->isCompleted = $isCompleted;
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

final class Checkpoint
{
    public function __construct(
        private ?int $id,
        private int $topicId,
        private string $title,
        private ?string $description,
        private bool $isCompleted,
        private ?string $completedAt,
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

    public function getTopicId(): int
    {
        return $this->topicId;
    }

    public function setTopicId(int $topicId): void
    {
        $this->topicId = $topicId;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function isCompleted(): bool
    {
        return $this->isCompleted;
    }

    public function setIsCompleted(bool $isCompleted): void
    {
        $this->isCompleted = $isCompleted;
    }

    public function getCompletedAt(): ?string
    {
        return $this->completedAt;
    }

    public function setCompletedAt(?string $completedAt): void
    {
        $this->completedAt = $completedAt;
    }
}

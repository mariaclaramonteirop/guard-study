<?php

declare(strict_types=1);

namespace App\Models;

final class Mistake
{
    public function __construct(
        private ?int $id,
        private int $topicId,
        private string $title,
        private string $description,
        private string $correction,
        private bool $isReviewed,
        private ?string $reviewedAt,
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

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    public function getCorrection(): string
    {
        return $this->correction;
    }

    public function setCorrection(string $correction): void
    {
        $this->correction = $correction;
    }

    public function isReviewed(): bool
    {
        return $this->isReviewed;
    }

    public function setIsReviewed(bool $isReviewed): void
    {
        $this->isReviewed = $isReviewed;
    }

    public function getReviewedAt(): ?string
    {
        return $this->reviewedAt;
    }

    public function setReviewedAt(?string $reviewedAt): void
    {
        $this->reviewedAt = $reviewedAt;
    }
}

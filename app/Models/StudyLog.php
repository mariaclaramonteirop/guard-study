<?php

declare(strict_types=1);

namespace App\Models;

final class StudyLog
{
    public function __construct(
        private ?int $id,
        private int $topicId,
        private string $title,
        private string $content,
        private int $durationMinutes,
        private string $studiedAt,
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

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    public function getDurationMinutes(): int
    {
        return $this->durationMinutes;
    }

    public function setDurationMinutes(int $durationMinutes): void
    {
        $this->durationMinutes = $durationMinutes;
    }

    public function getStudiedAt(): string
    {
        return $this->studiedAt;
    }

    public function setStudiedAt(string $studiedAt): void
    {
        $this->studiedAt = $studiedAt;
    }
}

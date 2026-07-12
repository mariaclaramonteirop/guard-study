<?php

declare(strict_types=1);

namespace App\Models;

final class ReviewSchedule
{
    public function __construct(
        private ?int $id,
        private int $studyLogId,
        private ?int $checkpointId,
        private ?int $mistakeId,
        private string $title,
        private string $scheduledFor,
        private string $status,
        private ?string $notes,
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

    public function getStudyLogId(): int
    {
        return $this->studyLogId;
    }

    public function setStudyLogId(int $studyLogId): void
    {
        $this->studyLogId = $studyLogId;
    }

    public function getCheckpointId(): ?int
    {
        return $this->checkpointId;
    }

    public function setCheckpointId(?int $checkpointId): void
    {
        $this->checkpointId = $checkpointId;
    }

    public function getMistakeId(): ?int
    {
        return $this->mistakeId;
    }

    public function setMistakeId(?int $mistakeId): void
    {
        $this->mistakeId = $mistakeId;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getScheduledFor(): string
    {
        return $this->scheduledFor;
    }

    public function setScheduledFor(string $scheduledFor): void
    {
        $this->scheduledFor = $scheduledFor;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): void
    {
        $this->notes = $notes;
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

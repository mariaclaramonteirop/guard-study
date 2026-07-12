<?php

declare(strict_types=1);

namespace App\Models;

final class StudySession
{
    public function __construct(
        private ?int $id,
        private ?int $userId,
        private ?int $projectId,
        private ?int $topicId,
        private ?int $studyLogId,
        private string $title,
        private string $timerMode,
        private int $plannedMinutes,
        private ?int $pauseMinutes,
        private int $actualMinutes,
        private string $status,
        private string $startedAt,
        private ?string $endedAt,
        private ?string $notes,
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

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function setProjectId(?int $projectId): void
    {
        $this->projectId = $projectId;
    }

    public function getTopicId(): ?int
    {
        return $this->topicId;
    }

    public function setTopicId(?int $topicId): void
    {
        $this->topicId = $topicId;
    }

    public function getStudyLogId(): ?int
    {
        return $this->studyLogId;
    }

    public function setStudyLogId(?int $studyLogId): void
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

    public function getTimerMode(): string
    {
        return $this->timerMode;
    }

    public function setTimerMode(string $timerMode): void
    {
        $this->timerMode = $timerMode;
    }

    public function getPlannedMinutes(): int
    {
        return $this->plannedMinutes;
    }

    public function setPlannedMinutes(int $plannedMinutes): void
    {
        $this->plannedMinutes = $plannedMinutes;
    }

    public function getPauseMinutes(): ?int
    {
        return $this->pauseMinutes;
    }

    public function setPauseMinutes(?int $pauseMinutes): void
    {
        $this->pauseMinutes = $pauseMinutes;
    }

    public function getActualMinutes(): int
    {
        return $this->actualMinutes;
    }

    public function setActualMinutes(int $actualMinutes): void
    {
        $this->actualMinutes = $actualMinutes;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getStartedAt(): string
    {
        return $this->startedAt;
    }

    public function setStartedAt(string $startedAt): void
    {
        $this->startedAt = $startedAt;
    }

    public function getEndedAt(): ?string
    {
        return $this->endedAt;
    }

    public function setEndedAt(?string $endedAt): void
    {
        $this->endedAt = $endedAt;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): void
    {
        $this->notes = $notes;
    }
}

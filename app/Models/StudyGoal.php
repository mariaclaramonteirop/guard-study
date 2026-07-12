<?php

declare(strict_types=1);

namespace App\Models;

final class StudyGoal
{
    public function __construct(
        private ?int $id,
        private ?int $userId,
        private ?int $projectId,
        private string $title,
        private ?string $description,
        private int $targetMinutes,
        private ?int $targetSessions,
        private string $rewardTitle,
        private int $rewardPoints,
        private string $status,
        private ?string $achievedAt,
        private ?string $notes,
    ) {
    }

    public function getId(): ?int { return $this->id; }
    public function setId(?int $id): void { $this->id = $id; }
    public function getUserId(): ?int { return $this->userId; }
    public function setUserId(?int $userId): void { $this->userId = $userId; }
    public function getProjectId(): ?int { return $this->projectId; }
    public function setProjectId(?int $projectId): void { $this->projectId = $projectId; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): void { $this->title = $title; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): void { $this->description = $description; }
    public function getTargetMinutes(): int { return $this->targetMinutes; }
    public function setTargetMinutes(int $targetMinutes): void { $this->targetMinutes = $targetMinutes; }
    public function getTargetSessions(): ?int { return $this->targetSessions; }
    public function setTargetSessions(?int $targetSessions): void { $this->targetSessions = $targetSessions; }
    public function getRewardTitle(): string { return $this->rewardTitle; }
    public function setRewardTitle(string $rewardTitle): void { $this->rewardTitle = $rewardTitle; }
    public function getRewardPoints(): int { return $this->rewardPoints; }
    public function setRewardPoints(int $rewardPoints): void { $this->rewardPoints = $rewardPoints; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getAchievedAt(): ?string { return $this->achievedAt; }
    public function setAchievedAt(?string $achievedAt): void { $this->achievedAt = $achievedAt; }
    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): void { $this->notes = $notes; }
}

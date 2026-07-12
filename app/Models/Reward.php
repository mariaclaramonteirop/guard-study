<?php

declare(strict_types=1);

namespace App\Models;

final class Reward
{
    public function __construct(
        private ?int $id,
        private ?int $userId,
        private ?int $goalId,
        private string $title,
        private ?string $description,
        private int $points,
        private string $kind,
        private string $status,
        private ?string $unlockedAt,
        private ?string $claimedAt,
        private ?string $notes,
    ) {
    }

    public function getId(): ?int { return $this->id; }
    public function setId(?int $id): void { $this->id = $id; }
    public function getUserId(): ?int { return $this->userId; }
    public function setUserId(?int $userId): void { $this->userId = $userId; }
    public function getGoalId(): ?int { return $this->goalId; }
    public function setGoalId(?int $goalId): void { $this->goalId = $goalId; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): void { $this->title = $title; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): void { $this->description = $description; }
    public function getPoints(): int { return $this->points; }
    public function setPoints(int $points): void { $this->points = $points; }
    public function getKind(): string { return $this->kind; }
    public function setKind(string $kind): void { $this->kind = $kind; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getUnlockedAt(): ?string { return $this->unlockedAt; }
    public function setUnlockedAt(?string $unlockedAt): void { $this->unlockedAt = $unlockedAt; }
    public function getClaimedAt(): ?string { return $this->claimedAt; }
    public function setClaimedAt(?string $claimedAt): void { $this->claimedAt = $claimedAt; }
    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): void { $this->notes = $notes; }
}

<?php

declare(strict_types=1);

namespace App\Security;

final class Permissions
{
    private const MODULES = [
        'dashboard',
        'projects',
        'study_sessions',
        'study_goals',
        'rewards',
        'topics',
        'study_logs',
        'checkpoints',
        'mistakes',
        'review_schedules',
        'checklists',
        'users',
    ];

    /** @return array<string, bool> */
    public static function defaultsForRole(string $role): array
    {
        $defaults = array_fill_keys(self::MODULES, true);

        if ($role === 'user') {
            $defaults['users'] = false;
        }

        return $defaults;
    }

    /** @param mixed $value @return array<string, bool> */
    public static function fromPayload(mixed $value, string $role = 'user'): array
    {
        if (!is_array($value)) {
            return self::defaultsForRole($role);
        }

        $permissions = self::defaultsForRole($role);
        foreach (self::MODULES as $module) {
            if (array_key_exists($module, $value)) {
                $permissions[$module] = filter_var($value[$module], FILTER_VALIDATE_BOOLEAN);
            }
        }

        return $permissions;
    }

    /** @param mixed $value @return array<string, bool> */
    public static function fromStorage(mixed $value, string $role = 'user'): array
    {
        if (is_array($value)) {
            return self::fromPayload($value, $role);
        }

        if (!is_string($value) || $value === '') {
            return self::defaultsForRole($role);
        }

        $decoded = json_decode($value, true);
        return is_array($decoded) ? self::fromPayload($decoded, $role) : self::defaultsForRole($role);
    }

    /** @param array<string, bool> $permissions */
    public static function toStorage(array $permissions): string
    {
        return (string) json_encode(self::fromPayload($permissions), JSON_UNESCAPED_UNICODE);
    }

    /** @return array<int, string> */
    public static function modules(): array
    {
        return self::MODULES;
    }
}

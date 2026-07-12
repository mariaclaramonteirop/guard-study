<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

final class Connection
{
    private static ?PDO $pdo = null;

    public static function get(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
        $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
        $database = $_ENV['DB_DATABASE'] ?? getenv('DB_DATABASE') ?: 'guard_study';
        $username = $_ENV['DB_USERNAME'] ?? getenv('DB_USERNAME') ?: 'guard';
        $password = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: 'guard';

        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
        self::$pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$pdo;
    }
}

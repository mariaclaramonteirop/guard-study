<?php

declare(strict_types=1);

use App\Database\Connection;

require __DIR__ . '/../vendor/autoload.php';

if (class_exists(Dotenv\Dotenv::class) && file_exists(__DIR__ . '/../.env')) {
    Dotenv\Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
}

$pdo = Connection::get();
$pdo->exec(
    'CREATE TABLE IF NOT EXISTS migrations (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        migration VARCHAR(190) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
);

$executed = $pdo
    ->query('SELECT migration FROM migrations')
    ->fetchAll(PDO::FETCH_COLUMN);

$files = glob(__DIR__ . '/../database/migrations/*.sql') ?: [];
sort($files);

foreach ($files as $file) {
    $name = basename($file);
    if (in_array($name, $executed, true)) {
        echo "Ignorando {$name}\n";
        continue;
    }

    $sql = file_get_contents($file);
    if ($sql === false) {
        throw new RuntimeException("Nao foi possivel ler {$name}");
    }

    try {
        $pdo->exec($sql);
        $statement = $pdo->prepare('INSERT INTO migrations (migration) VALUES (:migration)');
        $statement->execute(['migration' => $name]);
        echo "Aplicada {$name}\n";
    } catch (Throwable $exception) {
        throw $exception;
    }
}

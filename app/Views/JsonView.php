<?php

declare(strict_types=1);

namespace App\Views;

use Psr\Http\Message\ResponseInterface as Response;

final class JsonView
{
    /** @param mixed $data */
    public static function success(Response $response, mixed $data = null, int $status = 200): Response
    {
        if ($status === 204) {
            return $response->withStatus(204);
        }

        return self::json($response, ['success' => true, 'data' => $data], $status);
    }

    /** @param array<string, mixed> $details */
    public static function error(Response $response, string $message, int $status, array $details = []): Response
    {
        return self::json($response, [
            'success' => false,
            'error' => [
                'message' => $message,
                'details' => $details,
            ],
        ], $status);
    }

    /** @param array<string, mixed> $payload */
    private static function json(Response $response, array $payload, int $status): Response
    {
        $response->getBody()->write((string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }
}

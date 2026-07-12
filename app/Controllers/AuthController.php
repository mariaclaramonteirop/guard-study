<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;
use App\Views\JsonView;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function __construct(private readonly AuthService $service)
    {
    }

    public function login(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        return JsonView::success($response, $this->service->login($payload));
    }

    public function signup(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        return JsonView::success($response, $this->service->signup($payload), 201);
    }
}

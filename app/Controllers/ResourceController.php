<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\ResourceService;
use App\Views\JsonView;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ResourceController
{
    public function __construct(private readonly ResourceService $service)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return JsonView::success($response, $this->service->all());
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        return JsonView::success($response, $this->service->find((int) $args['id']));
    }

    public function store(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        return JsonView::success($response, $this->service->create($payload), 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $payload = (array) $request->getParsedBody();
        return JsonView::success($response, $this->service->update((int) $args['id'], $payload));
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $this->service->delete((int) $args['id']);
        return JsonView::success($response, null, 204);
    }

    /** @param array<string, mixed> $data */
    public function patch(Request $request, Response $response, array $args, array $data): Response
    {
        return JsonView::success($response, $this->service->patch((int) $args['id'], $data));
    }
}

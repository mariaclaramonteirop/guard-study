<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\ResourceService;
use App\Security\UserContext;
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
        return JsonView::success($response, $this->service->all($this->context($request)));
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        return JsonView::success($response, $this->service->find((int) $args['id'], $this->context($request)));
    }

    public function store(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        return JsonView::success($response, $this->service->create($payload, $this->context($request)), 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $payload = (array) $request->getParsedBody();
        return JsonView::success($response, $this->service->update((int) $args['id'], $payload, $this->context($request)));
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $this->service->delete((int) $args['id'], $this->context($request));
        return JsonView::success($response, null, 204);
    }

    /** @param array<string, mixed> $data */
    public function patch(Request $request, Response $response, array $args, array $data): Response
    {
        return JsonView::success($response, $this->service->patch((int) $args['id'], $data, $this->context($request)));
    }

    private function context(Request $request): ?UserContext
    {
        $id = (int) ($request->getHeaderLine('X-Current-User-Id') ?: 0);
        $role = $request->getHeaderLine('X-Current-User-Role') ?: 'user';

        return $id > 0 ? new UserContext($id, $role) : null;
    }
}

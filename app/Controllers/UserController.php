<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Exceptions\AuthorizationException;
use App\Exceptions\ValidationException;
use App\Services\ResourceService;
use App\Security\UserContext;
use App\Views\JsonView;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class UserController
{
    public function __construct(private readonly ResourceService $service)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return JsonView::success($response, $this->hideHashes($this->service->all()));
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        return JsonView::success($response, $this->hideHash($this->service->find((int) $args['id'])));
    }

    public function store(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        $context = $this->context($request);
        $password = (string) ($payload['password'] ?? '');
        $role = (string) ($payload['role'] ?? 'user');

        if ($password === '') {
            throw new ValidationException(['password' => 'Campo obrigatorio.']);
        }

        if (!in_array($role, ['admin', 'manager', 'user'], true)) {
            throw new ValidationException(['role' => 'Use admin, manager ou user.']);
        }

        if ($context === null || !$context->isManager()) {
            if ($role !== 'user') {
                throw new AuthorizationException('Somente o manager pode conceder permissoes.');
            }

            $role = 'user';
        }

        $payload['role'] = $role;
        $payload['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
        unset($payload['password']);

        return JsonView::success($response, $this->hideHash($this->service->create($payload)), 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $payload = (array) $request->getParsedBody();
        $context = $this->context($request);
        if (isset($payload['password'])) {
            $payload['password_hash'] = password_hash((string) $payload['password'], PASSWORD_DEFAULT);
            unset($payload['password']);
        }

        if (isset($payload['role']) && !in_array((string) $payload['role'], ['admin', 'manager', 'user'], true)) {
            throw new ValidationException(['role' => 'Use admin, manager ou user.']);
        }

        if (array_key_exists('role', $payload) && ($context === null || !$context->isManager())) {
            throw new AuthorizationException('Somente o manager pode conceder permissoes.');
        }

        return JsonView::success($response, $this->hideHash($this->service->update((int) $args['id'], $payload)));
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $this->service->delete((int) $args['id']);
        return JsonView::success($response, null, 204);
    }

    /** @param array<int, array<string, mixed>> $users @return array<int, array<string, mixed>> */
    private function hideHashes(array $users): array
    {
        return array_map(fn (array $user): array => $this->hideHash($user), $users);
    }

    /** @param array<string, mixed> $user @return array<string, mixed> */
    private function hideHash(array $user): array
    {
        unset($user['password_hash']);
        return $user;
    }

    private function context(Request $request): ?UserContext
    {
        $id = (int) ($request->getHeaderLine('X-Current-User-Id') ?: 0);
        $role = $request->getHeaderLine('X-Current-User-Role') ?: 'user';

        return $id > 0 ? new UserContext($id, $role) : null;
    }
}

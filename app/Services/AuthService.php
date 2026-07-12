<?php

declare(strict_types=1);

namespace App\Services;

use App\Dao\Contracts\UserDaoInterface;
use App\Exceptions\NotFoundException;
use App\Exceptions\ValidationException;
use App\Security\Permissions;

final class AuthService
{
    public function __construct(private readonly UserDaoInterface $users)
    {
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function login(array $data): array
    {
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        $errors = [];
        if ($email === '') {
            $errors['email'] = 'Campo obrigatorio.';
        }
        if ($password === '') {
            $errors['password'] = 'Campo obrigatorio.';
        }
        if ($errors !== []) {
            throw new ValidationException($errors);
        }

        $user = $this->users->findByLogin($email);
        if ($user === null || !password_verify($password, (string) ($user['password_hash'] ?? ''))) {
            throw new NotFoundException('Credenciais invalidas.');
        }

        return $this->sanitize($user);
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    public function signup(array $data): array
    {
        $name = trim((string) ($data['name'] ?? ''));
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        $errors = [];
        if ($name === '') {
            $errors['name'] = 'Campo obrigatorio.';
        }
        if ($email === '') {
            $errors['email'] = 'Campo obrigatorio.';
        }
        if ($password === '') {
            $errors['password'] = 'Campo obrigatorio.';
        }
        if ($errors !== []) {
            throw new ValidationException($errors);
        }

        if ($this->users->findByEmail($email) !== null) {
            throw new ValidationException(['email' => 'Este email ja esta cadastrado.']);
        }

        $user = $this->users->create([
            'name' => $name,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'role' => 'user',
            'permissions' => Permissions::toStorage(Permissions::defaultsForRole('user')),
        ]);

        return $this->sanitize($user);
    }

    /** @param array<string, mixed> $user @return array<string, mixed> */
    private function sanitize(array $user): array
    {
        unset($user['password_hash']);
        $user['permissions'] = Permissions::fromStorage($user['permissions'] ?? null, (string) ($user['role'] ?? 'user'));

        return $user;
    }
}

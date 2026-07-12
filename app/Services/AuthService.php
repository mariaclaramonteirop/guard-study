<?php

declare(strict_types=1);

namespace App\Services;

use App\Dao\Contracts\UserDaoInterface;
use App\Exceptions\NotFoundException;
use App\Exceptions\ValidationException;

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

        unset($user['password_hash']);
        return $user;
    }
}

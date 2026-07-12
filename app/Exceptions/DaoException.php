<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

final class DaoException extends RuntimeException
{
    public static function from(Throwable $exception): self
    {
        return new self('Erro ao acessar o DAO.', 0, $exception);
    }
}

<?php

declare(strict_types=1);

use App\Controllers\ResourceController;
use App\Controllers\AuthController;
use App\Dao\Pdo\PdoCheckpointDao;
use App\Dao\Pdo\PdoChecklistItemDao;
use App\Dao\Pdo\PdoProjectDao;
use App\Dao\Pdo\PdoMistakeDao;
use App\Dao\Pdo\PdoReviewScheduleDao;
use App\Dao\Pdo\PdoStudySessionDao;
use App\Dao\Pdo\PdoStudyGoalDao;
use App\Dao\Pdo\PdoRewardDao;
use App\Dao\Pdo\PdoStudyLogDao;
use App\Dao\Pdo\PdoTopicDao;
use App\Dao\Pdo\PdoUserDao;
use App\Database\Connection;
use App\Exceptions\DaoException;
use App\Exceptions\AuthorizationException;
use App\Exceptions\NotFoundException;
use App\Exceptions\ValidationException;
use App\Services\AuthService;
use App\Services\ResourceService;
use App\Controllers\UserController;
use App\Views\JsonView;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

if (class_exists(Dotenv\Dotenv::class) && file_exists(__DIR__ . '/../.env')) {
    Dotenv\Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
}

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

$app->add(function (Request $request, $handler): Response {
    $response = $handler->handle($request);
    $requestOrigin = $request->getHeaderLine('Origin');
    $devOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
    $origin = in_array($requestOrigin, $devOrigins, true)
        ? $requestOrigin
        : ($_ENV['CORS_ALLOWED_ORIGIN'] ?? getenv('CORS_ALLOWED_ORIGIN') ?: '*');

    return $response
        ->withHeader('Access-Control-Allow-Origin', $origin)
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Current-User-Id, X-Current-User-Role')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
});

$app->options('/{routes:.+}', fn (Request $request, Response $response): Response => $response);

$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler(function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app): Response {
    $response = $app->getResponseFactory()->createResponse();

    if ($exception instanceof ValidationException) {
        return JsonView::error($response, $exception->getMessage(), 422, $exception->errors());
    }

    if ($exception instanceof AuthorizationException) {
        return JsonView::error($response, $exception->getMessage(), 403);
    }

    if ($exception instanceof NotFoundException) {
        return JsonView::error($response, $exception->getMessage(), 404);
    }

    if ($exception instanceof DaoException) {
        return JsonView::error($response, 'Erro interno ao acessar dados.', 500);
    }

    $message = $displayErrorDetails ? $exception->getMessage() : 'Erro interno.';
    return JsonView::error($response, $message, 500);
});

$pdo = Connection::get();

$topics = new ResourceController(new ResourceService(new PdoTopicDao($pdo), 'Topico', ['name']));
$projects = new ResourceController(new ResourceService(new PdoProjectDao($pdo), 'Projeto', ['name']));
$studySessions = new ResourceController(new ResourceService(new PdoStudySessionDao($pdo), 'Sessao de estudo', ['title', 'timer_mode', 'planned_minutes', 'started_at']));
$studyGoals = new ResourceController(new ResourceService(new PdoStudyGoalDao($pdo), 'Meta', ['title', 'target_minutes', 'reward_title']));
$rewards = new ResourceController(new ResourceService(new PdoRewardDao($pdo), 'Recompensa', ['title', 'kind']));
$studyLogs = new ResourceController(new ResourceService(new PdoStudyLogDao($pdo), 'Registro de estudo', ['topic_id', 'title', 'content', 'duration_minutes', 'studied_at']));
$checkpoints = new ResourceController(new ResourceService(new PdoCheckpointDao($pdo), 'Checkpoint', ['study_log_id', 'title']));
$checklistItems = new ResourceController(new ResourceService(new PdoChecklistItemDao($pdo), 'Checklist', ['study_log_id', 'title']));
$mistakes = new ResourceController(new ResourceService(new PdoMistakeDao($pdo), 'Erro', ['study_log_id', 'title', 'description', 'correction']));
$reviewSchedules = new ResourceController(new ResourceService(new PdoReviewScheduleDao($pdo), 'Agendamento de revisao', ['study_log_id', 'title', 'scheduled_for']));
$users = new UserController(new ResourceService(new PdoUserDao($pdo), 'Usuario', ['name', 'email', 'password_hash', 'role']));
$auth = new AuthController(new AuthService(new PdoUserDao($pdo)));

$app->get('/', fn (Request $request, Response $response): Response => JsonView::success($response, [
    'name' => 'Guard Study API',
    'version' => '1.0.0',
]));

foreach ([
    '/topics' => $topics,
    '/projects' => $projects,
    '/study-sessions' => $studySessions,
    '/goals' => $studyGoals,
    '/rewards' => $rewards,
    '/study-logs' => $studyLogs,
    '/checkpoints' => $checkpoints,
    '/checklists' => $checklistItems,
    '/mistakes' => $mistakes,
    '/review-schedules' => $reviewSchedules,
] as $path => $controller) {
    $app->get($path, [$controller, 'index']);
    $app->get($path . '/{id:[0-9]+}', [$controller, 'show']);
    $app->post($path, [$controller, 'store']);
    $app->put($path . '/{id:[0-9]+}', [$controller, 'update']);
    $app->delete($path . '/{id:[0-9]+}', [$controller, 'destroy']);
}

$app->group('/users', function ($group) use ($users): void {
    $group->get('', [$users, 'index']);
    $group->get('/{id:[0-9]+}', [$users, 'show']);
    $group->post('', [$users, 'store']);
    $group->put('/{id:[0-9]+}', [$users, 'update']);
    $group->delete('/{id:[0-9]+}', [$users, 'destroy']);
})->add(function (Request $request, $handler): Response {
    if (!in_array($request->getHeaderLine('X-Current-User-Role'), ['admin', 'manager'], true)) {
        $response = new Slim\Psr7\Response();
        return JsonView::error($response, 'Acesso permitido apenas para manager ou admin.', 403);
    }

    return $handler->handle($request);
});

$app->post('/auth/login', [$auth, 'login']);
$app->post('/auth/signup', [$auth, 'signup']);

$app->patch('/checkpoints/{id:[0-9]+}/complete', fn (Request $request, Response $response, array $args): Response =>
    $checkpoints->patch($request, $response, $args, ['is_completed' => 1, 'completed_at' => date('Y-m-d H:i:s')])
);

$app->patch('/checklists/{id:[0-9]+}/toggle', function (Request $request, Response $response, array $args) use ($pdo, $checklistItems): Response {
    $userId = (int) ($request->getHeaderLine('X-Current-User-Id') ?: 0);
    $role = $request->getHeaderLine('X-Current-User-Role');
    $sql = 'SELECT is_completed FROM checklist_items WHERE id = :id';
    $params = ['id' => (int) $args['id']];

    if (!in_array($role, ['admin', 'manager'], true)) {
        $sql .= ' AND user_id = :user_id';
        $params['user_id'] = $userId;
    }

    $current = $pdo->prepare($sql);
    $current->execute($params);
    $row = $current->fetch();

    if (!$row) {
        throw new NotFoundException('Checklist nao encontrado.');
    }

    return $checklistItems->patch($request, $response, $args, ['is_completed' => (int) !$row['is_completed']]);
});

$app->patch('/mistakes/{id:[0-9]+}/review', fn (Request $request, Response $response, array $args): Response =>
    $mistakes->patch($request, $response, $args, ['is_reviewed' => 1, 'reviewed_at' => date('Y-m-d H:i:s')])
);

$app->patch('/review-schedules/{id:[0-9]+}/complete', fn (Request $request, Response $response, array $args): Response =>
    $reviewSchedules->patch($request, $response, $args, ['status' => 'done', 'completed_at' => date('Y-m-d H:i:s')])
);

$app->patch('/goals/{id:[0-9]+}/complete', fn (Request $request, Response $response, array $args): Response =>
    $studyGoals->patch($request, $response, $args, ['status' => 'achieved', 'achieved_at' => date('Y-m-d H:i:s')])
);

$app->patch('/rewards/{id:[0-9]+}/claim', fn (Request $request, Response $response, array $args): Response =>
    $rewards->patch($request, $response, $args, ['status' => 'claimed', 'claimed_at' => date('Y-m-d H:i:s')])
);

$app->run();

<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Serves the Vue application for every frontend path; routing happens in Vue.
 */
final class AppController extends AbstractController
{
    #[Route('/{path}', name: 'app', requirements: ['path' => '.*'], methods: ['GET'], priority: -100)]
    public function __invoke(): Response
    {
        return $this->render('app.html.twig');
    }
}

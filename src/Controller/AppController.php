<?php

namespace App\Controller;

use App\Translation\FrontendTranslations;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Serves the Vue application for every frontend path; routing happens in Vue.
 */
final class AppController extends AbstractController
{
    #[Route('/{path}', name: 'app', requirements: ['path' => '.*'], methods: ['GET'], priority: -100)]
    public function __invoke(Request $request, FrontendTranslations $translations): Response
    {
        return $this->render('app.html.twig', [
            'translations' => $translations->forLocale($request->getLocale()),
        ]);
    }
}

<?php

namespace App\Tests\Controller;

use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class AppControllerTest extends WebTestCase
{
    #[DataProvider('frontendPaths')]
    public function testServesVueAppForEveryFrontendPath(string $path): void
    {
        $client = static::createClient();
        $client->request('GET', $path);

        self::assertResponseIsSuccessful();
        self::assertSelectorExists('div#app');
    }

    public static function frontendPaths(): iterable
    {
        yield 'root' => ['/'];
        yield 'nested path' => ['/notes/some-note'];
    }

    public function testRejectsNonGetRequests(): void
    {
        $client = static::createClient();
        $client->request('POST', '/');

        self::assertResponseStatusCodeSame(405);
    }
}

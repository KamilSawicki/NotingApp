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

    public function testEmbedsFrontendTranslationsForRequestLocale(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        self::assertSelectorExists('html[lang="en"]');

        $translations = json_decode($crawler->filter('script#translations')->text(), true, flags: \JSON_THROW_ON_ERROR);
        self::assertSame('Settings', $translations['messages']['sidebar.settings']);
        self::assertSame('Search the tree…', $translations['fields']['sidebar.search.placeholder']);
    }

    public function testRejectsNonGetRequests(): void
    {
        $client = static::createClient();
        $client->request('POST', '/');

        self::assertResponseStatusCodeSame(405);
    }
}

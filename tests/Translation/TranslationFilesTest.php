<?php

namespace App\Tests\Translation;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Yaml\Yaml;

/**
 * Enforces the translation conventions from AGENTS.md.
 */
final class TranslationFilesTest extends TestCase
{
    private const array DOMAINS = ['messages', 'fields', 'validators', 'emails'];

    #[DataProvider('translationFiles')]
    public function testIsNamedAfterAllowedIcuDomain(string $path): void
    {
        self::assertMatchesRegularExpression(
            '/^(?<domain>[a-z]+)\+intl-icu\.[a-z]{2}(_[A-Z]{2})?\.yaml$/',
            basename($path),
            \sprintf('"%s" should be named {domain}+intl-icu.{locale}.yaml.', $path),
        );

        $domain = explode('+', basename($path))[0];
        self::assertContains($domain, self::DOMAINS, \sprintf('"%s" uses an unknown translation domain.', $path));
    }

    #[DataProvider('translationFiles')]
    public function testKeysAreSortedAndNested(string $path): void
    {
        $this->assertSortedAndNested(Yaml::parseFile($path), basename($path));
    }

    public static function translationFiles(): iterable
    {
        $files = Finder::create()->files()->in(\dirname(__DIR__, 2).'/translations')->name('*.yaml');

        foreach ($files as $file) {
            yield $file->getFilename() => [$file->getPathname()];
        }
    }

    private function assertSortedAndNested(array $messages, string $path): void
    {
        $keys = array_map('strval', array_keys($messages));
        $sorted = $keys;
        sort($sorted, \SORT_STRING);

        self::assertSame($sorted, $keys, \sprintf('Keys under "%s" are not sorted alphabetically.', $path));

        foreach ($messages as $key => $message) {
            self::assertStringNotContainsString('.', (string) $key, \sprintf('Key "%s.%s" should be nested instead of dotted.', $path, $key));

            if (\is_array($message)) {
                $this->assertSortedAndNested($message, $path.'.'.$key);
            }
        }
    }
}

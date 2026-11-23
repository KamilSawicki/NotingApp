<?php

namespace App\Translation;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Translation\MessageCatalogueInterface;
use Symfony\Component\Translation\TranslatorBagInterface;

/**
 * Translation domains passed to the Vue application.
 *
 * Messages use the ICU MessageFormat, so they live in translations/{domain}+intl-icu.{locale}.yaml.
 * Validators and emails stay on the backend: validation errors come translated in API responses.
 */
final readonly class FrontendTranslations
{
    public const array DOMAINS = ['messages', 'fields'];

    public function __construct(
        // TranslatorBagInterface (access to whole catalogues) has no autowiring alias; the translator implements it.
        #[Autowire(service: 'translator')]
        private TranslatorBagInterface $translator,
    ) {
    }

    /**
     * @return array<string, array<string, string>> domain => (message key => ICU message)
     */
    public function forLocale(string $locale): array
    {
        $catalogue = $this->translator->getCatalogue($locale);
        $translations = [];

        foreach (self::DOMAINS as $domain) {
            $translations[$domain] = $catalogue->all($domain.MessageCatalogueInterface::INTL_DOMAIN_SUFFIX);
        }

        return $translations;
    }
}

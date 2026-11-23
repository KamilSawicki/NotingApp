<script setup></script>

<template>
    <h1>{{ $t('not_found.title') }}</h1>
    <RouterLink :to="{ name: 'home' }">{{ $t('not_found.back') }}</RouterLink>
</template>

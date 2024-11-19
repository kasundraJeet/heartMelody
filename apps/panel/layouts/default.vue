<template>
    <main class="layout-wrapper">
        <LayoutSideBar />
        <section class="w-full h-full flex flex-col">
            <LayoutHeader />
            <ScrollArea class="h-full">
                <slot />
            </ScrollArea>
        </section>
    </main>
</template>
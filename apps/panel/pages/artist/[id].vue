<script setup></script>

<template>
    <div class="max-w-4xl p-2 mx-auto h-[93dvh]">
        <div class="w-full h-full flex items-stretch gap-3">
            <aside class="w-full h-full flex flex-col justify-between max-w-60">
                <ul class="w-full space-y-1.5">
                    <li>
                        <Button class="w-full justify-start" variant="ghost">
                            <Icon name="solar:face-scan-circle-linear" class="w-4 h-4" />
                            Personal Details
                        </Button>
                    </li>
                </ul>
            </aside>
            <div class="w-full bg-secondary h-full flex flex-col justify-between rounded-lg p-3.5">
                <div class="w-full h-full">
                    <div class="space-y-1">
                        <h1 class="text-xl font-semibold capitalize">artist personal Infomation</h1>
                        <p class="text-sm text-muted-foreground">Behind the Canvas: Personal Details of the Artist</p>
                    </div>
                    <div>

                    </div>
                </div>
                <div class="flex justify-end gap-2.5">
                    <Button variant="outline">Cancel</Button>
                    <Button>Continue</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<template>
    <div class="p-3.5 space-y-12">
        <div class="flex items-center justify-between">
            <div class="w-full">
                <div class="relative w-full max-w-sm items-center">
                    <Input id="search" type="text" placeholder="Search..." class="pl-8 bg-secondary" />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                        <Icon name="solar:magnifer-linear" class="w-4 h-5" />
                    </span>
                </div>
            </div>
            <div class="space-x-2 flex items-center">
                <Button variant="outline">
                    <Icon name="solar:import-broken" class="w-5 h-5" />
                    Import
                </Button>
                <Button variant="outline">
                    <Icon name="solar:export-broken" class="w-5 h-5" />
                    Export
                </Button>
                <Button>
                    <Icon name="solar:add-circle-broken" class="w-4 h-4" />
                    Add New
                </Button>
            </div>
        </div>
        <div class="w-full">
            <div class="w-full">
                <ul class="w-full grid grid-cols-5 gap-5">
                    <li class="artist-box">
                        <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRr2C7vN85FNbwRSVH1BGWAl0DRlvDccmWbsb9nhV7mrNYyUcBO"
                            alt="name" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<style scoped>
.artist-box {
    @apply w-full border border-border relative rounded-lg overflow-hidden h-[230px] hover:after:block after:hidden after:transition-colors shadow-sm after:absolute after:bottom-0 after:left-0 after:w-full after:bg-black after:h-full after:bg-opacity-20
}

.artist-box img {
    @apply absolute inset-0 w-full h-full object-cover
}
</style>
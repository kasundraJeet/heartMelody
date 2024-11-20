<script setup>
const navLink = [
    {
        id: "1",
        link_name: "Dashboard",
        link_path: "/",
        link_icon: "solar:home-2-broken",
        link_active: ["/"],
    },
    {
        id: "2",
        link_name: "Songs",
        link_path: "/",
        link_icon: "solar:music-note-2-broken",
        link_active: ["/"],
    },
    {
        id: "3",
        link_name: "Playlist",
        link_path: "/",
        link_icon: "solar:plaaylist-minimalistic-linear",
        link_active: ["/"],
    },
    {
        id: "4",
        link_name: "Artist",
        link_path: "/artist",
        link_icon: "solar:user-speak-broken",
        link_active: ["/"],
    }
]
</script>

<template>
    <aside class="sidebar">
        <ul class="space-y-1">
            <li v-for="item in navLink" :key="item.id">
                <Button variant="outline" as-child class="w-full justify-start">
                    <RouterLink :to="item.link_path">
                        <Icon :name="item.link_icon" class="w-5 h-5" />
                        {{ item.link_name }}
                    </RouterLink>
                </Button>
            </li>
        </ul>
        <div class="space-y-1">
            <Button variant="ghost" class="w-full justify-start">
                <Icon name="solar:card-transfer-broken" class="w-4 h-4" />
                Go To Analytics
            </Button>
            <Button variant="ghost" class="w-full justify-start text-destructive">
                <Icon name="solar:logout-2-broken" class="w-4 h-4" />
                Logout
            </Button>
        </div>
    </aside>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig()
import { ref } from 'vue'
import { LastFmApiWrapper } from '~/utils/lastFmApi';

const activeTab = ref(1)
const aiGenArtistName = ref('')
const aiGenArtistDialog = ref(false)
const aiGenArtistLoader = ref(false)
const aiGenArtistResult = ref('')
const selectedArtist = ref('')
const artistJSON = ref({
    'full_name': '',
    'stage_names': [],
    'original_name': '',
    'biography': '',
    'birth_date': '',
    'birth_place': '',
    'death_date': '',
    'debut_year': '',
    'age': '',
    'gender': '',
    'nationality': '',
    'genres': '',
    'languages_spoken': '',
    'official_website': '',
    'social_links': {
        "facebook": "",
        "twitter": "",
        "instagram": "",
        "youtube": "",
    },
})

function handleActiveTab(tabID) {
    activeTab.value = tabID
}

async function handleSearchArtist() {
    aiGenArtistLoader.value = true
    if (!aiGenArtistName.value) {
        toast.error('Please enter an artist name.');
        return;
    }
    try {
        const response = await LastFmApiWrapper(`${runtimeConfig.public.LAST_FM_BASE_URL}?method=artist.search&artist=${aiGenArtistName.value}&api_key=${runtimeConfig.public.LAST_FM_API_KEY}&format=json`);
        aiGenArtistResult.value = response.results.artistmatches.artist
    } catch (error) {
        console.error('Error searching artist:', error);
    }
    finally {
        aiGenArtistLoader.value = false
    }
}

async function handleSelectdArtist() {
    aiGenArtistLoader.value = true
    try {
        const response = await LastFmApiWrapper(`${runtimeConfig.public.LAST_FM_BASE_URL}?method=artist.getinfo&artist=${selectedArtist.value}&api_key=${runtimeConfig.public.LAST_FM_API_KEY}&format=json`);
        artistJSON.value.full_name = response.artist.name
        artistJSON.value.original_name = response.artist.name
        aiGenArtistDialog.value = false
    } catch (error) {
        console.error('Error searching artist:', error);
    }
    finally {
        aiGenArtistLoader.value = false
    }
}
</script>

<template>
    <div class="max-w-4xl p-2 mx-auto h-[93dvh]">
        <div class="w-full h-full flex items-stretch gap-3">
            <aside class="w-full h-full flex flex-col justify-between max-w-60">
                <ul class="w-full space-y-1.5">
                    <li>
                        <Button class="w-full justify-start" @click="handleActiveTab(1)"
                            :variant="activeTab == 1 ? 'secondary' : 'ghost'">
                            <Icon name="solar:face-scan-circle-linear" class="w-4 h-4" />
                            Personal Details
                        </Button>
                    </li>
                    <li>
                        <Button class="w-full justify-start" @click="handleActiveTab(2)"
                            :variant="activeTab == 2 ? 'secondary' : 'ghost'">
                            <Icon name="solar:gallery-add-broken" class="w-4 h-4" />
                            Images
                        </Button>
                    </li>
                    <li>
                        <Button class="w-full justify-start" @click="handleActiveTab(3)"
                            :variant="activeTab == 3 ? 'secondary' : 'ghost'">
                            <Icon name="solar:music-note-2-broken" class="w-4 h-4" />
                            Songs
                        </Button>
                    </li>
                    <li>
                        <Button class="w-full justify-start" @click="handleActiveTab(4)"
                            :variant="activeTab == 4 ? 'secondary' : 'ghost'">
                            <Icon name="solar:turntable-music-note-broken" class="w-4 h-4" />
                            Albums
                        </Button>
                    </li>
                </ul>
                <Button class="w-full justify-start" variant="ghost" @click="aiGenArtistDialog = !aiGenArtistDialog">
                    <Icon name="solar:code-scan-bold-duotone" class="w-4 h-4" />
                    Generate By AI
                </Button>
            </aside>
            <div class="w-full bg-secondary h-full flex flex-col justify-between rounded-lg p-3.5">
                <ArtistInfomationTab v-if="activeTab == 1" />
                <ArtistImagesTab v-if="activeTab == 2" />
                <ArtistSongsTab v-if="activeTab == 3" />
                <ArtistAlbumsTab v-if="activeTab == 4" />
            </div>
        </div>
    </div>


    <Dialog :open="aiGenArtistDialog">
        <DialogScrollContent class="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle> {{ !aiGenArtistResult && aiGenArtistResult.length == 0 ? 'AI Generated Artist Infomation'
                    : 'Select Artist' }} </DialogTitle>
            </DialogHeader>
            <div class="py-4">
                <div class="space-y-2" v-if="!aiGenArtistResult && aiGenArtistResult.length == 0">
                    <Label for="name" class="text-right">
                        Name
                    </Label>
                    <Input id="artist_name" placeholder="Dua Lipa" v-model="aiGenArtistName" />
                </div>
                <div v-else>
                    <ul class="grid grid-cols-3 gap-2.5">
                        <li class="border rounded-lg" v-for="artist in aiGenArtistResult" :key="artist.listeners"
                            @click="selectedArtist = artist.name"
                            :class="selectedArtist == artist.name ? 'border-primary' : 'border-transparent'">
                            <AspectRatio :ratio="8 / 8">
                                <img :src="artist.image[1]['#text']" :alt="artist.name"
                                    class="rounded-md object-cover w-full h-full">
                            </AspectRatio>
                        </li>
                    </ul>
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button variant="outline" :disabled="aiGenArtistLoader">
                        Cancel
                    </Button>
                </DialogClose>
                <Button v-if="!aiGenArtistResult && aiGenArtistResult.length == 0" @click="handleSearchArtist"
                    :disabled="aiGenArtistLoader">
                    <Icon name="ri:loader-2-line" class="w-4 h-4 animate-spin" v-if="aiGenArtistLoader" />
                    Search Artist
                </Button>
                <Button v-else @click="handleSelectdArtist" :disabled="aiGenArtistLoader || !selectedArtist">
                    <Icon name="ri:loader-2-line" class="w-4 h-4 animate-spin" v-if="aiGenArtistLoader" />
                    Set Artist
                </Button>
            </DialogFooter>
        </DialogScrollContent>
    </Dialog>
</template>
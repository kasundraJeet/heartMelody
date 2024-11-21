<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(50),
    fruits: z.array(z.string()).min(1).max(3),
}))

const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        fruits: ['Apple', 'Banana'],
    },
})

const onSubmit = handleSubmit((values) => {
    console.log(values)
})
</script>

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
            <div class="w-full space-y-8">
                <ul class="w-full grid grid-cols-5 gap-5">
                    <ContextMenu as="li">
                        <ContextMenuTrigger>
                            <div class="artist-box">
                                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRr2C7vN85FNbwRSVH1BGWAl0DRlvDccmWbsb9nhV7mrNYyUcBO"
                                    alt="name" />
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent class="w-56">
                            <ContextMenuItem>
                                <Icon name="solar:user-circle-broken" class="w-5 h-5 mr-2" />
                                Profile
                                <ContextMenuShortcut>
                                    ⌘+P
                                </ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuItem>
                                <Icon name="solar:pen-broken" class="w-5 h-5 mr-2" />
                                Edit
                                <ContextMenuShortcut>
                                    ⌘+U
                                </ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuItem>
                                <Icon name="solar:music-notes-broken" class="w-5 h-5 mr-2" />
                                Songs
                                <ContextMenuShortcut>
                                    ⌘+S
                                </ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem as-child>
                                <AlertDialog>
                                    <AlertDialogTrigger as-child>
                                        <Button variant="ghost"
                                            class="px-2 py-1.5 text-sm text-destructive h-auto justify-between w-full">
                                            <Icon name="solar:trash-bin-minimalistic-broken" class="w-5 h-5" />
                                            Delete
                                            <ContextMenuShortcut>⌘+DEL</ContextMenuShortcut>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Yes, Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </ul>
                <div class="flex items-center justify-center gap-3">
                    <Button variant="outline">
                        <Icon name="ri:loader-2-line" class="w-5 h-5" />
                        Show More
                    </Button>
                </div>
            </div>
        </div>
    </div>
    <Sheet :open="false">
        <SheetContent class="flex flex-col p-0">
            <SheetHeader class="p-3 pb-0">
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                    Make changes to your profile here. Click save when you're done.
                </SheetDescription>
            </SheetHeader>
            <form class="w-full h-full flex flex-col justify-between" @submit="onSubmit">
                <ScrollArea class="h-full w-full overflow-x-visible">
                    <div class="space-y-3 overflow-x-visible p-3">
                        <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ value }" name="fruits">
                            <FormItem>
                                <FormLabel>Fruits</FormLabel>
                                <FormControl>
                                    <TagsInput :model-value="value">
                                        <TagsInputItem v-for="item in value" :key="item" :value="item">
                                            <TagsInputItemText />
                                            <TagsInputItemDelete />
                                        </TagsInputItem>

                                        <TagsInputInput placeholder="Fruits..." />
                                    </TagsInput>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                </ScrollArea>
                <div class="p-3 w-full">
                    <Button type="submit" class="w-full">
                        Submit
                    </Button>
                </div>
            </form>
        </SheetContent>
    </Sheet>

</template>


<style scoped>
.artist-box {
    @apply w-full border border-border relative rounded-lg overflow-hidden h-[230px] hover:after:block after:hidden after:transition-colors shadow-sm after:absolute after:bottom-0 after:left-0 after:w-full after:bg-black after:h-full after:bg-opacity-20
}

.artist-box img {
    @apply absolute inset-0 w-full h-full object-cover
}
</style>
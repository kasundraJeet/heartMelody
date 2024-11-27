<script setup>
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import randomArticle from '~/utils/articlesList.js'

const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
    dob: z
        .string()
        .refine(v => v, { message: 'A date of birth is required.' }),
}))

const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: formSchema,
})

const value = ref(today(getLocalTimeZone()))


const onSubmit = handleSubmit(async (values) => {
    console.log(values)
})
</script>

<template>
    <form class="w-full h-full flex flex-col" @submit="onSubmit">
        <div class="w-full h-full">
            <div class="space-y-1">
                <h1 class="text-xl font-semibold capitalize">artist personal Infomation</h1>
                <p class="text-sm text-muted-foreground">Behind the Canvas: Personal Details of the Artist</p>
            </div>
            <div class="py-6 space-y-3.5">
                <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                        <FormLabel>ArticleName</FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="randomArticle.author" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3.5">
                    <FormField v-slot="{ componentField }" name="dob" :validate-on-blur="!isFieldDirty">
                        <FormItem>
                            <FormLabel>Birthdate</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger as-child>
                                        <Button class="w-full justify-between h-10 shadow-none" variant="outline">
                                            {{ componentField }}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent class="p-0 w-fit border-none" align="end">
                                        <Calendar v-bind="componentField" class="rounded-md border w-full bg-white" />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
                        <FormItem>
                            <FormLabel>Birthdate Place</FormLabel>
                            <FormControl>
                                <Input type="text" :placeholder="randomArticle.place" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
            </div>
        </div>
        <div class="flex justify-end gap-2.5">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Continue</Button>
        </div>
    </form>
</template>

<style scoped>
label {
    @apply opacity-60 ml-1
}
</style>
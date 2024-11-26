<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod';
import { useForm } from 'vee-validate';

const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
}))

const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: formSchema,
})

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
            <div class="py-6">
                <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                        <FormLabel>ArticleName</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="shadcn" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>
        </div>
        <div class="flex justify-end gap-2.5">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Continue</Button>
        </div>
    </form>
</template>

<style scoped>
label{
    @apply opacity-60 ml-1
}
</style>
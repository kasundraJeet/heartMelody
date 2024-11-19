<script setup>
definePageMeta({
    layout: false,
})
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { ApiWrapper } from '../utils/apiWrapper';


const formSchema = toTypedSchema(z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
}));

const form = useForm({
    validationSchema: formSchema,
})

const isLoading = ref(false)

const onSubmit = form.handleSubmit(async (values) => {
    isLoading.value = true
    const form_data = new FormData();
    form_data.append("email", values.email);
    form_data.append("password", values.password);

    try {
        const response = await ApiWrapper("auth/sign-in", form_data);

        if (response.success == 1) {
            isLoading.value = false
            toast.success(response.message)
        }
        else {
            isLoading.value = false
            toast.error(response.message)
        }

    } catch (e) {
        isLoading.value = false
        toast.error(e)
        console.error("Error sending OTP:", e);
    }
});
</script>

<template>
    <NuxtLayout name="auth">
        <div class="lg:p-8">
            <div class="mx-auto flex w-full flex-col justify-center px-2 space-y-6 sm:w-[350px]">
                <div class="flex flex-col space-y-2 text-center">
                    <h1 class="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p class="text-sm text-muted-foreground">
                        Enter your email below to create your account
                    </p>
                </div>
                <div class="space-y-6">
                    <form @submit.prevent="onSubmit">
                        <div class="grid gap-4">
                            <div class="w-full space-y-2">
                                <FormField v-slot="{ componentField }" name="email" class="grid gap-1">
                                    <FormItem>
                                        <FormLabel class="sr-only" for="email"> Email</FormLabel>
                                        <FormControl>
                                            <div class="grid gap-1">
                                                <Label class="sr-only" for="email">
                                                    Email
                                                </Label>
                                                <Input id="email" placeholder="name@example.com" type="email"
                                                    auto-capitalize="none" auto-complete="email" auto-correct="off"
                                                    :disabled="isLoading" v-bind="componentField" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                                <FormField v-slot="{ componentField }" name="password" class="grid gap-1">
                                    <FormItem>
                                        <FormLabel class="sr-only" for="password"> Password</FormLabel>
                                        <FormControl>
                                            <div class="grid gap-1">
                                                <Label class="sr-only" for="password">
                                                    Password
                                                </Label>
                                                <Input id="password" placeholder="Password" type="password"
                                                    auto-capitalize="none" auto-complete="password" auto-correct="off"
                                                    :disabled="isLoading" v-bind="componentField" />
                                                <FormMessage />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                </FormField>
                            </div>
                            <Button :disabled="isLoading">
                                <Icon v-if="isLoading" name="eos-icons:loading" class="w-4 h-4" />
                                Login
                            </Button>
                        </div>
                    </form>
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <span class="w-full border-t" />
                        </div>
                        <div class="relative flex justify-center text-xs uppercase">
                            <span class="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Button variant="outline" type="button" class="w-full" :disabled="isLoading">
                            <Icon v-if="isLoading" name="eos-icons:loading" class="w-4 h-4" />
                            <Icon name="uil:github" class="w-4 h-4" />
                            GitHub
                        </Button>
                    </div>
                </div>
                <p class="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our
                    <a href="/terms" class="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </a>
                    and
                    <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
                        Privacy Policy.
                    </a>
                </p>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useLayout } from '@/layout/composables/layout';

defineProps({
    simple: {
        type: Boolean,
        default: false
    }
});

const $primevue = usePrimeVue();
const inputStyle = computed(() => $primevue.config.inputStyle || 'outlined');

const scales = ref([12, 13, 14, 15, 16]);
const visible = ref(false);
const inputStyles = ref([
    { label: 'Outlined', value: 'outlined' },
    { label: 'Filled', value: 'filled' }
]);
const menuModes = ref([
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' }
]);
const compactMaterial = ref(false);
const primaryFocusRing = ref(true);

const { setScale, layoutConfig } = useLayout();

const onConfigButtonClick = () => {
    visible.value = !visible.value;
};
const onChangeTheme = (theme, mode) => {
    $primevue.changeTheme(layoutConfig.theme.value, theme, 'theme-css', () => {
        layoutConfig.theme.value = theme;
        layoutConfig.darkTheme.value = mode;
    });
};
const decrementScale = () => {
    setScale(layoutConfig.scale.value - 1);
    applyScale();
};
const incrementScale = () => {
    setScale(layoutConfig.scale.value + 1);
    applyScale();
};
const applyScale = () => {
    document.documentElement.style.fontSize = layoutConfig.scale.value + 'px';
};
const onInputStyleChange = (value) => {
    $primevue.config.inputStyle = value;
};
const onMenuModeChange = (value) => {
    layoutConfig.menuMode.value = value;
};
const onRippleChange = (value) => {
    layoutConfig.ripple.value = value;
};
const onDarkModeChange = (value) => {
    const newThemeName = value ? layoutConfig.theme.value.replace('light', 'dark') : layoutConfig.theme.value.replace('dark', 'light');

    layoutConfig.darkTheme.value = value;
    onChangeTheme(newThemeName, value);
};
const changeTheme = (theme, color) => {
    let newTheme, dark;

    newTheme = theme + '-' + (layoutConfig.darkTheme.value ? 'dark' : 'light');

    if (color) {
        newTheme += '-' + color;
    }

    if (newTheme.startsWith('md-') && compactMaterial.value) {
        newTheme = newTheme.replace('md-', 'mdc-');
    }

    dark = layoutConfig.darkTheme.value;

    onChangeTheme(newTheme, dark);
};
const isThemeActive = (themeFamily, color) => {
    let themeName;
    let themePrefix = themeFamily === 'md' && compactMaterial.value ? 'mdc' : themeFamily;

    themeName = themePrefix + (layoutConfig.darkTheme.value ? '-dark' : '-light');

    if (color) {
        themeName += '-' + color;
    }

    return layoutConfig.theme.value === themeName;
};
const onCompactMaterialChange = (value) => {
    compactMaterial.value = value;

    if (layoutConfig.theme.value.startsWith('md')) {
        let tokens = layoutConfig.theme.value.split('-');

        changeTheme(tokens[0].substring(0, 2), tokens[2]);
    }
};
const onFocusRingColorChange = (value) => {
    primaryFocusRing.value = value;
    let root = document.documentElement;

    if (value) {
        if (layoutConfig.darkTheme.value) root.style.setProperty('--p-focus-ring-color', 'var(--primary-500)');
        else root.style.setProperty('--p-focus-ring-color', 'var(--primary-500)');
    } else {
        if (layoutConfig.darkTheme.value) root.style.setProperty('--p-focus-ring-color', 'var(--surface-500)');
        else root.style.setProperty('--p-focus-ring-color', 'var(--surface-900)');
    }
};
</script>

<template>
    <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
        <i class="pi pi-cog"></i>
    </button>

    <Sidebar v-model:visible="visible" position="right" class="layout-config-sidebar w-26rem" pt:closeButton="ml-auto">
        <div class="p-2">
            <section class="pb-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                <span class="text-xl font-semibold">Scale</span>
                <div class="flex align-items-center gap-2 border-1 surface-border py-1 px-2" style="border-radius: 30px">
                    <Button icon="pi pi-minus" @click="decrementScale" text rounded :disabled="layoutConfig.scale.value === scales[0]" />
                    <i v-for="s in scales" :key="s" :class="['pi pi-circle-fill text-sm text-200', { 'text-lg text-primary': s === layoutConfig.scale.value }]" />

                    <Button icon="pi pi-plus" @click="incrementScale" text rounded :disabled="layoutConfig.scale.value === scales[scales.length - 1]" />
                </div>
            </section>

            <section class="py-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                <span :class="['text-xl font-semibold']">Dark Mode</span>
                <InputSwitch :modelValue="layoutConfig.darkTheme.value" @update:modelValue="onDarkModeChange" />
            </section>

            <template v-if="!simple">
                <section class="py-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                    <span class="text-xl font-semibold">Menu Type</span>
                    <SelectButton :modelValue="layoutConfig.menuMode.value" @update:modelValue="onMenuModeChange" :options="menuModes" optionLabel="label" optionValue="value" :allowEmpty="false" />
                </section>

                <section class="py-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                    <span class="text-xl font-semibold">Input Variant</span>
                    <SelectButton :modelValue="inputStyle" @update:modelValue="onInputStyleChange" :options="inputStyles" optionLabel="label" optionValue="value" :allowEmpty="false" />
                </section>
            </template>

            <section class="py-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                <span class="text-xl font-semibold">Ripple Effect</span>
                <InputSwitch :modelValue="layoutConfig.ripple.value" @update:modelValue="onRippleChange" />
            </section>

            <section class="py-4 border-bottom-1 surface-border">
                <div class="text-xl font-semibold mb-3">Themes</div>
                <div class="flex align-items-center gap-2 mb-3">
                    <img src="https://primefaces.org/cdn/primevue/images/themes/aura.png" alt="Aura" style="width: 1.5rem" />
                    <span class="font-medium">Aura</span>
                </div>
                <div class="flex align-items-center justify-content-start gap-3 mb-3">
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'indigo'), 'hover:border-500 surface-border': !isThemeActive('aura', 'indigo') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'indigo')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #585fe0 0%, rgba(88, 95, 224, 0.5) 100%)"></span>
                    </button>
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('aura', 'noir'), 'hover:border-500 surface-border': !isThemeActive('aura', 'noir') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('aura', 'noir')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #0f172a 0%, rgba(0, 0, 0, 0.5) 100%)"></span>
                    </button>
                </div>

                <section class="pt-4 flex align-items-center justify-content-between">
                    <span class="text-sm">Primary Focus Ring</span>
                    <InputSwitch :modelValue="primaryFocusRing" @update:modelValue="onFocusRingColorChange" />
                </section>
            </section>

            <section class="py-4 border-bottom-1 surface-border">
                <div class="flex align-items-center gap-2 mb-3">
                    <img src="https://primefaces.org/cdn/primevue/images/themes/lara-light-teal.png" alt="Lara Light Teal" class="border-circle" style="width: 1.5rem" />
                    <span class="font-medium">Lara</span>
                </div>
                <div class="flex align-items-center justify-content-between gap-3 mb-3">
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('lara', 'indigo'), 'hover:border-500 surface-border': !isThemeActive('lara', 'indigo') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('lara', 'indigo')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #585fe0 0%, rgba(88, 95, 224, 0.5) 100%)"></span>
                    </button>
                </div>
            </section>

            <section class="py-4 border-bottom-1 surface-border">
                <div class="flex align-items-center gap-2 mb-3">
                    <img src="https://primefaces.org/cdn/primevue/images/themes/md-light-indigo.svg" alt="Material Design" class="border-circle" style="width: 1.5rem" />
                    <span class="font-medium">Material Design</span>
                    <div class="ml-auto flex align-items-center gap-2">
                        <label for="material-condensed" class="text-sm">Condensed</label>
                        <InputSwitch inputId="material-condensed" :modelValue="compactMaterial" @update:modelValue="onCompactMaterialChange" class="ml-auto" />
                    </div>
                </div>
                <div class="flex align-items-center justify-content-between gap-3">
                    <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('md', 'indigo'), 'hover:border-500 surface-border': !isThemeActive('md', 'indigo') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('md', 'indigo')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #0565f2 0%, rgba(5, 101, 242, 0.5) 100%)"></span>
                    </button>
                </div>
            </section>
        </div>
    </Sidebar>
</template>

<style lang="scss" scoped></style>

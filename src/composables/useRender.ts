import { Trash2 as DeleteIcon, AlertTriangle as FailedIcon, Star as StarIcon, CheckCircle as SuccessIcon, MoreHorizontal } from 'lucide-vue-next'
import { NBadge, NButton, NIcon, NCard, NModal, NImage, NPopconfirm, NSpace, NTag, NText, NDropdown } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { i18n } from '@/plugins/i18n'
import defaultAvatar from '@/assets/images/avatar/default.png'
import { h, ref } from 'vue'

export function useRender() {
    const { t } = i18n.global

    function renderLabel(title: string, path: string, isNew = false) {
        return h(
            RouterLink,
            { to: { path } },
            {
                default: () => [
                    h(NText, { class: 'mx-2' }, { default: () => title }),
                    isNew && h(NTag, { type: 'primary', bordered: false, round: true, size: 'small' }, { default: () => t('common.new') })
                ]
            }
        )
    }

    function renderIcon(icon: any, showBadge = false) {
        if (showBadge) {
            return () =>
                h(
                    NBadge,
                    { processing: true, dot: true, type: 'success', offset: [-2, 2] },
                    { default: () => h(NIcon, {}, { default: () => h(icon) }) }
                )
        }
        return () => h(NIcon, {}, { default: () => h(icon) })
    }

    function renderTag(text: string, type: 'error' | 'default' | 'success' | 'warning' | 'primary' | 'info', stateEnum: any, typename: string, round = false, bordered = false) {
        return h(NTag, { type, bordered, round, size: 'small' }, { default: () => t(`enums.${typename}.${stateEnum[text]}`) })
    }

    function renderPrice(value: number, postfix = '') {
        return h(NText, {}, { default: () => value.toLocaleString() + postfix })
    }

    function renderRate(rate: number) {
        return [
            h(NIcon, { color: 'gold' }, { default: () => h(StarIcon) }),
            h(NText, { class: 'mx-2' }, { default: () => rate })
        ]
    }

    function renderProductImage(image: string, name: string) {
        return h(
            NSpace,
            { align: 'center' },
            {
                default: () => [
                    h(NImage, {
                        src: image,
                        fallbackSrc: '/assets/images/fallback.png',
                        width: 34,
                        height: 34,
                        objectFit: 'contain',
                        showToolbar: false,
                        alt: name,
                        style: { 'border-radius': '3px' }
                    }),
                    h(NText, {}, { default: () => name })
                ]
            }
        )
    }

    function renderUserAvatar(image: string, username: string, email?: string) {
        return h(
            NSpace,
            { align: 'center' },
            {
                default: () => [
                    image ? h(NImage, {
                        src: image,
                        fallbackSrc: defaultAvatar,
                        width: 38,
                        height: 38,
                        objectFit: 'contain',
                        showToolbar: false,
                        style: { 'border-radius': '50%' }
                    }) : null,
                    h('div', { class: 'flex flex-col' }, [
                        h(NText, { depth: 1, strong: true }, { default: () => username }),
                        email && h(NText, { depth: 3, size: 'small', class: 'text-xs' }, { default: () => email })
                    ])
                ]
            }
        )
    }

    function renderConfirmStatus(status: boolean, label: string) {
        const icon = status ? SuccessIcon : FailedIcon
        const iconColor = status ? 'green' : 'orange'
        return h(
            NSpace,
            { align: 'center', justify: 'start' },
            {
                default: () => [
                    h(NIcon, { color: iconColor, size: 'large' }, { default: () => h(icon) }),
                    h(NText, {}, { default: () => label })
                ]
            }
        )
    }

    function renderText(text: string) {
        return h(NText, {}, { default: () => text })
    }

    function renderDate(date: string) {
        return h(NText, {}, { default: () => new Date(date).toLocaleDateString() })
    }

    function renderActionButton(icon: any, onClickAction: any, iconColor?: string) {
        return h(NButton, {
            size: 'medium',
            quaternary: true,
            circle: true,
            renderIcon: () => h(NIcon, { color: iconColor }, { default: () => h(icon) }),
            onClick: onClickAction
        })
    }

    function renderDeleteActionButton(confirmMessage: string, confirmAction: any, iconColor?: string) {
        return h(
            NPopconfirm,
            {
                onPositiveClick: confirmAction,
                positiveText: t('common.confirm'),
                negativeText: t('common.cancel'),
                negativeButtonProps: { ghost: true, type: 'tertiary' }
            },
            {
                trigger: () =>
                    h(NButton, {
                        size: 'medium',
                        quaternary: true,
                        circle: true,
                        renderIcon: () => h(NIcon, { color: iconColor || '#d03050' }, { default: () => h(DeleteIcon) }),
                        onClick: () => null
                    }),
                default: () => confirmMessage
            }
        )
    }


    function renderConfirmAlertButton(
        confirmMessage: string,
        confirmAction: () => void,
        iconColor?: string
    ) {
        const showModal = ref(false);

        const open = () => (showModal.value = true);
        const close = () => (showModal.value = false);

        return h("div", [
            // Button trigger
            h(NButton, {
                size: "medium",
                quaternary: true,
                circle: true,
                renderIcon: () =>
                    h(
                        NIcon,
                        { color: iconColor || "#d03050" },
                        { default: () => h(DeleteIcon) }
                    ),
                onClick: open
            }),

            // Modal itself
            h(
                NModal,
                {
                    show: showModal.value,
                    onUpdateShow: (v: boolean) => (showModal.value = v)
                },
                {
                    default: () =>
                        h(
                            NCard,
                            {
                                style: "width: 360px;",
                                title: "Confirm",
                                bordered: false,
                                size: "small"
                            },
                            {
                                default: () => confirmMessage,
                                footer: () =>
                                    h("div", { class: "flex justify-end gap-2" }, [
                                        h(
                                            NButton,
                                            { size: "small", quaternary: true, onClick: close },
                                            { default: () => "Cancel" }
                                        ),
                                        h(
                                            NButton,
                                            {
                                                size: "small",
                                                type: "error",
                                                onClick: () => {
                                                    confirmAction();
                                                    close();
                                                }
                                            },
                                            { default: () => "Delete" }
                                        )
                                    ])
                            }
                        )
                }
            )
        ]);
    }


    function renderActionLabel(text: string, onClickAction: any) {
        return h(NText, { onClick: onClickAction }, { default: () => text })
    }

    function renderDropdownMenu(options: any[], onSelect: (key: string | number) => void) {
        return h(
            NDropdown,
            { trigger: 'hover', options, onSelect },
            {
                default: () =>
                    h(NButton, { quaternary: true, circle: true, size: 'small' }, {
                        icon: () => h(NIcon, null, { default: () => h(MoreHorizontal) })
                    })
            }
        )
    }

    return {
        renderIcon,
        renderTag,
        renderPrice,
        renderRate,
        renderProductImage,
        renderUserAvatar,
        renderLabel,
        renderText,
        renderDate,
        renderActionButton,
        renderConfirmStatus,
        renderActionLabel,
        renderDeleteActionButton,
        renderDropdownMenu,
        renderConfirmAlertButton
    }
}
# Icon Component Usage Guide

The `Icon` component is a reusable wrapper for Lucide icons with Naive UI's NIcon.

## Import

```vue
import Icon from '@/components/common/Icon.vue'
```

## Props

- **name** (required): The name of the Lucide icon (e.g., 'Plus', 'Edit', 'Trash', 'User')
- **size**: Icon size in pixels (default: 20)
- **color**: Icon color (optional)
- **strokeWidth**: Stroke width (default: 2)

## Examples

### Basic Usage

```vue
<Icon name="Plus" />
<Icon name="Edit" />
<Icon name="Trash" />
```

### With Custom Size

```vue
<Icon name="User" :size="24" />
<Icon name="Settings" :size="32" />
```

### With Custom Color

```vue
<Icon name="Check" color="green" />
<Icon name="X" color="red" />
```

### In Button Icon Slot

```vue
<NButton type="primary">
  <template #icon>
    <Icon name="Plus" />
  </template>
  Add Item
</NButton>
```

### Standalone with Custom Styling

```vue
<Icon name="AlertCircle" :size="48" color="#ff6b6b" :stroke-width="1.5" />
```

## Available Lucide Icons

You can use any icon from [Lucide Icons](https://lucide.dev/icons/). Common examples:

- **Actions**: Plus, Edit, Trash, Save, Download, Upload
- **Navigation**: ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Menu
- **UI**: X, Check, AlertCircle, Info, Settings
- **Users**: User, Users, UserPlus
- **Files**: File, FileText, Folder, FolderOpen
- **Communication**: Mail, Phone, MessageCircle
- **And many more...**

## Notes

- Icon names are case-sensitive and should match the Lucide icon name exactly
- The component automatically wraps the icon in NIcon for consistent styling
- Works seamlessly with Naive UI's theming system

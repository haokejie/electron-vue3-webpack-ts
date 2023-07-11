// MyComponent.tsx
import { defineComponent } from 'vue'

import { Rate } from 'ant-design-vue'

export default defineComponent({

  setup () {
    const vvv = ref(3)
    return () => (<Rate v-model:value={vvv.value} >
     </Rate>)
  }
})

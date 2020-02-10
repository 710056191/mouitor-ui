<template>
  <UploadComponents url="http://192.168.2.114:8070/manufacturer/manuUpload.do" type="picture-card" param="imgFile" />
</template>

<script>
import UploadComponents from '@/components/UploadComponents'
export default {
  components: {
    UploadComponents,
  },
  data() {
    return {

    }
  },
}
</script>

<style>

</style>
